import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { FileText, RefreshCcw, Download } from "lucide-react";

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

  const resetAll = () => {
    setFile(null);
    setNumQuestions(3);
    setQaPairs([]);
    document.getElementById("fileInput").value = null;
  };

  const groupByDifficulty = (qaPairs) => {
    const grouped = {
      Easy: [],
      Medium: [],
      Hard: [],
    };
    const n = parseInt(numQuestions, 10);
    qaPairs.forEach((pair, i) => {
      if (i < n) grouped.Easy.push(pair);
      else if (i < 2 * n) grouped.Medium.push(pair);
      else grouped.Hard.push(pair);
    });
    return grouped;
  };

  const groupedQAs = groupByDifficulty(qaPairs);

  const downloadAsPdf = () => {
    const doc = new jsPDF();
    let y = 10;

    ["Easy", "Medium", "Hard"].forEach((level) => {
      if (groupedQAs[level].length === 0) return;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${level} Level`, 10, y);
      y += 10;

      groupedQAs[level].forEach((pair, idx) => {
        const lines = doc.splitTextToSize(`Q: ${pair.question}\nA: ${pair.answer}`, 180);
        lines.forEach((line) => {
          if (y > 270) {
            doc.addPage();
            y = 10;
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          doc.text(line, 10, y);
          y += 8;
        });
        y += 4;
      });

      y += 6;
    });

    doc.save("qa_output.pdf");
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
              <label className="mb-6 text-gray-700 font-semibold">Upload File</label>
              <input
                id="fileInput"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full h-[42px] px-4 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-6 text-gray-700 font-semibold">Number of Questions</label>
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
              onClick={resetAll}
              className="flex items-center gap-2 px-5 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-md font-semibold shadow"
            >
              <RefreshCcw size={18} /> Reset
            </button>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md"
            >
              {loading ? "Generating..." : "Generate Q&A"}
            </button>
          </div>

          {qaPairs.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mt-10 max-h-[400px] overflow-y-auto pr-2"
              >
                {["Easy", "Medium", "Hard"].map((level) => (
                  <div key={level} className="mb-6">
                    <h2 className="text-2xl font-bold text-purple-700 mb-4">{level} Level</h2>
                    {groupedQAs[level].map((pair, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-gray-50 border border-gray-200 p-5 rounded-md shadow-sm mb-4"
                      >
                        <p className="text-lg font-bold text-blue-700">Q: {pair.question}</p>
                        <p className="text-gray-800 mt-2">A: {pair.answer}</p>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={downloadAsPdf}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md"
                >
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default QAGenerator;
