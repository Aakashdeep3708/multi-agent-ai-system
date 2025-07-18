import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Sparkles,
  ImageIcon,
  Search,
  HelpCircle,
  StickyNote,
} from "lucide-react";

const aiTasks = [
  {
    title: "Text Summarization",
    route: "/summarisation",
    icon: <FileText className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Questions Generator",
    route: "/qaGenerator",
    icon: <Sparkles className="w-8 h-8 text-purple-600" />,
  },
  {
    title: "Image Captioning",
    route: "/caption",
    icon: <ImageIcon className="w-8 h-8 text-pink-600" />,
  },
  {
    title: "Document QA",
    route: "/rag",
    icon: <Search className="w-8 h-8 text-green-600" />,
  },
  {
    title: "Doubt Solver",
    route: "/doubt",
    icon: <HelpCircle className="w-8 h-8 text-orange-600" />,
  },
  {
    title: "Notes Maker",
    route: "/notes",
    icon: <StickyNote className="w-8 h-8 text-teal-600" />,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleCardClick = (task) => {
    if (task.route) {
      navigate(task.route);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      {/* Navbar */}
      <div className="sticky top-0 z-30 bg-white shadow-md animate-slide-down">
        <Navbar />
      </div>

      {/* Dashboard Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-10 animate-fade-in">
        <h1 className="text-4xl font-bold mb-10 text-center text-blue-800">
          AI Tools Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {aiTasks.map((task, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(task)}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-2xl hover:bg-white/90 group"
            >
              <div className="flex items-center justify-center mb-4">
                {task.icon}
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-800 group-hover:text-blue-700">
                {task.title}
              </h2>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <div className="bg-white shadow-inner animate-slide-up">
        <Footer />
      </div>
    </div>
  );
}
