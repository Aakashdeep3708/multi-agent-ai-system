# Multi-Agent AI System
A full-stack AI-powered academic assistant system designed to simplify student learning and boost academic productivity. This project leverages multiple intelligent agents, including NLP, LLMs, Computer Vision, and more, all orchestrated via a modular multi-agent architecture.

---

## About the Project
The Multi-Agent AI System integrates various AI-powered functionalities under a single platform to assist students in their studies. It allows users to log in using face or password authentication and access tools such as text summarization, image captioning, Q&A generation, note-making, and a doubt solver—all powered by large language models and computer vision.

## Features
## Login & Registration

- Face Recognition login (InsightFace)

- Password-based login

- Admin panel to manage users

## Homepage & Dashboard

- Clean UI with responsive layout using Tailwind CSS

- Dynamic routing via React Router

## AI Tools

- Extractive & Abstractive Summarization

- Image Captioning using OCR and Vision-Language Models

- Question-Answer Generation

- Note-Making from documents

- Doubt Solver using LLM

- RAG-based contextual answering with uploaded PDFs

## Admin Panel

- View, delete, search users

- Manage uploaded content

## Architecture
```
Frontend (React + Tailwind)
        |
        v
Backend (Flask API)
        |
        +---> Face Recognition (InsightFace)
        +---> AI Processing (Gemini API / EasyOCR / NLP)
        +---> Database (SQL Server)
        +---> Vector Store (Milvus via Docker)
```
Each module is handled by a specific agent (e.g., Summarizer Agent, Captioning Agent, etc.), coordinated through modularized APIs.

## Tech Stack
- Frontend

- React (Vite)

- Tailwind CSS

- Framer Motion

- Axios

## Backend

- Python + Flask

- SQL Server

- InsightFace

- Milvus (for vector storage)

- Gemini API (for NLP/LLM tasks)

- EasyOCR

## Deployment & DevOps

- Docker (for Milvus)

- GitHub (CI/CD in future scope)

## AI Modules

```

| **Module**             | **Tech Used**                     | **Purpose**                                        |
|------------------------|-----------------------------------|----------------------------------------------------|
| Face Authentication    | InsightFace                       | Secure login and registration via webcam           |
| Summarization          | Gemini API                        | Extractive and abstractive text summarizing        |
| Image Captioning       | EasyOCR and Gemini Vision         | Generate captions from uploaded images             |
| Q&A Generation         | Gemini API                        | Auto-generate questions and answers                |
| RAG (Retrieval QA)     | Milvus + Gemini                   | Contextual answering from uploaded content         |
| Note-Making            | Gemini API                        | Convert raw content into study-ready notes         |
| Doubt Solver           | Gemini API and EasyOCR            | Resolve student doubts using LLMs                  |

```

## Screenshots

![Dashboard](screenshots/Screenshot(15).png)

## Setup Instructions
## Prerequisites
- Node.js + npm

- Python 3.10+

- SQL Server (running locally or via Azure)

- Docker (for Milvus)

- Gemini API key

## Backend Setup
```
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```
```
#Set environment variables (use .env)
FLASK_APP=app.py
FLASK_ENV=development
GEMINI_API_KEY=your_key_here
DB_URL=mssql+pyodbc://username:password@localhost/db_name?driver=ODBC+Driver+17+for+SQL+Server

```

#Run the backend
python app.py

## Frontend Setup

cd frontend

npm install

npm run dev

## Milvus Setup (Docker)
docker-compose -f milvus-compose.yml up -d

## Folder Structure

```
├── frontend/               # React app
├── backend/
│   ├── app.py              # Main Flask entrypoint
│   ├── db_setup.py  
│   ├── milvus_db           # Milvus Docker config
│   ├── apk_modules             
│   └── requirements.txt              
├── README.md

```

## Future Scope
- Mobile App version using Flutter

- International language support (multilingual NLP)

- Auto-generated quizzes and mock tests

- Learning Analytics Dashboard

- Offline Mode with local AI models

## License
This project is open-source and available under the MIT License.
