import os
import re
import nltk
import docx
import fitz  # PyMuPDF
import io
import google.generativeai as genai
from nltk.tokenize import sent_tokenize
from dotenv import load_dotenv

# Load env and configure
load_dotenv()
genai.configure(api_key=os.getenv("API_KEY"))
nltk.download("punkt")

# ---------------- TEXT EXTRACTION ----------------

def extract_text(file_storage):
    ext = os.path.splitext(file_storage.filename)[1].lower()

    if ext == ".pdf":
        return extract_text_from_pdf(file_storage)
    elif ext == ".docx":
        return extract_text_from_docx(file_storage)
    elif ext == ".txt":
        return file_storage.read().decode("utf-8")
    else:
        raise ValueError("Unsupported file type")


def extract_text_from_pdf(file_storage):
    text = ""
    file_bytes = file_storage.read()
    pdf_doc = fitz.open(stream=file_bytes, filetype="pdf")
    for page in pdf_doc:
        text += page.get_text() + "\n"
    return text


def extract_text_from_docx(file_storage):
    file_bytes = file_storage.read()
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])


# ---------------- CLEANING & CHUNKING ----------------

def clean_text(text):
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[\r\n]+", "\n", text)
    return text.strip()


def chunk_text(text, chunk_size=4000, overlap=150):
    sentences = sent_tokenize(text)
    if not sentences:
        return []

    chunks = []
    current_chunk = []
    total_words = 0

    for sentence in sentences:
        words = sentence.split()
        if total_words + len(words) <= chunk_size:
            current_chunk.append(sentence)
            total_words += len(words)
        else:
            chunks.append(" ".join(current_chunk))
            all_words = " ".join(current_chunk).split()
            overlap_words = all_words[-overlap:] if len(all_words) >= overlap else all_words
            current_chunk = [" ".join(overlap_words), sentence]
            total_words = len(overlap_words) + len(words)

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


# ---------------- GEMINI NOTE GENERATION ----------------

def generate_notes(chunk):
    model = genai.GenerativeModel("models/gemini-1.5-flash")
    prompt = (
        """You are a highly knowledgeable academic assistant.
        Your task is to generate concise, structured, and exam-focused study notes from the following academic or textbook content.

        Instructions:

        Carefully read and understand the provided text.

        Identify and structure the notes topic-wise or section-wise.

        For each topic, include:

        ✅ A brief summary in 1–3 sentences

        ✅ Definitions of important terms

        ✅ Key concepts explained clearly

        ✅ Bullet points for facts, principles, and examples

        ✅ Headings and subheadings for clarity:\n\n"""

        f"{chunk}\n\n"

        "Now generate clean, organized, and easy-to-revise study notes based on the above content. Use academic tone and clarity."
    )

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"❌ Gemini generation failed: {e}")
        return "[Error generating notes for this chunk]"


# ---------------- MAIN ENTRY ----------------

def generate_note_from_file(file_storage):
    # Reset file pointer before each read (important for Flask FileStorage)
    file_storage.stream.seek(0)
    raw = extract_text(file_storage)

    file_storage.stream.seek(0)  # Reset again for DOCX/PDF reads if needed
    cleaned = clean_text(raw)
    chunks = chunk_text(cleaned)

    all_notes = []
    print("📘 Generating notes...")

    for i, chunk in enumerate(chunks):
        print(f"➡️  Processing chunk {i+1}/{len(chunks)}")
        notes = generate_notes(chunk)
        all_notes.append(notes)

    return "\n\n".join(all_notes)
