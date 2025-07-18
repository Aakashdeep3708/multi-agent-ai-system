import os
import re
from flask import Flask
from flask_cors import CORS
from docx import Document
import fitz  # PyMuPDF
import google.generativeai as genai
from dotenv import load_dotenv

# --- Load env + configure Gemini ---
load_dotenv()
genai.configure(api_key=os.getenv("API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash")

# --- Flask setup ---
app = Flask(__name__)
CORS(app)

# --- Core Logic Functions ---
def extract_text(file):
    filename = file.filename.lower()
    if filename.endswith(".pdf"):
        doc = fitz.open(stream=file.read(), filetype="pdf")
        return "\n".join(page.get_text() for page in doc)
    elif filename.endswith(".docx"):
        doc = Document(file)
        return "\n".join(p.text for p in doc.paragraphs)
    elif filename.endswith(".txt"):
        return file.read().decode("utf-8")
    return None

def clean_text(text):
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9.,;!?()\"'’“”\- ]", "", text)
    return text.strip()

def chunk_text(text, max_words=4000, overlap=100):
    words = text.split()
    chunks = []

    i = 0
    while i < len(words):
        chunk = words[i:i + max_words]
        chunks.append(" ".join(chunk))
        i += max_words - overlap  # move forward with overlap

    return chunks

def generate_qa(text_chunk, num_questions):
    prompt = f"""
Generate {num_questions} question-answer pairs from the following text:

\"\"\"{text_chunk}\"\"\"

Only use the information in the text. Format each pair clearly:
Q1: <your question here>
A1: <your answer here>
Q2: ...
A2: ...
(Continue like this up to Q{num_questions})
"""
    try:
        response = model.generate_content(prompt)
        output = response.text.strip() if response and response.text else ""

        print("Gemini Output:\n", output)  # DEBUG LOG

        # Extract Q&A pairs
        qa_pattern = re.findall(r"Q\d+:\s*(.*?)\s*A\d+:\s*(.*?)(?=\nQ\d+:|\Z)", output, re.DOTALL)
        if qa_pattern:
            return [{"question": q.strip(), "answer": a.strip()} for q, a in qa_pattern]
        else:
            return [{"question": "Could not parse output", "answer": output}]
    except Exception as e:
        return [{"question": "Error", "answer": str(e)}]

# --- Main Pipeline Function (called by route) ---
def handle_qa_pipeline(file, num_questions):
    raw_text = extract_text(file)
    if not raw_text:
        return {"error": "Unsupported or empty file"}, 400

    cleaned = clean_text(raw_text)
    chunks = chunk_text(cleaned)
    qa_pairs = []

    for chunk in chunks:
        remaining = num_questions - len(qa_pairs)
        if remaining <= 0:
            break  # already got enough QAs

        raw_pairs = generate_qa(chunk, remaining)
        qa_pairs.extend(raw_pairs)

    # Trim extra if Gemini generated more
    qa_pairs = qa_pairs[:num_questions]

    return {"qa_pairs": qa_pairs}, 200





