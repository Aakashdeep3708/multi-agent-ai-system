import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const navLinks = [
    { name: "Home", path: "/", type: ["route", "scroll"] },
    { name: "About", path: "about", type: ["scroll"] },
    { name: "Services", path: "services", type: ["scroll"] },
    { name: "Contact", path: "contact", type: ["scroll"] },
  ];

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

  const handleSmoothScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  const renderLink = (link, isMobile = false) => {
    const isRouteType = Array.isArray(link.type)
      ? link.type.includes("route")
      : link.type === "route";

    const isScrollType = Array.isArray(link.type)
      ? link.type.includes("scroll")
      : link.type === "scroll";

    const isActiveRoute = isRouteType && location.pathname === link.path;

    const commonClasses = clsx(
      "hover:text-purple-600 transition duration-200",
      isMobile ? "block py-2" : "",
      isActiveRoute && "text-purple-700 font-bold"
    );

    if (isScrollType) {
      return (
        <button
          key={link.name}
          onClick={() => {
            setOpen(false);
            if (location.pathname !== "/") {
              sessionStorage.setItem("scrollTarget", link.path);
              navigate("/");
            } else {
              handleSmoothScroll(link.path);
            }
          }}
          className={commonClasses}
        >
          {link.name}
        </button>
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
        {/* App Name with route */}
        <div
          className="text-3xl font-bold text-purple-600 cursor-pointer"
          onClick={() => {
            setOpen(false);
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          SmartDesk
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-gray-800 font-medium items-center">
          {!user && navLinks.map((link) => renderLink(link))}
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/AdminBoard"
                  className="hover:text-purple-600 transition duration-200"
                >
                  👥 User Info
                </Link>
              )}
              <Link
                to="/dashboard"
                className="hover:text-purple-600 transition duration-200"
              >
                👤 {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 transition duration-200"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            renderLink({ name: "Login", path: "/login", type: "route" })
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {!user && navLinks.map((link) => renderLink(link, true))}
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/AdminBoard"
                  onClick={() => setOpen(false)}
                  className="block py-2 hover:text-purple-600"
                >
                  👥 User Info
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-purple-600"
              >
                👤 {user.name}
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left py-2 text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            renderLink({ name: "Login", path: "/login", type: "route" }, true)
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
