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
- If the image contains readable text, include that text meaningfully in the caption.
- If no text is found, describe the visual content of the image in detail.

Extracted Text (if any):
{extracted_text}

Now generate a meaningful and context-aware caption:
"""


    model = genai.GenerativeModel("models/gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text.strip()
