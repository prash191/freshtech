import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Overview from "./overview";
import ProductDetails from "./productDetails";
import Header from "../components/header";
import Footer from "../components/footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
