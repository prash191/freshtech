import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Button from '../helper/button'
import {auth } from '../../actions/auth';
import AuthFormInput from "./authFormInput";

import './style.css'

const AuthForm = ({ register }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", passwordConfirm:"" });
  const [isSignUp, setIsSignUp] = useState(register);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
  }; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(auth(formData, navigate, isSignUp));
  };

  return (
      <div className="login-form">
        <h2 className="heading-secondary">{isSignUp ? 'Create your account' : 'Log in to your account'}</h2>

        <h4 className="heading-secondary">
          {isSignUp ? "Have an account?" : "Don't have an account?"}  
          <span className="switch-link" onClick={switchMode}>
            {isSignUp ? " Log in now" : " Sign Up"}
          </span>
        </h4>

        <form className="form form--login" onSubmit={handleSubmit}>
          {isSignUp && (
            <AuthFormInput name='name' label='Name' placeholder='John Doe' value={formData.name} handleChange={handleChange} extraProps = { {minLength : '4', maxLength : '30' }} />
          )}

          <AuthFormInput name='email' label='Email address' placeholder='johndoe@gmail.com' value={formData.email} handleChange={handleChange}  />

          <AuthFormInput name='password' label='Password' placeholder='••••••••' value={formData.password} handleChange={handleChange}  extraProps = { {minLength : '8' }}/>

          {isSignUp && (
            <AuthFormInput name='passwordConfirm' label='Confirm Password' placeholder='••••••••' value={formData.passwordConfirm} handleChange={handleChange}  extraProps = { {minLength : '8' }}/>
          )}

          <div className="form__group">
            <Button className="form__button">{isSignUp ? 'Sign up' : 'Login'}</Button>
          </div>
        </form>
      </div>
  );
};

export default AuthForm;