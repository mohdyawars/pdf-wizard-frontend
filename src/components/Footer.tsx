import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const hideFooterOn = ["/contact/", "/privacy-policy"]; // Add pages where you want to hide the footer

  if (hideFooterOn.includes(location.pathname)) {
    return null;
  }
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Brand Section */}
        <div className="md:col-span-2">
          <h2 className="text-white text-lg font-semibold">PDF Wizard</h2>
          <p className="text-sm mt-2">
            Effortless PDF Editing & Conversion – Fast, Simple, and Free!
          </p>
          <p className="text-sm mt-2">© PDF Wizard 2025</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-medium">Quick Links</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <a
                href="#"
                className="hover:underline transition duration-300 ease-in-out"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </a>
            </li>
            <li><a href="#" className="hover:underline">Services</a></li>
            <li><a href="#" className="hover:underline">Barcode Scanner</a></li>
          </ul>
        </div>


        {/* Support */}
        <div>
          <h3 className="text-white font-medium">Support</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><Link to="contact/" className="hover:underline">Contact Us</Link></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-white font-medium">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-white"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-white"><i className="fab fa-facebook"></i></a>
            <a href="#" className="hover:text-white"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
