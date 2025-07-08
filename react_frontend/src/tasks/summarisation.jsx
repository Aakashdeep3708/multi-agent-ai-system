import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileText } from "lucide-react";

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
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Choose Your Summarization Method
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => navigate(card.route)}
              className={`cursor-pointer rounded-2xl shadow-xl transition-transform transform hover:scale-105 group overflow-hidden`}
            >
              <div className={`p-1 ${card.gradient}`}>
                <div className="bg-white rounded-xl p-6 h-full flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-full shadow-md">
                    {card.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {card.title}
                    </h2>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SummarizationChoice;
