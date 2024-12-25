import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Events from "./pages/Events";
import Menu from "./pages/Menu";
import Contacts from "./pages/Contacts";
import Schedule from "./pages/Schedule";
import Blogs from "./pages/Blogs";
import MyAccount from "./pages/MyAccount";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/my-account" element={<MyAccount />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
