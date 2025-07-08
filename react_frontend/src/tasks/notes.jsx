import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, Loader2, FileText, Download } from "lucide-react";
import { jsPDF } from "jspdf"; // <-- ADD THIS
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

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const lines = doc.splitTextToSize(notes, 500);
    doc.setFont("Helvetica");
    doc.setFontSize(12);
    doc.text(lines, 40, 60);

    const fileName = `${file.name.split(".")[0]}_notes.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Upload Document to Generate Notes
          </h2>

          <div className="flex flex-col space-y-3">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                        file:text-sm file:font-semibold file:bg-blue-50 
                        file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                {file.name}
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center items-center hover:bg-blue-700 transition duration-200"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                <UploadCloud className="h-5 w-5 mr-2" />
                Upload & Process
              </>
            )}
          </button>

          {notes && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Generated Notes:</h3>
              <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-md whitespace-pre-wrap text-sm text-gray-800">
                {notes}
              </div>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Notes;
