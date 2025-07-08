import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, Loader2 } from "lucide-react";

const RAGPipeline = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnswer("");
  };

  const handleSubmit = async () => {
    if (!file || !question.trim()) {
      alert("Please upload a document and enter a question.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/rag", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnswer(response.data.answer || "No answer received.");
    } catch (error) {
      console.error("Error:", error);
      setAnswer("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">🧠 RAG Document QA</h1>

        <label className="block mb-3 text-sm font-medium text-gray-700">
          Upload Document (.pdf, .docx, .txt)
        </label>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="mb-4 w-full border border-gray-300 rounded px-3 py-2"
        />

        <label className="block mb-3 text-sm font-medium text-gray-700">
          Ask a Question
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          className="mb-4 w-full border border-gray-300 rounded px-3 py-2"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <UploadCloud className="mr-2" />}
          Submit
        </button>

        {answer && (
          <div className="mt-6 p-4 bg-green-100 text-green-900 rounded-md shadow">
            <strong>Answer:</strong>
            <p className="mt-1 whitespace-pre-line">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RAGPipeline;
