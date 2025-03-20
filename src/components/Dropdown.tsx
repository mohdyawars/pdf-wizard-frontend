import { useState } from "react";
import { ChevronsDownUpIcon } from "lucide-react";


const DropDown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
    >
      <button
        className="text-white text-lg pl-8 font-bold flex items-center space-x-2"
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

      {isOpen && <div className="absolute left-0 mt-2 w-44 bg-white shadow-lg rounded-lg">
        <ul className="py-4 text-sm text-gray-700">
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">
              Settings
            </a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">
              Earnings
            </a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">
              Sign out
            </a>
          </li>
        </ul>
      </div>}
    </div>
  )
}

export default DropDown;
