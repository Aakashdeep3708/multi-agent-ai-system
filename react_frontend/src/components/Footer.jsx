// src/components/Footer.jsx
import React from "react";

const Footer = () => (
  <footer className="bg-gray-900 text-white py-6 mt-12">
    <div className="max-w-7xl mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
