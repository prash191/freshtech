import React from "react";

const Icon = ({ iconId, className, ...props }) => {
    console.log(iconId);
    return (
        <svg className={`icon ${className}`} {...props}>
            <use xlinkHref={`/icons.svg#${iconId}`} />
        </svg>
    );
};

export default Icon;
