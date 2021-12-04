const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const crypto = require("crypto");
const { crc32 } = require("crc");
const dbconf = require("./../dbconf");

const router = express.Router();
router.use(cors());
router.use(express.json());
const db = mysql.createConnection(dbconf);

const criaHash = () => {};

router.post("/signup", (req, res) => {
  // console.log(req.body);
  var id = 0;
  const username = req.body.username;
  const email = req.body.email;
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");

  db.query(
    "INSERT INTO TB_USUARIO(NOME_USU, EMAIL_USU, SENHA_USU) VALUES(?,?,?)",
    [username, email, password],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.send(err.code);
      } else {
        var id = result.insertId;
        const text = id + email;
        const hash = crc32(text).toString(16);
        db.query(
          "UPDATE TB_USUARIO SET HASH_USU = ? WHERE COD_USU = ?",
          [hash, id],
          (err, result) => {
            if (err) {
              console.log("erro");
              res.send(err.code);
            } else {
              res.send("OK");
            }
          }
        );
      }
    }
  );
});

router.get("/signin", (req, res) => {
  // console.log(req.query);
  const email = req.query.email;
  const password = crypto
    .createHash("sha256")
    .update(req.query.password)
    .digest("base64");

  db.query(
    "SELECT * FROM TB_USUARIO WHERE EMAIL_USU = ? AND SENHA_USU = ?",
    [email, password],
    (err, result, fields) => {
      if (err) {
        console.log("erro");
        res.send(err.code);
      } else {
        res.status(200).send({
          id: result[0].cod_usu,
          username: result[0].nome_usu,
          isAuth: true,
        });
      }
    }
  );
});

module.exports = router;
