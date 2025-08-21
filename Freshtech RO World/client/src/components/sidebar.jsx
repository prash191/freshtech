import React, { useContext, useEffect, useState } from "react";
import NavItem from "./navItem";
import { routes } from "../constants/adminRoutes";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    
    const handleNavigation = (link) => {
        navigate(link);
    }

    return (
        <nav className="user-view__menu" >
            <ul className="side-nav">
                <NavItem
                    link="#"
                    text="Settings"
                    icon="settings"
                    active={true}
                />
                <NavItem link="#" text="My bookings" icon="briefcase" />
                <NavItem link="#" text="My reviews" icon="star" />
                <NavItem link="#" text="Billing" icon="credit-card" />
            </ul>
            <div className="admin-nav"> 
                <h5 className="admin-nav__heading">Admin</h5>
                <ul className="side-nav">
                {
                    routes
                    .map(({ link, text, icon }) => (
                        <NavItem
                            key={link}
                            link={link}
                            text={text}
                            icon={icon}
                            active={location.pathname === link}
                            onClick={() => handleNavigation(link)}
                        />
                ))}
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;