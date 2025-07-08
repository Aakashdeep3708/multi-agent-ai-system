import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

import Navbar from "../components/Navbar"; // 
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

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!image) {
      alert("Please upload or capture an image!");
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
          image: image.split(",")[1], // strip base64 header
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error registering user. Please try again.");
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
    setImage(imageSrc);
    setImageName("Captured Image");
    setIsWebcamActive(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* ✅ Navbar */}
      <Navbar />

      {/* Main Form Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Image Upload / Webcam */}
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">Profile Image</label>
            <div className="flex gap-4 mb-3 flex-col sm:flex-row">
              <button
                onClick={handleFileUpload}
                className={`flex-1 py-2 rounded ${
                  !isWebcamActive
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Upload Image
              </button>
              <button
                onClick={() => setIsWebcamActive(true)}
                className={`flex-1 py-2 rounded ${
                  isWebcamActive
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Use Webcam
              </button>
            </div>

            {isWebcamActive && (
              <div className="mt-4">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                  }}
                  className="rounded-lg w-full border"
                  onUserMediaError={() => alert("Please allow camera access!")}
                />
                <button
                  onClick={captureImage}
                  className="mt-3 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
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
              className="w-full mt-3 px-3 py-2 text-center bg-gray-200 border rounded"
            />

            {image && (
              <div className="mt-4 flex justify-center">
                <img
                  src={image}
                  alt="Selected"
                  className="w-32 h-32 object-cover rounded-full border shadow"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleRegister}
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Register
          </button>

          <p className="text-sm text-center mt-4">
            Already registered?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
