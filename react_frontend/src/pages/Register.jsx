import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from "@lottiefiles/react-lottie-player";
import { Eye, EyeOff } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  // OTP verification
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const webcamRef = useRef(null);

  // Resend OTP function
  const handleResendOTP = async () => {
  if (resendCooldown > 0) return; // block spamming

  setResendLoading(true);
  try {
    const response = await fetch("http://127.0.0.1:5000/send_otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email,
        first_name: firstName,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success("OTP resent to your email!");
      setResendCooldown(30); // start 30s cooldown
    } else {
      toast.error(data.error || "Failed to resend OTP");
    }
  } catch (error) {
    toast.error("Server error, try again.");
  }
  setResendLoading(false);
};

// Cooldown timer effect
useEffect(() => {
  if (resendCooldown > 0) {
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }
}, [resendCooldown]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Step 1: Request OTP only (no user info sent yet)
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Password validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!/\d/.test(password)) {
      toast.error("Password must contain at least one number");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      toast.error("Password must contain at least one special character");
      return;
    }

    if (!image) {
      toast.warning("Please upload or capture an image!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/send_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "OTP sent to your email!");
        setShowOtpModal(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
        }
      } catch (error) {
      toast.error("Error sending OTP");
      }
  };

  // Step 2: Verify OTP & Register (now send OTP only)
  const verifyAndRegister = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/verify_Register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        first_name: firstName,   
        last_name: lastName,     
        email,
        password,
        image: image.split(",")[1], 
        otp: verificationCode, 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Registration successful!");
        setShowOtpModal(false);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Error during registration. Try again.");
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
          src="https://lottie.host/ccfbbfc3-b117-4e0b-b4ec-008382e37412/yNwZZEafRx.json"
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

            <div className="space-y-4">
              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-300"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6" data-aos="fade-left">
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
                  onUserMediaError={() =>
                    toast.error("Please allow camera access!")
                  }
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

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">
              Verify Your Email
            </h3>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 mb-3"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <div className="flex gap-2 mb-3">
              <button
                onClick={verifyAndRegister}
                className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600"
              >
                Verify & Register
              </button>
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 bg-gray-300 py-2 rounded-xl hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || resendLoading}
                className={`text-indigo-600 font-semibold hover:underline disabled:text-gray-400`}
              >
                {resendCooldown > 0
                  ? `Resend available in ${resendCooldown}s`
                  : resendLoading
                  ? "Resending..."
                  : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
