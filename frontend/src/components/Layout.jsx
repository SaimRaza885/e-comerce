import Footer from "../sections/Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer/>
  </>
);

export default Layout