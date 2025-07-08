import os
import re
import fitz
import nltk
import docx2txt
import unicodedata
import numpy as np
from nltk.tokenize import word_tokenize
from flask import request, jsonify
from pymilvus import connections
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from db_setup import create_milvus_collection, insert_and_index_chunks

nltk.download("punkt")

# Load environment variables and connect to Milvus
genai.configure(api_key=os.getenv("API_KEY"))
connections.connect("default", host="localhost", port="19530")

COLLECTION_NAME = "rag_docs"
EMBEDDING_DIM = 768


def extract_text_from_file(path):
    ext = os.path.splitext(path)[1].lower()
    text = ""
    try:
        if ext == '.pdf':
            with fitz.open(path) as doc:
                for page in doc:
                    text += page.get_text()
        elif ext == '.docx':
            text = docx2txt.process(path)
        elif ext == '.txt':
            with open(path, 'r', encoding='utf-8') as f:
                text = f.read()
        else:
            raise ValueError(f"Unsupported file format: {ext}")
    except Exception as e:
        print(f"[ERROR] Failed to extract text: {e}")
    return text


def clean_extracted_text(raw_text):
    text = unicodedata.normalize("NFKD", raw_text)
    text = text.encode("ascii", "ignore").decode()
    text = re.sub(r'(Page\s*\d+|\d+\s*/\s*\d+)', '', text, flags=re.IGNORECASE)
    text = re.sub(r'[-_]{2,}', ' ', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def chunk_text(text, chunk_size=300, overlap=50):
    words = word_tokenize(text)
    chunks = []
    step = chunk_size - overlap
    for i in range(0, len(words), step):
        chunk = words[i:i + chunk_size]
        chunks.append(" ".join(chunk))
    return chunks


def get_qa_embeddings(chunks):
    model = SentenceTransformer('sentence-transformers/multi-qa-MiniLM-L6-cos-v1')
    embeddings = model.encode(chunks, convert_to_numpy=True, normalize_embeddings=True)
    return embeddings.tolist()


def search_chunks(collection, query, top_k=3):
    vector = get_qa_embeddings([query])[0]
    results = collection.search(
        data=[vector],
        anns_field="embedding",
        param={"metric_type": "L2", "params": {"nprobe": 10}},
        limit=top_k,
        output_fields=["text"]
    )
    hits = results[0] if results else []
    return [hit.entity.get("text", "") for hit in hits]


def generate_answer(chunks, question):
    context = "\n\n".join(chunks)
    prompt = f"""Use the context below to answer the question.\n\nContext:\n{context}\n\nQuestion: {question}\n\nAnswer:"""
    model = genai.GenerativeModel("models/gemini-2.0-flash-lite-001")
    response = model.generate_content(prompt)
    return response.text


def handle_rag_pipeline(file, question):
    path = os.path.join("temp", file.filename)
    os.makedirs("temp", exist_ok=True)
    file.save(path)
    try:
        raw_text = extract_text_from_file(path)
        clean_text = clean_extracted_text(raw_text)
        chunks = chunk_text(clean_text)
        vectors = get_qa_embeddings(chunks)
        collection = create_milvus_collection()
        insert_and_index_chunks(collection, vectors, chunks)
        top_chunks = search_chunks(collection, question)
        answer = generate_answer(top_chunks, question)
        return answer
    finally:
        os.remove(path)