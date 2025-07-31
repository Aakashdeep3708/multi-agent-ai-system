import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const DoubtSolve = () => {
  const [inputType, setInputType] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    const formData = new FormData();

    if (inputType === "text") {
      formData.append("text", textInput);
    } else if (inputType === "image" && imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await axios.post("http://localhost:5000/process", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data.output || "Success, but no output returned.");
    } catch (err) {
      setResponse("Error: " + (err.response?.data?.error || err.message));
    }

    setLoading(false);
  };

  const handleReset = () => {
    setTextInput("");
    setImageFile(null);
    setResponse("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Navbar />

      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 mb-8"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 drop-shadow-sm">
            🤖 AI - Powered Doubt Solver
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            <motion.button
              onClick={() => setInputType("text")}
              className={`px-5 py-2 rounded-full font-medium shadow transition-all duration-300 ${
                inputType === "text"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              📝 Text Input
            </motion.button>
            <motion.button
              onClick={() => setInputType("image")}
              className={`px-5 py-2 rounded-full font-medium shadow transition-all duration-300 ${
                inputType === "image"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              🖼️ Image Input
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {inputType === "text" ? (
              <motion.textarea
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="4"
                placeholder="Type your question here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                required
              />
            ) : (
              <motion.input
                type="file"
                accept="image/*"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full border border-gray-300 p-3 rounded-xl shadow-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                required
              />
            )}

            <motion.button
              type="button"
              onClick={handleReset}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-red-100 text-red-600 py-2 rounded-xl font-medium hover:bg-red-200 transition-all shadow"
            >
              🔄 Reset
            </motion.button>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all"
            >
              {loading ? "🔄 Processing..." : "🚀 Submit"}
            </motion.button>
          </form>

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-4 bg-gray-100 rounded-xl shadow-inner border-l-4 border-blue-400"
            >
              <strong className="text-gray-800">💬 Response:</strong>
              <p className="mt-2 text-gray-700 whitespace-pre-wrap">{response}</p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default DoubtSolve;
