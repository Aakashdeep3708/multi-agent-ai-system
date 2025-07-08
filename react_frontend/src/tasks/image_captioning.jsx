import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ImageCaptioning = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCaption("");
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/caption", formData);
      setCaption(response.data.caption);
    } catch (error) {
      setCaption("❌ Failed to generate caption.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-6">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">🖼️ Image Captioning</h1>

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
          onChange={handleFileChange}
          className="mb-4 w-full file:px-4 file:py-2 file:bg-indigo-600 file:text-white file:rounded-lg file:border-none file:cursor-pointer file:transition hover:file:bg-indigo-700"
        />

        {previewUrl && (
          <motion.img
            src={previewUrl}
            alt="Preview"
            className="w-64 h-64 object-contain mx-auto border-4 border-indigo-200 rounded-lg mb-6 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <motion.button
          onClick={handleUpload}
          disabled={loading || !image}
          className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "🔄 Generating Caption..." : "Generate Caption"}
        </motion.button>

        {caption && (
          <motion.div
            className="mt-6 bg-indigo-50 p-4 rounded-xl shadow-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-indigo-600 font-medium text-lg mb-1">Caption:</p>
            <p className="text-gray-800 italic">"{caption}"</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ImageCaptioning;
