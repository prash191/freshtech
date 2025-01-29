const Button = ({ children, className, ...props }) => (
    <button className={`${className} px-4 py-2 rounded`} {...props}>
        {children}
    </button>
);

export default Button;
