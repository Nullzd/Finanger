import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import axios from "axios";
import toast from "react-hot-toast";
import userData from "./../../Hooks/userData";
import useLocalStorage from "./../../Hooks/useLocalStorage";

import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";

const NewEntry = ({ handleRefresh }) => {
  //Modal states
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setDescription("");
    setType("C");
    setCategory("");
    setValue(0);
  };
  const handleShow = () => setShow(true);

  const [session, setSession] = useLocalStorage("session", userData);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 16));
  const [type, setType] = useState("C");
  const [category, setCategory] = useState("");
  const [value, setValue] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (value <= 0) {
      toast.error("Valor não pode ser menor ou igual a zero");
    } else {
      axios
        .post("http://localhost:3001/dashboard/new", {
          userId: session.id,
          description: description,
          date: date,
          type: type,
          category: category,
          value: value,
        })
        .then((res) => {
          // console.log(res.data);
          switch (res.data) {
            case "OK":
              toast.success(
                (type === "C" ? "Receita" : "Despesa") +
                  " adicionada com sucesso"
              );
              handleClose();
              handleRefresh(false);
          }
        });
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className={styles.buttonNew}
        onClick={handleShow}
      >
        Novo Lançamento <Icon.Plus color="white" size={25} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Lançamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="entryForm.title">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Informe o título do lançamento"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="entryForm.title">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="entryForm.type">
              <Form.Label>Movimento</Form.Label>
              <br />
              <Form.Check
                inline
                type="radio"
                label="Receita"
                name="entryType"
                id="C"
                required
                defaultChecked
                onChange={() => setType("C")}
              />
              <Form.Check
                inline
                type="radio"
                label="Despesa"
                name="entryType"
                id="D"
                onChange={() => setType("D")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="entryForm.category">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" hidden>
                  Selecione uma categoria
                </option>
                {type == "C" && (
                  <>
                    <option value="Salário">Salário</option>
                    <option value="Benefício">Benefício</option>
                    <option value="Outros">Outros</option>
                  </>
                )}
                {type == "D" && (
                  <>
                    <option value="Contas">Contas</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Compras">Compras</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Vestimentas">Vestimentas</option>
                    <option value="Lazer">Lazer</option>
                  </>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="entryForm.value">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                placeholder="0,00"
                step="0.01"
                required
                onChange={(e) => setValue(e.target.value)}
                isInvalid={value < 0 ? true : false}
              />
            </Form.Group>
            <div className={styles.divButtonSubmit}>
              <Button
                variant="primary"
                type="submit"
                className={styles.buttonSubmit}
              >
                Registrar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewEntry;
