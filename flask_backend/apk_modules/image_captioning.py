import easyocr
from PIL import Image
import io
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables (you must have .env with GEMINI_API_KEY)
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize OCR reader
reader = easyocr.Reader(['en'], gpu=False)

def generate_caption(image_file):
    # Step 1: OCR - Extract any visible text
    image = Image.open(image_file).convert("RGB")
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="PNG")
    image_bytes.seek(0)

    ocr_results = reader.readtext(image_bytes.getvalue())
    extracted_text = " ".join([text for _, text, _ in ocr_results]) or "No visible text detected"

    # Step 2: Gemini - Use extracted text to generate caption
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

    model = genai.GenerativeModel("models/gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text.strip()
