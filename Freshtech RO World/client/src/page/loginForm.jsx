import { useState } from "react";
import '../assets/css/loginForm.css'
import Button from '../components/button'
import { BACKEND_API_ENDPOINT } from "../constant";
import {login} from '../API/auth';
import { useNavigate } from "react-router-dom";

const LoginForm = ({ title }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `${BACKEND_API_ENDPOINT}/users/login`;
      const res = await login('POST', endpoint, formData);
      navigate("/");
    } catch(err) {
      console.log(err);
    }
  };

  return (
      <div className="login-form">
        <h2 className="heading-secondary">{title}</h2>
        <form className="form form--login" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="email" className="form__label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form__input"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form__group">
            <label htmlFor="password" className="form__label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form__input"
              placeholder="••••••••"
              required
              minLength="8"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form__group">
            <Button>Login</Button>
          </div>
        </form>
      </div>
  );
};

export default LoginForm;
