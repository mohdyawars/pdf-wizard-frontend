
import { useState } from "react";

const faqs = [
  {
    question: "What is PDF Wizard?",
    answer:
      "PDF Wizard is an online tool that helps you edit, merge, split, and convert PDF files easily.",
  },
  {
    question: "Is PDF Wizard free to use?",
    answer:
      "Yes! PDF Wizard offers free basic features. However, we also have premium plans with advanced tools.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No, you don't need to create an account. It is free to use.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We use advanced encryption and do not store your files permanently. Your privacy is our priority.",
  },
  {
    question: "Which file formats are supported?",
    answer:
      "PDF Wizard supports PDF, Word (DOCX), Excel (XLSX), PowerPoint (PPTX), and image formats like PNG, JPG, and more.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  console.log(openIndex)

  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 pb-2">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left text-lg font-medium text-gray-700 flex justify-between items-center p-3 focus:outline-none hover:bg-gray-100 rounded-lg"
            >
              {faq.question}
              <span className="text-gray-500">{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && <p className="text-gray-600 mt-2 p-3 bg-gray-50 rounded">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
