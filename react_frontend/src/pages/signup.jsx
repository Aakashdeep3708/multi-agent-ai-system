import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from "@lottiefiles/react-lottie-player";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!image) {
      toast.warning("Please upload or capture an image!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          image: image.split(",")[1],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Error registering user. Please try again.");
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
          setImageName(file.name);
          setIsWebcamActive(false);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setImageName("Captured Image");
      setIsWebcamActive(false);
    } else {
      toast.error("Failed to capture image.");
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-pink-100 via-indigo-100 to-blue-100 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Navbar />

      {/* Lottie background animation */}
      <div className="absolute -top-10 -right-10 opacity-30 pointer-events-none z-0">
        <Player
          autoplay
          loop
          src="https://lottie.host/ccfbbfc3-b117-4e0b-b4ec-008382e37412/yNwZZEafRx.json" // Sample abstract animation
          style={{ height: "300px", width: "300px" }}
        />
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-10 relative z-10">
        <div
          className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl w-full max-w-lg p-8 border border-gray-200"
          data-aos="fade-up"
        >
          <h2
            className="text-4xl font-extrabold text-center text-indigo-700 mb-8"
            data-aos="fade-down"
          >
            Create Account
          </h2>

          <div className="space-y-4" data-aos="fade-right">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-300"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-300"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mt-6" data-aos="fade-left">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Profile Image</label>
            <div className="flex gap-4 flex-col sm:flex-row mb-3">
              <button
                onClick={handleFileUpload}
                className={`flex-1 py-2 rounded-xl transition font-medium ${
                  !isWebcamActive
                    ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Upload Image
              </button>
              <button
                onClick={() => setIsWebcamActive(true)}
                className={`flex-1 py-2 rounded-xl transition font-medium ${
                  isWebcamActive
                    ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Use Webcam
              </button>
            </div>

            {isWebcamActive && (
              <div className="mt-4" data-aos="zoom-in">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                  }}
                  className="rounded-xl w-full border border-gray-300 shadow-md"
                  onUserMediaError={() => toast.error("Please allow camera access!")}
                />
                <button
                  onClick={captureImage}
                  className="mt-3 w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
                >
                  Capture Image
                </button>
              </div>
            )}

            <input
              type="text"
              readOnly
              value={imageName}
              placeholder="No image selected"
              className="w-full mt-3 px-4 py-2 text-center bg-gray-100 border border-gray-300 rounded-xl"
              data-aos="fade"
            />

            {image && (
              <div className="mt-4 flex justify-center" data-aos="zoom-in-up">
                <img
                  src={image}
                  alt="Selected"
                  className="w-32 h-32 object-cover rounded-full border-2 border-indigo-300 shadow-md"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleRegister}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition shadow-md"
            data-aos="fade-up"
          >
            Register
          </button>

          <p
            className="text-sm text-center mt-4 text-gray-700"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Already registered?{" "}
            <span
              className="text-indigo-600 cursor-pointer hover:underline font-semibold"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
