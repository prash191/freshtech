import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Overview from "./page/overview";
import ProductDetails from "./page/productDetails";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer";
import AuthForm from "./components/auth/authForm";
import Account from "./page/account";
import { AlertProvider } from "./components/alertContext";
import Alert from "./components/alert";

function App() {
  return (
    <Router>
      <AlertProvider>
        <Alert />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/account" element={<Account />} />
            <Route path="/login" element={<AuthForm register = {false}/>} />
            <Route path="/signup" element={<AuthForm register = {true}/>} />
          </Routes>
        </main>
        <Footer />
      </AlertProvider>
    </Router>
  );
}

export default App;
