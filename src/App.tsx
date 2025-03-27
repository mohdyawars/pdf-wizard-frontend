import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Pdfwizard from "./components/Pdfwizard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import MergePDF from "./pages/MergePDF";
import EditPDF from "./pages/EditPDF";
import SplitPDF from "./pages/SplitPDF";
import CompressPDF from "./pages/CompressPDF";
import PDFToWord from "./pages/PDFToWord";
import PDFToJPG from "./pages/PDFToJPG";
import PDFToPowerpoint from "./pages/PDFToPowerpoint";
import PDFToExcel from "./pages/PDFToExcel";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const showFooter = location.pathname === "/"; // Show footer only on the home page

  return (
    <>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Pdfwizard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/merge-pdf" element={<MergePDF />} />
          <Route path="/edit-pdf" element={<EditPDF />} />
          <Route path="/split-pdf" element={<SplitPDF />} />
          <Route path="/compress-pdf" element={<CompressPDF />} />
          <Route path="/convert-to-word" element={<PDFToWord />} />
          <Route path="/convert-to-jpg" element={<PDFToJPG />} />
          <Route path="/convert-to-powerpoint" element={<PDFToPowerpoint />} />
          <Route path="/convert-to-excel" element={<PDFToExcel />} />
        </Routes>
      </div>
      {showFooter && <Footer />} {/* Show footer only on home page */}
    </>
  );
}

export default App;
