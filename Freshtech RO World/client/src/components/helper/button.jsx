import './style.css'

const Button = ({ children, className = "", ...props }) => {
    return (
        <button className={` btn ${className}`}>
            {children}
        </button>
    );
};

export default Button;
