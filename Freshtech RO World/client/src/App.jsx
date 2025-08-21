import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Overview from "./page/overview";
import ProductDetails from "./page/productDetails";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer";
import AuthForm from "./components/auth/authForm";
import Account from "./page/account";
import AdminProducts from "./page/adminProducts";
import { AlertProvider } from "./components/alertContext";
import Alert from "./components/alert";
import AdminLayout from "./components/adminLayout";
import AddEditProduct from "./page/addEditProduct";

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
          <Route path="/admin" element={<AdminLayout />} >
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddEditProduct mode={"add"} />} />
            <Route path="products/edit/:id" element={<AddEditProduct mode={"edit"} />} />
            <Route path="users" element={<h2>Manage Users</h2>} />
            <Route path="reviews" element={<h2>Manage Reviews</h2>} />
            <Route path="bookings" element={<h2>Manage Bookings</h2>} />
          </Route>
        </Routes>
        </main>
        <Footer />
      </AlertProvider>
    </Router>
  );
}

export default App;