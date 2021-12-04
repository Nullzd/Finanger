import React from "react";
import Head from "../Components/Head";

import styles from "./Home.module.css";

import Logo from "../images/logo.png";

const Home = () => {
  return (
    <section className={styles.home}>
      <div className={styles.texto}>
        <br />
        <br />
        <h1 className="title"> Bem vindo ao </h1>
        <div className="title">
          <h1 className={styles.subtitle}>Finanger</h1>
        </div>
        <br />
        <h3 className="title">Seu gerenciador de finanças </h3>
        <h1 className={styles.subtitle}>Pessoais</h1>
      </div>
    </section>
  );
};

export default Home;
