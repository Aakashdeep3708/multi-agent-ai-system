# extractive_summarizer.py

import os
import re
import fitz  # PyMuPDF
import docx
import nltk
import numpy as np
from nltk.tokenize import sent_tokenize
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('punkt')

def extract_text(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    elif ext == ".pdf":
        doc = fitz.open(file_path)
        return "\n".join(page.get_text() for page in doc)
    elif ext == ".docx":
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    else:
        raise ValueError("Unsupported file format")

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def split_into_chunks(sentences, chunk_size=30):
    return [sentences[i:i + chunk_size] for i in range(0, len(sentences), chunk_size)]

def summarize_chunks(chunks, model):
    summaries = []
    for chunk in chunks:
        embeddings = model.encode(chunk)
        similarity_matrix = cosine_similarity(embeddings)
        scores = similarity_matrix.sum(axis=1)
        k = max(1, len(chunk) // 5)
        top_k_idx = np.argsort(scores)[-k:]
        top_k_idx.sort()
        summaries.append(" ".join([chunk[i] for i in top_k_idx]))
    return summaries

def summarize_file(file_path):
    text = extract_text(file_path)
    cleaned = clean_text(text)
    sentences = sent_tokenize(cleaned)
    if not sentences:
        return "No content to summarize."
    chunks = split_into_chunks(sentences)
    model = SentenceTransformer('all-MiniLM-L6-v2')
    summaries = summarize_chunks(chunks, model)
    return "\n".join(summaries)
