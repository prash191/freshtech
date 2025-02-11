import React, { useContext, useEffect, useState } from "react";
import "../assets/css/account.css"; // Assuming a separate CSS file for styles
import Icon from "../components/icon";
import { BACKEND_API_ENDPOINT, BACKEND_ENDPOINT } from "../constants/constant";
import { AlertContext } from "../components/alertContext";
import { auth } from "../actions/auth";

const Account = () => {
    const [user, setUser] = useState({photo: 'default.jpg'});
    const [password, setPassword] = useState({})
    const { showAlert } = useContext(AlertContext);

    let photo = "default.jpg";

    useEffect(() => {
        async function fetchMe() {
            try {
                const endpoint = `${BACKEND_API_ENDPOINT}/users/me`;
                const res = await auth("GET", endpoint);

                if(res.status === 'success') {
                    setUser(res.data);
                    showAlert("success", "Account fetched successfully!");
                } else {
                    const errorMessage = res.message ?? 'Something Went wrong...!';
                    showAlert('error', res.message);
                }
            } catch (err) {
                showAlert("error", err.message);
            }
        }
        fetchMe();
    }, []);

    const handleUserSettingsFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const endpoint = `${BACKEND_API_ENDPOINT}/users/updateMe`;

            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("email", user.email);

            const headers = { "Content-Type": "multipart/form-data" };
            // Append the photo file if it exists
            if (photo !== "default.jpg" && photo instanceof File) {
                formData.append("photo", photo); // 'photo' should match the field name expected by multer
            }
            const res = await auth("PATCH", endpoint, formData, headers);

            if(res.status === 'success') {
                setUser(res.data.user);
                showAlert("success", "Account updated successfully!");
            } else {
                const errorMessage = res.message ?? 'Something Went wrong...!';
                showAlert('error', res.message);
            }
        } catch (err) {
            showAlert("error", err.message);
        }
    };

    const handlePasswordResetFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const endpoint = `${BACKEND_API_ENDPOINT}/users/updatePassword`;

            const res = await auth("PATCH", endpoint, password);
            console.log(res);
            if(res.status === 'success') {
                setUser(res.data.user);
                showAlert("success", "Password updated successfully!");
            } else {
                const errorMessage = res.message ?? 'Something Went wrong...!';
                showAlert('error', res.message);
            }
        } catch (err) {
            showAlert("error", err.message);
        }
    };

    const handleUserSettingsFormChange = (e) => {
        if (e.target.name !== "photo") {
            setUser({ ...user, [e.target.name]: e.target.value });
        } else {
            photo = e.target.files[0];
        }
    };

    const handlePasswordResetFormChange = (e) => {
        setPassword({...password, [e.target.name]: e.target.value });
    };

    return (
        <main className="account-info-container">
            <div className="user-view">
                <Sidebar />
                <div className="user-view__content">
                    <UserSettingsForm
                        user={user}
                        onUserSettingsFormSubmit={handleUserSettingsFormSubmit}
                        onHandleChange={handleUserSettingsFormChange}
                    />
                    <div className="line">&nbsp;</div>
                    <PasswordChangeForm
                        onPasswordResetFormSubmit={
                            handlePasswordResetFormSubmit
                        }
                        onHandleChange={handlePasswordResetFormChange}
                    />
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

const UserSettingsForm = ({
    user,
    onUserSettingsFormSubmit,
    onHandleChange,
}) => {
    return (
        <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
                Your account settings
            </h2>
            <form
                className="form form-user-data"
                onSubmit={onUserSettingsFormSubmit}
                onChange={onHandleChange}
            >
                <div className="form__group">
                    <label className="form__label" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
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
                        name="email"
                        className="form__input"
                        type="email"
                        defaultValue={user.email}
                        required
                    />
                </div>
                <div className="form__group form__photo-upload">
                    <img
                        className="form__user-photo"
                        src={
                            user.photo !== "default.jpg"
                                ? `${BACKEND_ENDPOINT}/img/users/${
                                      user.photo
                                  }?${Date.now()}`
                                : `${user.photo}`
                        }
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

const PasswordChangeForm = ({onPasswordResetFormSubmit, onHandleChange}) => {
    return (
        <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form className="form form-user-settings" onSubmit={onPasswordResetFormSubmit} onChange={onHandleChange}>
                <div className="form__group">
                    <label className="form__label" htmlFor="password-current">
                        Current password
                    </label>
                    <input
                        id="password-current"
                        name="password"
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
                        name="newPassword"
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
                        name="passwordConfirm"
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
