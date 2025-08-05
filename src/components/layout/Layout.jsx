import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import { NavBar } from "../navbar/NavBar.jsx";

export function Layout() {
  return (
    <div>
      <NavBar />
      <main className={styles["page-container"]}>
        <Outlet />
      </main>
    </div>
  );
}
