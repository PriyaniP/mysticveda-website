import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAdmin, isUser, user, logout } = useAuth();
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Numerology", to: "/numerology" },
    { label: "Blog", to: "/blog" },
    ...(isUser ? [{ label: "My Bookings", to: "/profile" }] : []),
    ...(isAdmin ? [{ label: "Admin", to: "/admin" }] : [])
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/30 bg-white/70 backdrop-blur-xl">
      <div className="section-shell py-4">
        <div className="flex items-center justify-between">
          <BrandLogo compact />

          <nav className="hidden items-center gap-2 rounded-full border border-mystic-plum/10 bg-white/70 p-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-mystic-plum text-white shadow-md"
                      : "text-mystic-plum hover:bg-mystic-plum/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isUser ? (
              <div className="rounded-full border border-mystic-plum/10 bg-white/80 px-4 py-2 text-sm font-semibold text-mystic-plum">
                {user?.name}
              </div>
            ) : null}
            {isAdmin || isUser ? (
              <button
                type="button"
                className="secondary-button"
                onClick={logout}
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-mystic-plum/10 bg-white/70 p-1 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex-1 rounded-full px-3 py-2 text-center text-sm font-semibold transition ${
                  isActive
                    ? "bg-mystic-plum text-white shadow-md"
                    : "text-mystic-plum hover:bg-mystic-plum/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin || isUser ? (
            <button
              type="button"
              className="rounded-full px-3 py-2 text-center text-sm font-semibold text-mystic-plum transition hover:bg-mystic-plum/5"
              onClick={logout}
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
