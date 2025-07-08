import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/home_page";
import SummarizationChoice from "./tasks/summarisation";
import AbsSummarizationDashboard from "./tasks/abs_summarisation";
import ExtSummarizationDashboard from "./tasks/ext_summarisation";
import ImageCaptioning from "./tasks/image_captioning";
import RAGPipeline from "./tasks/pdfQ&A";
import QAGenerator from "./tasks/qa_generator";
import DoubtSolve from "./tasks/doubt_solving";
import Notes from "./tasks/notes";
import AdminBoard from "./pages/AdminBoard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/summarisation" element={<SummarizationChoice />} />
        <Route path="/abstractive" element={<AbsSummarizationDashboard />} />
        <Route path="/extractive" element={<ExtSummarizationDashboard />} />
        <Route path="/caption" element={<ImageCaptioning />} />
        <Route path="/rag" element={<RAGPipeline />} />
        <Route path="/qaGenerator" element={<QAGenerator />} />
        <Route path="/doubt" element={<DoubtSolve />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/AdminBoard" element={<AdminBoard />} />

      </Routes>
    </Router>
  );
}
