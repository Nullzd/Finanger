import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import Input from "../Forms/Imput";
import Button from "../Forms/Button";
import useForm from "../../Hooks/useForm";

const LoginCreate = () => {
  let navigate = useNavigate();
  const username = useForm();
  const email = useForm("email");
  const password = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/user/signup", {
        username: username.value,
        email: email.value,
        password: password.value,
      })
      .then((res) => {
        const code = res.data;
        console.log(code);
        switch (code) {
          case "OK":
            toast.success("Usuario adicionado com sucesso!");
            navigate("..");
            break;
          case "ER_DUP_ENTRY":
            toast.error("Usuario já existe");
            break;
          default:
            toast.error("Erro ao inserir usuario");
            break;
        }
      });
  };

  return (
    <section className="animeLeft">
      <h1 className="title">Cadastre-se</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <Input label="Usuário" type="text" name="username" {...username} />
        <Input label="Email" type="email" name="email" {...email} />
        <Input label="Senha" type="password" name="password" {...password} />
        <Button>Cadastrar</Button>
      </form>
    </section>
  );
};

export default LoginCreate;
