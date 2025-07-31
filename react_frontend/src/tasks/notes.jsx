import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, Loader2, FileText, Download, RotateCcw } from "lucide-react";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Notes = () => {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && /\.(pdf|docx|txt)$/i.test(selectedFile.name)) {
      setFile(selectedFile);
      setError("");
      setNotes("");
    } else {
      setError("Only .pdf, .docx, and .txt files are allowed.");
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a valid file.");
      return;
    }

    setLoading(true);
    setNotes("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/notes", formData);
      if (res.data.notes) {
        setNotes(res.data.notes);
      } else {
        setError("Failed to generate notes.");
      }
    } catch (err) {
      setError("Failed to upload file. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated to support multi-page note export
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    const verticalOffset = 60;
    const pageHeight = doc.internal.pageSize.height;
    const maxLineWidth = doc.internal.pageSize.width - margin * 2;

    const lines = doc.splitTextToSize(notes, maxLineWidth);
    let y = verticalOffset;

    doc.setFont("Helvetica");
    doc.setFontSize(12);

    lines.forEach((line) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = verticalOffset;
      }
      doc.text(line, margin, y);
      y += 20; // line spacing
    });

    const fileName = `${file.name.split(".")[0]}_notes.pdf`;
    doc.save(fileName);
  };

  const handleReset = () => {
    setFile(null);
    setNotes("");
    setError("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-blue-800">
            Notes Generator
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col space-y-3"
          >
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                         file:text-sm file:font-semibold file:bg-blue-100 
                         file:text-blue-800 hover:file:bg-blue-200 transition-all"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </motion.div>

          {/* Reset Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="w-full bg-yellow-500 text-white py-3 rounded-xl flex justify-center items-center font-medium shadow-md hover:bg-yellow-600 transition-all"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </motion.button>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl flex justify-center items-center font-medium shadow-md hover:bg-blue-700 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                <UploadCloud className="h-5 w-5 mr-2" />
                Upload & Process
              </>
            )}
          </motion.button>

          {notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                Generated Notes:
              </h3>
              <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap text-sm text-gray-800 shadow-inner">
                {notes}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadPDF}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Notes;
