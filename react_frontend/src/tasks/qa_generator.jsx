import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    const text = qaPairs.map((pair, i) => `Q${i + 1}: ${pair.question}\nA${i + 1}: ${pair.answer}`).join("\n\n");
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50 p-6 sm:p-10">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
            AI-Powered Q&A Generator
          </h1>

          <div className="grid gap-6 sm:grid-cols-2 items-center mb-6">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Upload File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Number of Questions</label>
              <input
                type="number"
                min="1"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="e.g. 5"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
            >
              {loading ? "Generating..." : "Generate Q&A"}
            </button>
          </div>

          {qaPairs.length > 0 && (
            <>
              <div className="flex justify-center gap-6 mt-10">
                <button
                  onClick={downloadAsTxt}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Download .txt
                </button>
                <button
                  onClick={downloadAsPdf}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Download .pdf
                </button>
              </div>

              <div className="mt-10 space-y-6">
                {qaPairs.map((pair, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 border border-gray-300 p-5 rounded-md shadow-sm"
                  >
                    <p className="text-lg font-semibold text-blue-700">Q{idx + 1}: {pair.question}</p>
                    <p className="text-gray-800 mt-2">A{idx + 1}: {pair.answer}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QAGenerator;
