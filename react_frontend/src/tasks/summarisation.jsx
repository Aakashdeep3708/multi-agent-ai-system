import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileText } from "lucide-react";
import { motion } from "framer-motion";

const SummarizationChoice = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Abstractive Summarization",
      description:
        "Generate new sentences to summarize the original text. Uses AI to paraphrase and rephrase.",
      icon: <Sparkles size={40} className="text-purple-600" />,
      gradient: "bg-gradient-to-r from-purple-500 to-indigo-600",
      route: "/abstractive",
    },
    {
      title: "Extractive Summarization",
      description:
        "Extract key sentences from the original text without changing the content. Fast and factual.",
      icon: <FileText size={40} className="text-blue-600" />,
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-600",
      route: "/extractive",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-800 mb-12 text-center drop-shadow-md"
        >
          Choose Your Summarization Method
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              onClick={() => navigate(card.route)}
              className={`cursor-pointer rounded-2xl shadow-xl group overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1`}
              whileHover={{ scale: 1.05 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className={`p-1 ${card.gradient}`}>
                <div className="bg-white rounded-xl p-6 h-full flex items-start gap-4">
                  <motion.div
                    className="p-3 bg-gray-100 rounded-full shadow-md"
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {card.icon}
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition">
                      {card.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SummarizationChoice;
