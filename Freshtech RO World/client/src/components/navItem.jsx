import React from "react";
import { Link } from "react-router-dom";
import Icon from "./icon";

const NavItem = ({ link, text, icon, active }) => {
    return (
        <li className={`side-nav--${active ? "active" : ""}`}>
            <Link to={link} className="side-nav__link">
                <Icon iconId={`icon-${icon}`} />
                {text}
            </Link>
        </li>
    );
};

export default NavItem;