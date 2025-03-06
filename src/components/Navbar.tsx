import logo from "../assets/pdf_wiz.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-slate-700 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="PDF Wizard Logo"
            className="h-10 w-auto rounded-lg shadow-md"
          />
          <span className="text-white text-xl font-bold">PDF Wizard</span>
        </div>

        <div className="flex space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
