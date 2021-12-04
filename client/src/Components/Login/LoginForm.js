import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
// import { ImportsNotUsedAsValues } from "typescript";
import axios from "axios";

import Input from "../Forms/Imput";
import Button from "../Forms/Button";
import useForm from "../../Hooks/useForm";
import userData from "./../../Hooks/userData";
import useLocalStorage from "./../../Hooks/useLocalStorage";
import toast from "react-hot-toast";

import styles from "./LoginForm.module.css";
import stylesBtn from "../Forms/Button.module.css";

const LoginForm = () => {
  let navigate = useNavigate();
  const email = useForm("email");
  const password = useForm();

  const [session, setSession] = useLocalStorage("session", userData);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .get("http://localhost:3001/user/signin", {
        params: {
          email: email.value,
          password: password.value,
        },
      })
      .then((res) => {
        const data = res.data;
        localStorage.removeItem("session");

        setSession((prev) => {
          return {
            ...prev,
            id: data.id,
            username: data.username,
            isAuth: data.isAuth,
          };
        });
        console.log(session);
        // navigate("../..");
        // window.location.reload(false);
        window.location.replace("../..");
      });
  };

  return (
    <section className="animeLeft">
      <h1 className="title">Login</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" name="email" {...email} />
        <Input label="Senha" type="password" name="password" {...password} />
        <Button>Entrar</Button>
      </form>
      <Link className={styles.perdeu} to="/login/perdeu">
        Esqueceu a senha?
      </Link>
      <div className={styles.cadastro}>
        <p>Ainda não possui conta? Cadastre-se no site.</p>
        <Link className={stylesBtn.button} to="/login/criar">
          Cadastra-se
        </Link>
      </div>
    </section>
  );
};

export default LoginForm;
