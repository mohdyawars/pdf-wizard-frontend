import { Outlet, useLocation } from "react-router-dom";
import Hero from "./Hero";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const hideFooterOn = ["/merge-pdf/"];

  return (
    <>
      <Hero />
      {/* Render the main content */}
      <Outlet />
      {/* Hide footer on specific pages */}
      {!hideFooterOn.includes(location.pathname) && <Footer />}
    </>
  );
};

export default Layout;
