# summarizer.py

import os
import fitz  # PyMuPDF
import docx
from dotenv import load_dotenv
from nltk.tokenize import sent_tokenize
import nltk
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash")
nltk.download('punkt', quiet=True)

def extract_text_from_pdf(file_path):
    with fitz.open(file_path) as doc:
        return "".join([page.get_text() for page in doc])

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join(para.text for para in doc.paragraphs)

def extract_text_from_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def chunk_text(text, max_tokens=3000):
    sentences = sent_tokenize(text)
    chunks, chunk = [], ""
    for sentence in sentences:
        if len(chunk.split()) + len(sentence.split()) < max_tokens:
            chunk += sentence + " "
        else:
            chunks.append(chunk.strip())
            chunk = sentence + " "
    if chunk:
        chunks.append(chunk.strip())
    return chunks

def summarize_with_gemini(text):
    prompt = f"Summarize the following content in clear language:\n\n{text}"
    response = model.generate_content(prompt)
    return response.text.strip()

def summarize_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        raw_text = extract_text_from_pdf(file_path)
    elif ext == ".docx":
        raw_text = extract_text_from_docx(file_path)
    elif ext == ".txt":
        raw_text = extract_text_from_txt(file_path)
    else:
        raise ValueError("Unsupported file type. Please use PDF, DOCX, or TXT.")

    chunks = chunk_text(raw_text)
    summaries = [summarize_with_gemini(chunk) for chunk in chunks]
    final_summary = summarize_with_gemini(" ".join(summaries))

    return final_summary
