import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { MouseEvent } from "react";

const AdminLayout = () => {
    console.log("Admin Layout is rendered");
    return (
        <main className="account-info-container">
            <div className="user-view">
                <Sidebar />
                <div className="user-view__content">
                    <Outlet />
                </div>
            </div>
        </main>
    );
};

export default AdminLayout;