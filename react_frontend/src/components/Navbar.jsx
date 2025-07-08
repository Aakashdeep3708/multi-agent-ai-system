import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolling, setIsScrolling] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsScrolling(location.pathname === "/");
  }, [location]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/", type: "route" },
    { name: "About", path: "about", type: "scroll" },
    { name: "Services", path: "services", type: "scroll" },
    { name: "Contact", path: "contact", type: "scroll" },
  ];

  const authLink = user
    ? { name: `${user.name}`, path: "/dashboard", type: "route" }
    : { name: "Login", path: "/login", type: "route" };

  const renderLink = (link, isMobile = false) => {
    const isActiveRoute =
      link.type === "route" && location.pathname === link.path;

    const commonClasses = clsx(
      "hover:text-purple-600 transition duration-200",
      isMobile ? "block py-2" : "",
      isActiveRoute && "text-purple-700 font-bold"
    );
    
    if (link.name === "Home") {
  return (
    <div
      key={link.name}
      onClick={() => {
        setOpen(false);
        if (location.pathname !== "/") {
          navigate("/");
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className={commonClasses + " cursor-pointer"}
    >
      {link.name}
    </div>
  );
}


    if (link.type === "scroll") {
      return (
        <div
          key={link.name}
          onClick={() => {
            setOpen(false);
            if (location.pathname !== "/") {
              navigate("/", { state: { scrollTo: link.path } });
            } else {
              const el = document.getElementById(link.path);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }
          }}
          className={commonClasses + " cursor-pointer"}
        >
          {link.name}
        </div>
      );
    }

    return (
      <Link
        key={link.name}
        to={link.path}
        onClick={() => setOpen(false)}
        className={commonClasses}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div
        className="text-3xl font-bold text-purple-600 cursor-pointer"
        onClick={() => {
        setOpen(false);
        if (location.pathname !== "/") {
          navigate("/");
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        }}
        >
        M-A
      </div>
        <div className="hidden md:flex gap-8 text-gray-800 font-medium items-center">
          {navLinks.map((link) => renderLink(link))}
          {renderLink(authLink)}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navLinks.map((link) => renderLink(link, true))}
          {renderLink(authLink, true)}
          {user && (
            <button
              onClick={handleLogout}
              className="block w-full text-left bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
