import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/pdf_wiz.png";
import DropDown from "./Dropdown";
import { FaBars } from "react-icons/fa"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-700 p-4">
      <div className="max-w-7xl w-auto flex justify-start items-center">

        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="PDF Wizard Logo"
            className="h-10 w-auto rounded-lg shadow-md"
          />
          <span className="text-white text-2xl font-bold">PDF Wizard</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="edit-pdf/" className=" text-white text-md font-bold pl-10">EDIT PDF</Link>
          <Link to="merge-pdf/" className="text-white text-md font-bold pl-8">MERGE PDF</Link>
          <Link to="split-pdf/" className=" text-white text-md font-bold pl-8">SPLIT PDF</Link>
          <DropDown />
        </div>

        {/* Mobile Menu */}
        <button
          className="md:hidden ml-4 text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="fixed inset-0 bg-slate-800 bg-opacity-95 p-6 flex flex-col items-center space-y-4 z-50">
            {/* Close Button */}
            <button
              className="absolute top-4 right-6 text-white text-3xl"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            {/* Menu Links */}
            <Link to="edit-pdf/" className="text-white text-lg font-bold" onClick={() => setIsOpen(false)}>EDIT PDF</Link>
            <Link to="merge-pdf/" className="text-white text-lg font-bold" onClick={() => setIsOpen(false)}>MERGE PDF</Link>
            <Link to="split-pdf/" className="text-white text-lg font-bold" onClick={() => setIsOpen(false)}>SPLIT PDF</Link>

            {/* Dropdown Component */}
            <DropDown />
          </div>
        )}
      </div>
    </nav >
  );
};

export default Navbar;
