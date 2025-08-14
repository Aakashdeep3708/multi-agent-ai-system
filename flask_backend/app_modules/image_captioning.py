import easyocr
from PIL import Image
import numpy as np
import io
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")
genai.configure(api_key=api_key)

reader = easyocr.Reader(['en'], gpu=False)

def generate_caption(image_file):
    image = Image.open(image_file).convert("RGB")
    image_np = np.array(image)  # For EasyOCR
    
    ocr_results = reader.readtext(image_np)
    extracted_text = " ".join([res[1] for res in ocr_results if len(res) > 1]) or "No visible text detected"

    prompt = f"""
You are an advanced image captioning AI.
Instructions:
Analyze the uploaded image, which may be in JPG or other common formats.
If the image contains any readable or OCR-extracted text, integrate that text meaningfully into the caption.
If no text is detected, describe the visual content of the image in clear, accurate language.
Caption Length Guidelines (based on image type):
If it is a normal image (e.g., scenery, objects, people), limit the caption to around 20 words.
If it resembles a journalistic or news-style image, limit the caption to around 28 words.
If it is a scientific, academic, or technical image, allow 50 words or more, ensuring clarity and detail.
Extracted Text (if any):
{extracted_text}
Now generate a context-aware, natural-sounding caption that reflects the content, purpose, and style of the image. Adjust length accordingly.
"""

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text.strip()
