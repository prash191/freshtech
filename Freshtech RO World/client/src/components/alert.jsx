// components/Alert.js
import React, { useContext } from "react";
import { AlertContext } from "./alertContext";

const Alert = ({onClose }) => {
    const { alert, hideAlert } = useContext(AlertContext);

    if (! alert || ! alert.message) return null;

    const alertClass = alert.type === "success" ? "alert-success" : "alert-error";

    return (
        <div className={`alert ${alertClass}`}>
            <span>{alert.message}</span>
            <button onClick={onClose}>&times;</button>
        </div>
    );
};

export default Alert;
