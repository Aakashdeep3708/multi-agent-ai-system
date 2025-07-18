import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Input Processor</h2>

          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setInputType("text")}
              className={`px-4 py-2 rounded ${inputType === "text" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Text Input
            </button>
            <button
              onClick={() => setInputType("image")}
              className={`px-4 py-2 rounded ${inputType === "image" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Image Input
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {inputType === "text" ? (
              <textarea
                className="w-full border p-2 rounded"
                rows="4"
                placeholder="Enter your text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                required
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full border p-2 rounded"
                required
              />
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </form>

          {response && (
            <div className="mt-6 p-4 bg-gray-100 rounded shadow">
              <strong>Response:</strong>
              <p className="mt-2 whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoubtSolve;
