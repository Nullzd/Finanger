import React, { useState, useEffect, useLayoutEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router";
import Calendar from "react-calendar";
import { Button, ListGroup, ToastBody } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import axios from "axios";
import userData from "./../../Hooks/userData";
import useLocalStorage from "./../../Hooks/useLocalStorage";

import EntryModal from "./NewEntry";

import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  let navigate = useNavigate();
  const [refresh, setRefresh] = useState(true);
  const [session, setSession] = useLocalStorage("session", userData);
  const [balance, setBalance] = useState(0);
  const [calendarRange, setCalendarRange] = useState({
    minDate: new Date("2000-01-30"),
    maxDate: new Date("3000-12-30"),
    curDate: new Date(),
    dateSelected: false,
  });
  const [movement, setMovement] = useState([]);

  // useEffect(() => {
  //   if (session.id == 0) {
  //     navigate("..");
  //   } else {
  //     if (refresh) {
  //       fetchCurrentBalance();
  //       fetchDateRange();
  //       setRefresh(false);
  //     }
  //   }
  // });

  useLayoutEffect(() => {
    if (session.id == 0) {
      console.log("not authed");
      window.location.href = "http://localhost:3000/";
    } else {
      if (refresh) {
        fetchCurrentBalance();
        fetchDateRange();
        fetchMovement();
      }
    }
  }, []);

  const fetchCurrentBalance = () => {
    axios
      .get("http://localhost:3001/dashboard/balance", {
        params: {
          codUsu: session.id,
        },
      })
      .then((res) => {
        // console.log(res.data.saldoAtual);
        setBalance(res.data.saldoAtual);
      });
  };

  const fetchDateRange = () => {
    axios
      .get("http://localhost:3001/dashboard/dateRange", {
        params: {
          codUsu: session.id,
        },
      })
      .then((res) => {
        setCalendarRange((prev) => {
          return {
            ...prev,
            minDate: new Date(res.data.minDate),
            maxDate:
              res.data.maxDate > new Date()
                ? new Date(res.data.maxDate)
                : new Date(),
          };
        });
      });
  };

  //atualiza lista de movimentacao quando é selecionada uma data no calendario
  useEffect(() => {
    fetchMovement();
  }, [calendarRange.curDate]);

  useEffect(() => {
    console.log("refresh called");
    fetchCurrentBalance();
    fetchDateRange();
    fetchMovement();
    setRefresh(true);
  }, [refresh]);

  const fetchMovement = () => {
    axios
      .get("http://localhost:3001/dashboard/movement", {
        params: {
          codUsu: session.id,
          dateSelected: calendarRange.curDate,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setMovement(res.data);
      });
  };

  return (
    <div className={styles.section}>
      <section className={styles.sectionLeft}>
        <div className={styles.divBalance}>
          <h3 className={styles.balanceLabel}>Saldo Atual</h3>
          <h3
            className={styles.balanceValue}
            style={balance > 0 ? { color: "dodgerblue" } : { color: "red" }}
          >
            R$ {balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
          </h3>
        </div>
        <div className={styles.divList}>
          <h4>Movimentações</h4>
          <ListGroup>
            {movement.map((val, key) => {
              return (
                <ListGroup.Item className={styles.listItemMovement}>
                  <h5 className={styles.listItemTitle}>{val.descricao_mov}</h5>
                  <div className={styles.listItemSubtitle}>
                    <h6>{val.categoria_mov}</h6>
                    <div className={styles.listItemValue}>
                      <h6> </h6>
                      {val.tipo_mov != "N" && (
                        <>
                          <h6>R$</h6>
                          <h6>
                            {val.valor_mov
                              .toFixed(2)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                          </h6>
                        </>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </section>
      <section className={styles.sectionRight}>
        <div className={styles.divButtonNew}>
          <EntryModal handleRefresh={setRefresh} />
        </div>
        <div className={styles.divCalendar}>
          <Calendar
            className={styles.calendar}
            minDate={calendarRange.minDate}
            maxDate={calendarRange.maxDate}
            value={calendarRange.curDate}
            onClickDay={(value, event) => {
              setCalendarRange((prev) => {
                return { ...prev, curDate: value };
              });
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
