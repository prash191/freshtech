import React from 'react';

import './style.css'

const AuthFormInput = ( {name, label, placeholder, value, handleChange, extraProps = {}} ) => {
    return (
        <div className="form__group">
            <label htmlFor={name} className="form__label">
                {label}
            </label>
            <input
                type={name}
                id={name}
                name={name}
                className="form__input"
                placeholder={placeholder}
                required
                value={value}
                onChange={handleChange}
                {...extraProps}
            />
        </div>
    )
}

export default AuthFormInput;