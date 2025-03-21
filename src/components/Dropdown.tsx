import { useState } from "react";
import { FaFileExcel, FaFileWord, FaFilePowerpoint } from "react-icons/fa"
import { TbJpg } from "react-icons/tb";

const DropDown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="text-white text-md pl-8 font-bold flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>CONVERT PDF</span>
        <svg
          className="w-3.5 h-3.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 12 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && <div className="absolute left-0 top-left mt-0 w-54 bg-white shadow-lg rounded-lg">
        <ul className="py-4 text-sm text-gray-700">
          <li>
            <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-200">
              <TbJpg className="mr-2 text-yellow-800 " />
              PDF to JPG
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-200">
              <FaFileWord className="mr-2 text-blue-600" />
              PDF to WORD
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-200">
              <FaFilePowerpoint className="mr-2 text-orange-600" />
              PDF to POWERPOINT
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-200">
              <FaFileExcel className="mr-2 text-green-800" />
              PDF to EXCEL
            </a>
          </li>
        </ul>
      </div>}
    </div>
  )
}

export default DropDown;
