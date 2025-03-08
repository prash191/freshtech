import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Overview from "./overview";
import ProductDetails from "./productDetails";
import Header from "../components/header";
import Footer from "../components/footer";
import LoginForm from "./loginForm";
import Account from "./account";
import AdminProducts from "./adminProducts";
import { AlertProvider } from "../components/alertContext";
import Alert from "../components/alert";
import AdminLayout from "../components/adminLayout";

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
          <Route path="/admin" element={<AdminLayout />} >
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<h2>Manage Users</h2>} />
            <Route path="reviews" element={<h2>Manage Reviews</h2>} />
            <Route path="bookings" element={<h2>Manage Bookings</h2>} />
          </Route>
        </Routes>
        <Footer />
      </AlertProvider>
    </Router>
  );
}

export default App;
