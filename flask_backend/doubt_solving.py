import easyocr
from PIL import Image
import io
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'], gpu=False)

# Configure Gemini
GEMINI_API_KEY = os.getenv("API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-1.5-flash')


def extract_text_from_image(image_file):
    image = Image.open(image_file.stream).convert("RGB")
    img_bytes = io.BytesIO()
    image.save(img_bytes, format="JPEG")
    img_bytes.seek(0)
    result = reader.readtext(img_bytes.read())
    extracted_text = " ".join([text for (_, text, _) in result])
    return extracted_text.strip()


def solve_with_gemini(text):
    prompt = f"Please solve the following question or explain this doubt:\n\n{text}"
    response = model.generate_content(prompt)
    return response.text.strip()
