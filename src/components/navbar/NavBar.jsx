import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { List } from "@phosphor-icons/react";

export function NavBar() {
  return (
    <nav className={styles.navbar}>
      <p className={styles.logo}>Volume Calculator</p>
      <ul className={styles["navbar-list"]}>
        <li>
          <NavLink to={"/"}>Home</NavLink>
        </li>
        <li>
          <NavLink to={"/signup"}>Signup</NavLink>
        </li>
        <li>
          <NavLink to={"/login"}>Login</NavLink>
        </li>
      </ul>
    </nav>
  );
}
