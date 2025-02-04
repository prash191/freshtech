import React from "react";
import "../assets/css/account.css"; // Assuming a separate CSS file for styles
import Icon from "../components/icon";

const Account = () => {
    const user = {
        name: "John Doe",
        email: "john@example.com",
        photo: "/default.jpg", // Change this as per actual user data
    };

    return (
        <main className="account-info-container">
            <div className="user-view">
                <Sidebar />
                <div className="user-view__content">
                    <UserSettingsForm user={user} />
                    <div className="line">&nbsp;</div>
                    <PasswordChangeForm />
                </div>
            </div>
        </main>
    );
};

const Sidebar = () => {
    return (
        <nav className="user-view__menu">
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
                    <NavItem link="#" text="Manage Products" icon="box" />
                    <NavItem link="#" text="Manage users" icon="users" />
                    <NavItem link="#" text="Manage reviews" icon="star" />
                    <NavItem link="#" text="Manage bookings" icon="briefcase" />
                </ul>
            </div>
        </nav>
    );
};

const UserSettingsForm = ({ user }) => {
    return (
        <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
                Your account settings
            </h2>
            <form className="form form-user-data">
                <div className="form__group">
                    <label className="form__label" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        className="form__input"
                        type="text"
                        defaultValue={user.name}
                        required
                    />
                </div>
                <div className="form__group ma-bt-md">
                    <label className="form__label" htmlFor="email">
                        Email address
                    </label>
                    <input
                        id="email"
                        className="form__input"
                        type="email"
                        defaultValue={user.email}
                        required
                    />
                </div>
                <div className="form__group form__photo-upload">
                    <img
                        className="form__user-photo"
                        src={`${user.photo}`}
                        alt="User photo"
                    />
                    <input
                        className="form__upload"
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                    />
                    <label htmlFor="photo">Choose new photo</label>
                </div>
                <div className="form__group right">
                    <button className="btn btn--small btn--green">
                        Save settings
                    </button>
                </div>
            </form>
        </div>
    );
};

const PasswordChangeForm = () => {
    return (
        <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form className="form form-user-settings">
                <div className="form__group">
                    <label className="form__label" htmlFor="password-current">
                        Current password
                    </label>
                    <input
                        id="password-current"
                        className="form__input"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength="8"
                    />
                </div>
                <div className="form__group">
                    <label className="form__label" htmlFor="password">
                        New password
                    </label>
                    <input
                        id="password"
                        className="form__input"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength="8"
                    />
                </div>
                <div className="form__group ma-bt-lg">
                    <label className="form__label" htmlFor="password-confirm">
                        Confirm password
                    </label>
                    <input
                        id="password-confirm"
                        className="form__input"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength="8"
                    />
                </div>
                <div className="form__group right">
                    <button className="btn btn--small btn--green btn--update-password">
                        Save password
                    </button>
                </div>
            </form>
        </div>
    );
};

const NavItem = ({ link, text, icon, active }) => {
    return (
        <li className={`side-nav--${active ? "active" : ""}`}>
            <a href={link}>
                <Icon iconId={`icon-${icon}`} />
                {text}
            </a>
        </li>
    );
};

export default Account;
