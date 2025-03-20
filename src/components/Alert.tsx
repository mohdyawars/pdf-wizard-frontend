import { useEffect } from "react";

interface AlertProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 rounded-lg text-white shadow-lg transition-opacity duration-300 ${type === "success" ? "bg-green-500" : type === "warning" ? "bg-yellow-500" : "bg-red-500"
        }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-3 text-white">
          ✖
        </button>
      </div>
    </div>
  );
};

export default Alert;
