import { MdMerge, MdCallSplit, MdEdit } from "react-icons/md";
import { FaCompressArrowsAlt, FaFileExcel, FaFileWord, FaFilePowerpoint } from "react-icons/fa";
import { TbJpg } from "react-icons/tb";

const Hero = () => {

  const tools = [
    { name: "Merge PDF", desc: "Combine multiple PDFs easily.", icon: <MdMerge className="text-red-600 text-5xl" /> },
    { name: "Split PDF", desc: "Extract specific pages quickly.", icon: <MdCallSplit className="text-red-600 text-5xl" /> },
    { name: "Compress PDF", desc: "Reduce file size without losing quality.", icon: <FaCompressArrowsAlt className="text-cyan-600 text-5xl" /> },
    { name: "PDF to Word", desc: "Convert PDFs into editable Word files.", icon: <FaFileWord className="text-blue-600 text-5xl" /> },
    { name: "PDF to JPG", desc: "Convert PDFs to images seamlessly.", icon: <TbJpg className="text-yellow-800 text-5xl" /> },
    { name: "PDF to Powerpoint", desc: "Convert PDFs into slides", icon: <FaFilePowerpoint className="text-orange-600 text-5xl" /> },
    { name: "PDF to Excel", desc: "Convert PDFs into excel", icon: <FaFileExcel className="text-green-800 text-5xl" /> },
    { name: "Edit PDF", desc: "Seamlessly edit PDF", icon: <MdEdit className="text-gray-800 text-5xl" /> },
  ]
  return (
    <section className="bg-gradient-to-b from-gray-100 to-white py-16 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          All the PDF Tools You Need in One Place
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4">
          ✨ Effortlessly edit 📝, merge 🔗, split ✂️, and convert 🔄 your PDFs — all in one place! 🚀 Simple, fast, and free! 🎉
        </p>
      </div>

      {/* PDF Tools Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {tools.map((tool, index) => (
          <div key={index} className="p-6 bg-white shadow-lg rounded-lg text-center flex flex-col items-center">
            {tool.icon}
            <h3 className="text-lg font-bold text-gray-800 mt-4">{tool.name}</h3>
            <p className="text-sm text-gray-600 mt-2">{tool.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
