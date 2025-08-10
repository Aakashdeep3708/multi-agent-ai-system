from flask import Blueprint, Flask, request, jsonify, session
from flask_cors import CORS
import cv2
import numpy as np
import base64
import pyodbc
import os
import json
import bcrypt
from insightface.app import FaceAnalysis
from dotenv import load_dotenv

import tempfile
from app_modules.summarisation.abs_summarisation import summarize_file as abs_summarize
from app_modules.summarisation.ext_summarisation import summarize_file as ext_summarize
from app_modules.image_captioning import generate_caption
from app_modules.rag import handle_rag_pipeline
from app_modules.qaGenerator import handle_qa_pipeline
from app_modules.doubt_solving import extract_text_from_image, solve_with_gemini
from app_modules.notes import generate_note_from_file

from werkzeug.utils import secure_filename

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

# Enable CORS
CORS(app, supports_credentials=True, origins=["*"])

# Load InsightFace model
face_app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
face_app.prepare(ctx_id=0)

# SQL Server Connection
conn = pyodbc.connect(
    f"DRIVER={os.getenv('SQL_DRIVER')};"
    f"SERVER={os.getenv('SQL_SERVER')};"
    f"DATABASE={os.getenv('SQL_DATABASE')};"
    f"UID={os.getenv('SQL_USER')};"
    f"PWD={os.getenv('SQL_PASSWORD')}"
)
cursor = conn.cursor()

# Create userAuthentication table if not exists
cursor.execute("""
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='userAuthentication' and xtype='U')
BEGIN
    CREATE TABLE userAuthentication (
        id INT IDENTITY(1,1) PRIMARY KEY,
        first_name NVARCHAR(255) NOT NULL,
        last_name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) UNIQUE NOT NULL,
        password_hash VARBINARY(MAX) NOT NULL,
        image_embedding VARBINARY(MAX) NOT NULL,
        role NVARCHAR(50) DEFAULT 'user'
) END
""")

# Create UserLogs table if not exists
cursor.execute("""
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserLogs' and xtype='U')
BEGIN
    CREATE TABLE UserLogs (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT FOREIGN KEY REFERENCES userAuthentication(id),
        action NVARCHAR(100) NOT NULL,
        timestamp DATETIME DEFAULT GETDATE(),
        ip_address NVARCHAR(100) NULL,
        method NVARCHAR(50) NULL
) END
""")
conn.commit()

# Create Feedback table if it does not exist
cursor.execute("""
    IF NOT EXISTS (
        SELECT * FROM sysobjects WHERE name = 'Feedback' and xtype='U')

    BEGIN
        CREATE TABLE Feedback (
            id INT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(100),
            email NVARCHAR(100),
            message NVARCHAR(MAX),
            created_at DATETIME DEFAULT GETDATE()
        )
    END
""")
conn.commit()

# Log user action
def log_user_action(user_id, action, ip=None, method=None):
    cursor.execute("""
        INSERT INTO UserLogs (user_id, action, ip_address, method)
        VALUES (?, ?, ?, ?)
    """, (user_id, action, ip, method))
    conn.commit()

# Encode face image to embedding
def encode_face(image_bytes):
    try:
        np_data = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
        if image is None:
            return None
        faces = face_app.get(image)
        if not faces:
            return None
        return np.array(faces[0].normed_embedding, dtype=np.float32)
    except:
        return None

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    image_data = data.get("image")

    if not all([first_name, last_name, email, password, image_data]):
        return jsonify({"error": "All fields are required"}), 400

    try:
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        # Decode image from base64
        image_bytes = base64.b64decode(image_data)
        np_data = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"error": "Image decoding failed."}), 400

        # Extract face and embedding
        faces = face_app.get(image)
        if not faces:
            return jsonify({"error": "No face detected in the image."}), 400

        embedding = faces[0].normed_embedding
        embedding_bytes = embedding.tobytes()

        # Save to database
        cursor.execute(
        "INSERT INTO userAuthentication (first_name, last_name, email, password_hash, role, image_embedding) VALUES (?, ?, ?, ?, ?, ?)",
        (first_name, last_name, email, hashed_password, "user", embedding_bytes)
        )
        conn.commit()

        return jsonify({"message": "Registration successful!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/password-login", methods=["POST"])
def password_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Fetch password hash and other user data
    cursor.execute(
        "SELECT id, first_name, last_name, email, password_hash, role, image_embedding FROM userAuthentication WHERE email = ?",
        (email,)
    )
    user = cursor.fetchone()

    if user:
        db_password_hash = user[4]  

        # Ensure db_password_hash is bytes if stored as BLOB
        if isinstance(db_password_hash, str):
            db_password_hash = db_password_hash.encode('utf-8')

        # Verify the password
        if bcrypt.checkpw(password.encode("utf-8"), db_password_hash):
            session["user"] = user[3]
            session["role"] = user[5]
            log_user_action(user[0], "login", request.remote_addr, "password")

            # Optional: encode image for frontend if needed (convert bytes to base64)
            image_base64 = None
            if user[6]:
                image_base64 = base64.b64encode(user[6]).decode('utf-8')

            return jsonify({
                "message": f"Welcome {user[1]} {user[2]}!",
                "name": f"{user[1]} {user[2]}",
                "role": user[5],
                "image": image_base64  # Optional
            }), 200

    return jsonify({"error": "Invalid email or password"}), 401

@app.route("/login", methods=["POST"])
def face_login():
    data = request.json
    image_data = data.get("image")

    if not image_data:
        return jsonify({"error": "No image data"}), 400
    if image_data.startswith("data:image"):
        image_data = image_data.split(",")[1]

    try:
        live_image_bytes = base64.b64decode(image_data)
        live_embedding = encode_face(live_image_bytes)

        if live_embedding is None:
            return jsonify({"error": "No face detected"}), 400

        cursor.execute("""
            SELECT id, first_name, last_name, email, image_embedding, role
            FROM userAuthentication
        """)
        users = cursor.fetchall()

        for user in users:
            stored_embedding = np.frombuffer(user[4], dtype=np.float32)
            similarity = np.dot(stored_embedding, live_embedding) / (
                np.linalg.norm(stored_embedding) * np.linalg.norm(live_embedding)
            )

            if similarity > 0.60:
                session["user"] = user[3]  # email
                session["role"] = user[5]

                image_base64 = base64.b64encode(user[4]).decode("utf-8") if user[4] else None

                log_user_action(user[0], "login", request.remote_addr, "face")

                return jsonify({
                    "message": f"Welcome {user[1]} {user[2]}!",
                    "id": user[0],
                    "name": f"{user[1]} {user[2]}",
                    "email": user[3],
                    "image": image_base64,  
                    "role": user[5]
                }), 200

        return jsonify({"error": "Face not recognized"}), 401

    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500


@app.route("/admin/summary", methods=["GET"])
def admin_summary():
    if session.get("role") != "admin":
        return jsonify({"error": "Access denied: Admins only"}), 403

    # Count only users with role='user'
    cursor.execute("SELECT COUNT(*) FROM userAuthentication WHERE role = 'user'")
    user_count = cursor.fetchone()[0]

    # Fetch logs along with role
    cursor.execute("""
        SELECT TOP 50 L.id, U.first_name, U.last_name, U.email, L.action, L.timestamp, L.method, U.role
        FROM UserLogs L
        JOIN userAuthentication U ON L.user_id = U.id
        ORDER BY L.timestamp DESC
    """)
    logs = [{
        "id": row[0],
        "name": f"{row[1]} {row[2]}",
        "email": row[3],
        "action": row[4],
        "timestamp": row[5].strftime('%Y-%m-%d %H:%M:%S'),
        "method": row[6],
        "role": row[7]  # ✅ Include role here
    } for row in cursor.fetchall()]

    return jsonify({"user_count": user_count, "logs": logs})


@app.route("/admin/users", methods=["GET"])
def get_users():
    if session.get("role") != "admin":
        return jsonify({"error": "Access denied"}), 403

    role_filter = request.args.get("role", "user")  # default to user

    if role_filter == "all":
        cursor.execute("SELECT id, first_name, last_name, email, role FROM userAuthentication")
    else:
        cursor.execute("SELECT id, first_name, last_name, email, role FROM userAuthentication WHERE role = ?", (role_filter,))

    users = cursor.fetchall()

    return jsonify([{
        "id": row[0],
        "name": f"{row[1]} {row[2]}",
        "email": row[3],
        "role": row[4]
    } for row in users])

@app.route("/admin/delete-user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    if session.get("role") != "admin":
        return jsonify({"error": "Access denied"}), 403

    # Ensure user exists and is not admin
    cursor.execute("SELECT role FROM userAuthentication WHERE id = ?", (user_id,))
    result = cursor.fetchone()

    if not result:
        return jsonify({"error": "User not found"}), 404
    if result[0] == 'admin':
        return jsonify({"error": "Cannot delete admin users"}), 403

    # Proceed to delete user
    cursor.execute("DELETE FROM userAuthentication WHERE id = ?", (user_id,))
    conn.commit()

    return jsonify({"message": "User deleted successfully"}), 200

# Store feedback
@app.route('/api/feedback', methods=['POST'])
def store_feedback():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({'error': 'Missing required fields'}), 400

    cursor.execute(
        "INSERT INTO Feedback (name, email, message) VALUES (?, ?, ?)",
        (name, email, message)
    )
    conn.commit()
    return jsonify({'message': 'Feedback submitted successfully'}), 201

# Retrieve all feedback
@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    cursor.execute("SELECT id, name, email, message, created_at FROM Feedback ORDER BY created_at DESC")
    rows = cursor.fetchall()
    feedbacks = [
        {
            'id': row.id,
            'name': row.name,
            'email': row.email,
            'message': row.message,
            'created_at': row.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        for row in rows
    ]
    return jsonify(feedbacks)


@app.route('/abstractive', methods=['POST'])
def abstractive_summarize_api():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    uploaded_file = request.files['file']
    filename = secure_filename(uploaded_file.filename)
    os.makedirs("temp", exist_ok=True)
    temp_path = os.path.join("temp", filename)
    uploaded_file.save(temp_path)

    try:
        summary_text = abs_summarize(temp_path)
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

    if not summary_text.strip():
        return jsonify({"error": "Summary is empty"}), 400

    return jsonify({"summary": summary_text}), 200

@app.route("/extractive", methods=["POST"])
def extractive_summarization():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    uploaded_file = request.files["file"]
    if uploaded_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        filename = secure_filename(uploaded_file.filename)
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as tmp:
            uploaded_file.save(tmp.name)
            summary = ext_summarize(tmp.name)
        os.remove(tmp.name)
        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/caption", methods=["POST"])
def caption_image():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image_file = request.files["image"]
    try:
        caption = generate_caption(image_file)
        return jsonify({"caption": caption})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/rag', methods=['POST'])
def rag_endpoint():
        try:
            file = request.files.get('file')
            question = request.form.get('question')
            if not file or not question:
                return jsonify({"error": "Both file and question are required."}), 400
            answer = handle_rag_pipeline(file, question)
            return jsonify({"answer": answer})
        except Exception as e:
            return jsonify({"error": str(e)}), 500  

@app.route("/generate-qa", methods=["POST"])
def generate_qa_route():
    file = request.files.get("file")
    num_qs = request.form.get("num_questions")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    if not num_qs or not num_qs.isdigit():
        return jsonify({"error": "num_questions must be an integer"}), 400

    num_questions = int(num_qs)
    result, status = handle_qa_pipeline(file, num_questions)
    return jsonify(result), status

@app.route('/process', methods=['POST'])
def process():
    try:
        if 'text' in request.form and request.form['text'].strip():
            user_text = request.form['text']
            result = solve_with_gemini(user_text)
            return jsonify({"input_type": "text", "output": result})

        elif 'image' in request.files:
            image = request.files['image']
            extracted_text = extract_text_from_image(image)
            if not extracted_text:
                return jsonify({"error": "No readable text found in the image"}), 400
            result = solve_with_gemini(extracted_text)
            return jsonify({"input_type": "image", "extracted_text": extracted_text, "output": result})

        else:
            return jsonify({"error": "No input provided"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/notes", methods=["POST"])
def handle_generate_notes():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    try:
        final_notes = generate_note_from_file(file)
        if not final_notes.strip():
            return jsonify({"error": "No notes generated"}), 500
        return jsonify({"notes": final_notes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
