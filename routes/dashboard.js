const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dbconf = require("./../dbconf");

const router = express.Router();
router.use(cors());
router.use(express.json());
const db = mysql.createConnection(dbconf);

router.post("/new", (req, res) => {
  console.log(req.body);
  const userId = req.body.userId;
  const date = new Date(req.body.date);
  const description = req.body.description;
  const type = req.body.type;
  const category = req.body.category;
  const value = req.body.value;
  console.log(date);

  db.query(
    "INSERT INTO TB_MOVIMENTACAO(USUARIO_MOV, DATA_MOV, TIPO_MOV, CATEGORIA_MOV, DESCRICAO_MOV, DEBITO_MOV, CREDITO_MOV) VALUE(?,?,?,?,?,?,?)",
    [
      userId,
      date,
      type,
      category,
      description,
      type == "D" ? value : 0,
      type == "C" ? value : 0,
    ],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.send(err.code);
      } else {
        res.send("OK");
      }
    }
  );
});

router.get("/balance", (req, res) => {
  const codUsu = req.query.codUsu;
  db.query(
    "SELECT COALESCE(SUM(CREDITO_MOV) - SUM(DEBITO_MOV),0) AS SALDO_ATUAL FROM TB_MOVIMENTACAO WHERE USUARIO_MOV = ?",
    [codUsu],
    (err, result, fields) => {
      if (err) {
        console.log("erro");
        res.send(err.code);
      } else {
        // console.log(result);
        res.status(200).send({
          saldoAtual: result[0].SALDO_ATUAL,
        });
      }
    }
  );
});

router.get("/dateRange", (req, res) => {
  const codUsu = req.query.codUsu;
  db.query(
    "SELECT CAST(MIN(DATA_MOV) AS DATE) AS MINDATE, CAST(MAX(DATA_MOV) AS DATE) AS MAXDATE FROM TB_MOVIMENTACAO WHERE USUARIO_MOV = ?",
    [codUsu],
    (err, result, fields) => {
      if (err) {
        console.log("erro");
        res.send(err.code);
      } else {
        // console.log(result);
        res.status(200).send({
          minDate: new Date(result[0].MINDATE),
          maxDate: new Date(result[0].MAXDATE),
        });
      }
    }
  );
});

router.get("/movement", (req, res) => {
  console.log(req.query);
  const codUsu = req.query.codUsu;
  const dateSelected = req.query.dateSelected;

  db.query(
    "SELECT * FROM VW_HISTMOVIMENTACAO WHERE CAST(DATA_MOV AS DATE) = CAST(? AS DATE) AND USUARIO_MOV = ?",
    [dateSelected, codUsu],
    (err, result, fields) => {
      if (err) {
        console.log("erro");
        res.send(err.code);
      } else {
        if (result.length > 0) {
          console.log(result);
          res.status(200).send(result);
        } else {
          //retorna array somente com saldo no dia
          var data = [
            {
              cod_mov: 0,
              usuario_mov: codUsu,
              data_mov: dateSelected,
              tipo_mov: "N",
              categoria_mov: "",
              descricao_mov: "Sem movimentação",
              valor_mov: 0,
            },
          ];

          db.query(
            "SELECT COALESCE(SUM(CREDITO_MOV) - SUM(DEBITO_MOV),0) AS SALDO_ATUAL FROM TB_MOVIMENTACAO WHERE USUARIO_MOV = ? AND CAST(DATA_MOV AS DATE) <= CAST(? AS DATE); ",
            [codUsu, dateSelected],
            (err, result, fields) => {
              if (err) {
                console.log("erro");
              } else {
                data = [
                  ...data,
                  {
                    cod_mov: 1,
                    usuario_mov: codUsu,
                    data_mov: dateSelected,
                    tipo_mov: "S",
                    categoria_mov: "",
                    descricao_mov: "Saldo",
                    valor_mov: result[0].SALDO_ATUAL,
                  },
                ];
                // console.log(data);
                res.status(200).send(data);
              }
            }
          );
        }
      }
    }
  );
});

module.exports = router;
