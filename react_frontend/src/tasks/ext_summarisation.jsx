import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UploadCloud, Loader2, Download, XCircle } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const extSummarizationDashboard = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResponse("");
    setWordCount(0);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/extractive", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const summary = res.data.summary || "No summary returned.";
      setResponse(summary);
      setWordCount(summary.split(/\s+/).filter(Boolean).length);
    } catch (error) {
      console.error("Error uploading file:", error);
      setResponse("Failed to process file.");
      setWordCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([response], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setResponse("");
    setWordCount(0);
    document.getElementById("fileInput").value = null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-6"
        >
          ✨ Extractive Summarization
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-6"
        >
          <div className="flex flex-col items-center gap-5">
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all duration-300"
            />

            <div className="flex gap-4">
              <motion.button
                onClick={handleSubmit}
                disabled={loading || !file}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UploadCloud />
                    Upload & Summarize
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={handleReset}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-red-100 text-red-600 px-5 py-2 rounded-full shadow hover:bg-red-200 transition"
              >
                <XCircle />
                Reset
              </motion.button>
            </div>
          </div>

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-h-96 overflow-y-auto shadow-inner"
            >
              <h2 className="font-semibold text-gray-700 mb-3 text-lg">📄 Summary:</h2>
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                {response}
              </p>

              <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
                <span className="italic">Word Count: {wordCount}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Download size={16} />
                  Download Summary
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default extSummarizationDashboard;
