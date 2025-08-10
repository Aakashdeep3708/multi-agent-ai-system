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
You are an intelligent academic assistant.

Your task is to generate clear, well-structured, and meaningful question-answer pairs from the provided academic or textbook content.

Instructions:

1. Carefully analyze the given content to understand its structure, main ideas, and important details.

2. Generate a total of {num_questions * 3} question-answer pairs, equally divided into three difficulty levels:
   - Basic: Focus on factual recall, terminology, and simple definitions.
   - Intermediate: Test comprehension, relationships between concepts, or applications.
   - Advanced: Require analysis, inference, reasoning, or multi-step understanding.

Guidelines:

- Base all questions and answers solely on the information provided in the content.
- Do **not** include any difficulty level tags (like “Easy”, “Medium”, “Hard”) in the output.
- Avoid unnecessary phrases like “According to the text.”
- Ensure questions are diverse, relevant, and appropriate to their intended difficulty.
- Keep answers concise, accurate, and informative.
- Maintain a clean format with clearly numbered Q&A pairs.

Format the output exactly as shown below:

Q1:  
A1:  
Q2:  
A2:  
...

Content:

\"\"\"{text_chunk}\"\"\"

Now generate exactly {num_questions} question-answer pairs for each difficulty level (basic, intermediate, advanced), for a total of {num_questions * 3} Q&A pairs.

"""
    try:
        response = model.generate_content(prompt)
        output = response.text.strip() if response and response.text else ""

        # print("Gemini Output:\n", output)  # DEBUG LOG

        # Extract Q&A pairs
        qa_pattern = re.findall(r"Q\d+:\s*(.*?)\s*A\d+:\s*(.*?)(?:\*\*?.*?Level\*\*?|🔹 Easy Level|🔸 Medium Level|🔴 Hard Level)?(?=\nQ\d+:|\Z)", output, re.DOTALL)
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
    qa_pairs = qa_pairs[:num_questions * 3]

    return {"qa_pairs": qa_pairs}, 200





