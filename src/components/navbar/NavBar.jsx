import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { CubeTransparent } from "@phosphor-icons/react";

export function NavBar() {
  return (
    <nav className={styles.navbar}>
      <p className={styles.logo}>
        <CubeTransparent size={20} />
      </p>

      <p>alpha test versie 18082025</p>
      {/*<ul className={styles["navbar-list"]}>*/}
      {/*  <li>*/}
      {/*    <NavLink to={"/"}>Home</NavLink>*/}
      {/*  </li>*/}
      {/*  <li>*/}
      {/*    <NavLink to={"/signup"}>Signup</NavLink>*/}
      {/*  </li>*/}
      {/*  <li>*/}
      {/*    <NavLink to={"/login"}>Login</NavLink>*/}
      {/*  </li>*/}
      {/*</ul>*/}
    </nav>
  );
}
