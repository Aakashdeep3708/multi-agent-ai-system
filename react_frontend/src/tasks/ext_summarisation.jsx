import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UploadCloud, Loader2, Download } from "lucide-react";
import axios from "axios";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Extractive Summarization
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-xl space-y-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
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
            </button>
          </div>

          {response && (
            <div className="mt-6 bg-gray-100 rounded-lg p-4 text-left max-h-96 overflow-y-auto w-full">
              <h2 className="font-semibold text-gray-700 mb-2">Summary:</h2>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{response}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600">Word Count: {wordCount}</p>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-blue-700 font-medium hover:underline"
                >
                  <Download className="w-4 h-4" />
                  Download Summary
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default extSummarizationDashboard;
