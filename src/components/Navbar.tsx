import logo from "../assets/pdf_wiz.png";
import { Link } from "react-router-dom";
import DropDown from "./Dropdown";

const Navbar = () => {
  return (
    <nav className="bg-slate-700 p-4">
      <div className="max-w-7xl w-full flex justify-start items-center">
        <Link to="/">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt="PDF Wizard Logo"
              className="h-10 w-auto rounded-lg shadow-md"
            />
            <span className="text-white text-2xl font-bold">PDF Wizard</span>
          </div>
        </Link>
        <Link to="#" className="text-white text-lg font-bold pl-10">EDIT PDF</Link>
        <Link to="#" className="text-white text-lg font-bold pl-8">MERGE PDF</Link>
        <Link to="#" className="text-white text-lg font-bold pl-8">SPLIT PDF</Link>
        <DropDown />
      </div>
    </nav >
  );
};

export default Navbar;
