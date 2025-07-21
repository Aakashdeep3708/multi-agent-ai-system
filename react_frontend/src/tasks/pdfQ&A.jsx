import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, Loader2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RAGPipeline = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnswer("");
  };

  const handleReset = () => {
    setFile(null);
    setQuestion("");
    setAnswer("");
    document.getElementById("fileInput").value = "";
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10"
        >
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
            🧠 RAG Document Q&A
          </h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document (.pdf, .docx, .txt)
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ask a Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleReset}
              className="w-1/2 bg-gray-200 text-gray-700 font-semibold px-4 py-3 rounded-xl hover:bg-gray-300 transition-all flex items-center justify-center shadow"
            >
              <RotateCcw className="mr-2" />
              Reset
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center shadow-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <UploadCloud className="mr-2" />
              )}
              {loading ? "Processing..." : "Submit"}
            </motion.button>
          </div>

          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-8 p-5 bg-green-50 border border-green-200 text-green-800 rounded-xl shadow-inner"
            >
              <strong className="block mb-2 text-lg">Answer:</strong>
              <p className="whitespace-pre-line">{answer}</p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default RAGPipeline;
