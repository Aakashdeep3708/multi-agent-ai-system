import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ImageIcon, FileText, MessagesSquare, FileQuestion, StickyNote } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const features = [
  {
    title: "Summarisation",
    description: "Condense long articles, papers, or meeting notes into crisp key-points in seconds.",
    icon: FileText,
    route: "/login",
  },
  {
    title: "Image Captioning",
    description: "Generate meaningful and context-aware captions for images using AI vision models.",
    icon: ImageIcon,
    route: "/login",
  },
  {
    title: "Documents Q&A",
    description: "Ask questions about PDFs, docs, or text file and get accurate, AI-driven answers in real time.",
    icon: FileQuestion,
    route: "/login",
  },
  {
    title: "Problem Solver",
    description: "Get step-by-step solutions to math, logic, or coding problems with clear explanations.",
    icon: MessagesSquare,
    route: "/login",
  },
  {
    title: "Notes Maker",
    description: "Get step-by-step solutions to math, logic, or coding problems with clear explanations.",
    icon: StickyNote,
    route: "/login",
  },
  {
    title: "Questions Generator",
    description: "Automatically generate practice questions from any document or uploaded file.",
    icon: FileQuestion,
    route: "/login",
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
  const navigate = useNavigate();

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

    const scrollTarget = sessionStorage.getItem("scrollTarget");
    if (scrollTarget) {
      sessionStorage.removeItem("scrollTarget");
      const section = document.getElementById(scrollTarget);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, [location]);

  return (
    <div className="bg-white text-gray-900 font-sans scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section id="/" className="relative overflow-hidden pt-12 pb-20 bg-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-300/40 via-fuchsia-100/30 to-transparent blur-2xl" />

        <div className="container mx-auto px-6 lg:px-16 flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
              Your All-in-One <span className="text-violet-500">AI&nbsp;Task Hub</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-10">
              Summaries, captions, answers & more—delivered instantly by state-of-the-art AI. Sign in once, enjoy many tools.
            </p>

            <div className="space-y-5 mb-10">
              <div className="flex items-start gap-4">
                <span className="text-violet-500 text-2xl">⚡</span>
                <p className="text-gray-700 text-base sm:text-lg">
                  <strong>Instant Results:</strong> Get your summaries, captions, and question answers in seconds.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-fuchsia-500 text-2xl">🧠</span>
                <p className="text-gray-700 text-base sm:text-lg">
                  <strong>Smart Learning:</strong> Enhance comprehension with AI-generated notes and interactive Q&A.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-amber-500 text-2xl">🔐</span>
                <p className="text-gray-700 text-base sm:text-lg">
                  <strong>One Login:</strong> Access all features securely and seamlessly from one dashboard.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {!localStorage.getItem("user") && (
                <Button asChild size="lg" className="text-lg px-6 py-3">
                  <Link to="/login">Login to Get Started</Link>
                </Button>
              )}
              <Button
                asChild
                size="lg"
                className="text-lg px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700"
              >
                <a href="#about">Learn More</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            <img
              src="/images/image.jpg"
              alt="Abstract AI art"
              className="w-full max-w-[460px] rounded-3xl shadow-xl"
            />
          </motion.div>
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

        {/* 🔽 Additional Content Starts Here */}
        <div className="max-w-6xl mx-auto mt-20 text-center">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">Why Choose Us?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Unlike basic study tools, our AI-driven platform personalizes your learning, helps you focus on what's important, and grows with your academic needs.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 text-left text-gray-700">
            <div className="bg-white shadow-md p-6 rounded-xl border border-gray-200">
              <h4 className="text-xl font-semibold mb-2 text-violet-600">Context-Aware Understanding</h4>
              <p>Our AI doesn’t just look at words — it understands the context, ensuring better answers and insights.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-xl border border-gray-200">
              <h4 className="text-xl font-semibold mb-2 text-violet-600">Multi-Modal Capabilities</h4>
              <p>From text to images and PDFs, seamlessly interact with all types of study material using a unified platform.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-xl border border-gray-200">
              <h4 className="text-xl font-semibold mb-2 text-violet-600">Always Improving</h4>
              <p>Our intelligent agents continuously learn and update to stay ahead of your academic challenges.</p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h4 className="text-2xl font-bold mb-4 text-gray-800">Ready to supercharge your learning?</h4>
          <p className="text-lg text-gray-600 mb-6">Join thousands of students using our system to study smarter, not harder.</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-full shadow-md hover:from-violet-600 hover:to-fuchsia-700 transition"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-6 lg:px-12 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          Unlock <span className="text-violet-500">Powerful AI</span> Workflows
        </motion.h2>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {features.map(({ title, description, icon: Icon, route }, idx) => (
            <motion.div
              key={idx}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card
                onClick={() => navigate(route)}
                className="h-full cursor-pointer transform hover:scale-105 hover:shadow-xl transition-transform duration-300 bg-white border border-gray-200"
              >
                <CardContent className="p-6 flex flex-col items-start gap-4">
                  <span className="p-3 rounded-xl bg-violet-100 shadow-sm">
                    <Icon className="w-6 h-6 text-violet-600" />
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600 text-sm">{description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Steps Section */}
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

      {/* Contact Section */}
      <section id="contact" className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Contact <span className="text-violet-600">Us</span>
          </motion.h2>

          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const name = form.name.value.trim();
              const email = form.email.value.trim();
              const message = form.message.value.trim();

              try {
                const response = await fetch("http://localhost:5000/api/feedback", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, email, message }),
                });

                if (response.ok) {
                  toast.success("Feedback submitted successfully!");
                  form.reset();
                } else {
                  toast.error("Failed to submit feedback.");
                }
              } catch (err) {
                console.error("Error:", err);
                toast.error("Something went wrong.");
              }
            }}
            className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
              />
            </div>
            <div className="mb-6">
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                required
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
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

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <Footer />
    </div>
  );
}
