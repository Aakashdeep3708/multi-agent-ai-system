import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animationType, setAnimationType] = useState("zoom-in");
  const navigate = useNavigate();

  useEffect(() => {
    const animations = [
      "zoom-in",
      "fade-up",
      "fade-down",
      "flip-left",
      "flip-right",
      "fade-right",
      "fade-left",
      "slide-up",
      "slide-down",
      "slide-right",
      "slide-left",
    ];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    setAnimationType(randomAnimation);
    AOS.init({ duration: 800, once: true });
  }, []);

  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: "user",
  };

  const handlePasswordLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/password-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify({ name: data.name }));
        alert(`${data.message}`);
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch {
      alert("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFaceLogin = async (image) => {
    setLoading(true);
    try {
      const base64Image = await convertToBase64(image);
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image.split(",")[1] }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify({ name: data.name }));
        alert(`${data.message}`);
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch {
      alert("Face login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#f0f4ff] via-[#fef9ff] to-[#e0f7fa]">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <img
          src="https://cdn.pixabay.com/photo/2023/07/31/18/27/ai-generated-8163068_1280.jpg"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-10"
        />
        <div
          className="relative z-10 w-full sm:max-w-md bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-2xl text-gray-800 border border-gray-200"
          data-aos={animationType}
        >
          <h2
            data-aos="fade-down"
            className="text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-8 text-purple-700"
          >
            Login
          </h2>

          {loading && (
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && !showPasswordLogin && !showWebcam && (
            <>
              <button
                onClick={() => {
                  setShowPasswordLogin(true);
                  setShowWebcam(false);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl mb-4 transition duration-300 shadow-md"
                data-aos="fade-up"
              >
                Login with Password
              </button>
              <button
                onClick={() => {
                  setShowWebcam(true);
                  setShowPasswordLogin(false);
                }}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-md"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Login with Face
              </button>
            </>
          )}

          {!loading && showPasswordLogin && (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 mb-4 rounded-xl bg-white border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-aos="fade-right"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 mb-4 rounded-xl bg-white border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-aos="fade-right"
                data-aos-delay="100"
              />
              <button
                onClick={handlePasswordLogin}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl mb-4 transition duration-300 shadow-md"
                data-aos="fade-up"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowWebcam(true);
                  setShowPasswordLogin(false);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-purple-700 font-semibold py-2 px-4 rounded-xl transition"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Use Face Login
              </button>
            </>
          )}

          {!loading && showWebcam && (
            <>
              <Webcam
                className="w-full mb-4 rounded-xl border border-gray-300 shadow-md"
                videoConstraints={videoConstraints}
                screenshotFormat="image/jpeg"
                ref={(webcam) => (window.webcam = webcam)}
                data-aos="fade"
              />
              <button
                onClick={() => {
                  if (window.webcam) {
                    const imageSrc = window.webcam.getScreenshot();
                    if (imageSrc) {
                      fetch(imageSrc)
                        .then((res) => res.blob())
                        .then((blob) => {
                          const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });
                          handleFaceLogin(file);
                        });
                    } else {
                      alert("Failed to capture image.");
                    }
                  }
                }}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-xl mb-4 transition duration-300 shadow-md"
                data-aos="fade-up"
              >
                Submit Face
              </button>
              <button
                onClick={() => {
                  setShowPasswordLogin(true);
                  setShowWebcam(false);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-purple-700 font-semibold py-2 px-4 rounded-xl"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Use Password Instead
              </button>
            </>
          )}

          {!loading && (
            <p className="text-sm text-center mt-6 text-gray-600" data-aos="fade-up" data-aos-delay="300">
              Not registered?{" "}
              <span
                className="text-purple-600 hover:text-purple-800 cursor-pointer font-semibold underline"
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
