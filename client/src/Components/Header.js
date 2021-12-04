import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { ReactComponent as Logo } from "../images/logo.png";
import Button from "./Forms/Button";
import userData from "./../Hooks/userData";
import useLocalStorage from "./../Hooks/useLocalStorage";
import Dashboard from "./Dashboard/Dashboard";

export const Header = () => {
  const [session, setSession] = useLocalStorage("session", userData);

  const Login = () => {
    return (
      <Link className={styles.login} to="/login">
        Login / Criar
      </Link>
    );
  };

  const Logout = () => {
    const logoutUser = () => {
      setSession(userData);
      window.location.reload(false);
    };

    return (
      <div>
        <p className={styles.user}>Olá, {session.username}</p>
        <Link className={styles.logout} to="/" onClick={logoutUser}>
          Sair
        </Link>
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        <div>
          <Link className={styles.logo} to="/" aria-label="logo - Home">
            Home
          </Link>
          {session.isAuth && (
            <Link
              to="/dashboard"
              className={styles.logo}
              style={{ marginLeft: "2rem" }}
            >
              Dashboard
            </Link>
          )}
        </div>
        {/* <Link to="../">text</Link> */}
        {session.isAuth ? <Logout /> : <Login />}
      </nav>
    </header>
  );
};

export default Header;
