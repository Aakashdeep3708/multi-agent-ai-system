import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ImageIcon, FileText, MessagesSquare, FileQuestion } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const features = [
  {
    title: "Summarisation",
    description: "Condense long articles, papers, or meeting notes into crisp key-points in seconds.",
    icon: FileText,
  },
  {
    title: "Image Captioning",
    description: "Generate vivid, accurate captions for any image you upload.",
    icon: ImageIcon,
  },
  {
    title: "PDF Q&A",
    description: "Ask questions about any PDF and get instant, cited answers.",
    icon: FileQuestion,
  },
  {
    title: "Problem Solver and Notes maker",
    description: "Translate, re-write, or brainstorm content with a conversational AI assistant.",
    icon: MessagesSquare,
  },
];

const steps = [
  {
    title: "Create an account",
    text: "Log in securely to unlock all AI tools in one place.",
    number: "1",
  },
  {
    title: "Select a task",
    text: "Pick from summarisation, captioning, Q&A and more—no setup needed.",
    number: "2",
  },
  {
    title: "Get instant results",
    text: "Download or share your AI-generated output right away.",
    number: "3",
  },
];

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      const timeout = setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [location]);

  return (
    <div className="bg-white text-gray-900 font-sans scroll-smooth">
      <Navbar />

      {/* Hero */}
      <section id="/" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-300/30 via-fuchsia-200/20 to-transparent blur-3xl" />
        <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Your All-in-One <span className="text-violet-500">AI&nbsp;Task Hub</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Summaries, captions, answers & more—delivered instantly by state-of-the-art AI. Sign in once, enjoy many tools.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link to="/login">Login to Get Started</Link>
              </Button>
              <Button asChild size="lg" className="text-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700">
                <a href="#about">Learn More</a>
              </Button>
            </div>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            src="/images/11.jpeg"
            alt="Abstract AI art"
            className="w-full max-w-md rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative bg-gray-50 py-24 px-6 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-200/30 via-fuchsia-100/20 to-transparent blur-2xl" />

        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Empowering Students with Smarter Learning
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            <strong className="text-violet-500">Multi-Agent AI System</strong> is your intelligent study partner — designed to make your academic journey more efficient, focused, and stress-free.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 text-left text-gray-700 mb-10">
            <ul className="space-y-4 list-disc list-inside">
              <li><span className="font-semibold text-gray-900">Summarize lengthy content</span> into digestible insights</li>
              <li><span className="font-semibold text-gray-900">Generate questions</span> for revision and testing</li>
              <li><span className="font-semibold text-gray-900">Create structured notes</span> from any study material</li>
            </ul>
            <ul className="space-y-4 list-disc list-inside">
              <li><span className="font-semibold text-gray-900">Solve academic doubts</span> instantly with AI support</li>
              <li><span className="font-semibold text-gray-900">Auto-caption images</span> with accurate descriptions</li>
              <li><span className="font-semibold text-gray-900">Use RAG-powered AI</span> for real-time, reliable responses</li>
            </ul>
          </div>

          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Whether you're prepping for an exam, working on assignments, or just trying to stay organized —
            <strong className="text-gray-900"> Multi-Agent AI System</strong> brings everything you need into one smart, streamlined dashboard.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="services" className="container mx-auto px-6 lg:px-12 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          Unlock <span className="text-violet-500">Powerful AI</span> Workflows
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ title, description, icon: Icon }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full bg-white border border-gray-300 hover:shadow-lg hover:scale-[1.03] hover:border-violet-400 transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-start gap-4">
                  <span className="p-3 rounded-xl bg-violet-100">
                    <Icon className="w-6 h-6 text-violet-600" />
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600 text-sm flex-grow">{description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
          >
            3 Easy Steps
          </motion.h2>

          <div className="grid lg:grid-cols-3 gap-10">
            {steps.map(({ title, text, number }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Number(number) * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <span className="mb-4 text-4xl font-extrabold text-violet-500">{number}</span>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600 max-w-xs">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-white py-20 border-t border-gray-300">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Contact <span className="text-violet-500">Us</span>
          </motion.h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form submitted!");
            }}
            className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md border border-gray-300"
          >
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="mb-6">
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                required
                className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-violet-500"
              />
            </div>
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-md font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
