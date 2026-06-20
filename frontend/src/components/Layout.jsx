import Footer from "../sections/Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main className="pt-[104px] min-h-screen">
      {children}
    </main>
    <Footer />
  </>
);

export default Layout;
