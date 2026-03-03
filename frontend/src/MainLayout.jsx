import { Outlet } from "react-router";
import { Header } from "./Header.jsx";

export function MainLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}
