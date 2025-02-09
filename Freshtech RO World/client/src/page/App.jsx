import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Overview from "./overview";
import ProductDetails from "./productDetails";
import Header from "../components/header";
import Footer from "../components/footer";
import LoginForm from "./loginForm";
import Account from "./account";
import { AlertProvider } from "../components/alertContext";
import Alert from "../components/alert";

function App() {
  return (
    <Router>
      <AlertProvider>
        <Alert />
        <Header />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<LoginForm title='Login to your account'/>} />
          <Route path="/account" element={<Account />} />
        </Routes>
        <Footer />
      </AlertProvider>
    </Router>
  );
}

export default App;
