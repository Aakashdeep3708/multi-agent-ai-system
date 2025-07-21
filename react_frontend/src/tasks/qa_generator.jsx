import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { FileText, Download, RefreshCcw } from "lucide-react";

const QAGenerator = () => {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(3);
  const [qaPairs, setQaPairs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !numQuestions) {
      alert("Please select a file and number of questions.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("num_questions", numQuestions);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/generate-qa", formData);
      setQaPairs(res.data.qa_pairs || []);
    } catch (error) {
      alert("Error generating Q&A.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsTxt = () => {
    const text = qaPairs
      .map((pair, i) => `Q${i + 1}: ${pair.question}\nA${i + 1}: ${pair.answer}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qa_output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsPdf = () => {
    const doc = new jsPDF();
    let y = 10;
    qaPairs.forEach((pair, i) => {
      const lines = doc.splitTextToSize(`Q${i + 1}: ${pair.question}\nA${i + 1}: ${pair.answer}`, 180);
      lines.forEach(line => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 10, y);
        y += 8;
      });
      y += 4;
    });
    doc.save("qa_output.pdf");
  };

  const resetAll = () => {
    setFile(null);
    setNumQuestions(3);
    setQaPairs([]);
    document.getElementById("fileInput").value = null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />

      <main className="flex-grow px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 border border-blue-100"
        >
          <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
            AI-Powered Q&A Generator
          </h1>

          <div className="grid gap-6 sm:grid-cols-2 mb-6">
            <div className="flex flex-col w-full">
              <label className="mb-4 text-gray-700 font-semibold">Upload File</label>
              <div className="relative w-full">
                <input
                  id="fileInput"
                  type="file"
                  // onChange={(e) => setFile(e.target.files[0])}
                  className="w-full h-[40px] px-4 py-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white"
                />
              </div>
              {file && (
                <p className="text-sm text-green-700 mt-1 flex items-center gap-2">
                  <FileText size={16} /> {file.name}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-4 text-gray-700 font-semibold">Number of Questions</label>
              <input
                type="number"
                min="1"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full h-[42px] px-4 py-2 border rounded-md"
                placeholder="e.g. 5"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md"
            >
              {loading ? "Generating..." : "Generate Q&A"}
            </button>

            <button
              onClick={resetAll}
              className="flex items-center gap-2 px-5 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-md font-semibold shadow"
            >
              <RefreshCcw size={18} /> Reset
            </button>
          </div>

          {qaPairs.length > 0 && (
            <>
              <div className="flex justify-center gap-6 mt-10">
                <button
                  onClick={downloadAsTxt}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  <Download size={18} /> .txt
                </button>
                <button
                  onClick={downloadAsPdf}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  <Download size={18} /> .pdf
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mt-10 space-y-6"
              >
                {qaPairs.map((pair, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-gray-50 border border-gray-200 p-5 rounded-md shadow-sm"
                  >
                    <p className="text-lg font-bold text-blue-700">Q{idx + 1}: {pair.question}</p>
                    <p className="text-gray-800 mt-2">A{idx + 1}: {pair.answer}</p>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default QAGenerator;
