//const apiKey = process.env.API_KEY || 'default-api-key';
require("dotenv").config();
const sql = require("./app/models/db");
const jwt = require("jsonwebtoken");
const express = require("express");
const { promisify } = require("util");
const app = express();
const bcrypt = require("bcryptjs");

app.use(express.json());
// parse reqs of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

let refreshTokens = [];

app.post("/token", async (req, res) => {
  const refreshToken = req.body.token;
});

app.post("/signup", async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 8);
  console.log(password);

  return res.json({
    erro: false,
    mensagem: "Sign up user",
  });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        error: "Por favor, forneça o email e a senha.",
      });
    }

    try {
      const query = await new Promise((resolve, reject) => {
        sql.query(
          "SELECT * FROM admin WHERE email = $1",
          [email],
          (err, results) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(results);
          }
        );
      });

      if (query.rowCount > 0) {
        const row = query.rows[0];
        const user = JSON.parse(JSON.stringify(row));
        const accessToken = generateAccessToken(user);
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const refreshToken = jwt.sign(user, refreshTokenSecret, {
          expiresIn: `${process.env.REFRESH_TOKEN_EXPIRATION}`,
        });
        refreshTokens.push(refreshToken);
        res
          .status(200)
          .json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        res.status(400).json({ error: "NotFound!" });
      }
    } catch (err) {
      console.error(`Database Error: ${err}`);
      res.status(500).json({ error: `Database Error: ${err}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 });
}
/*
module.exports = {
  secureRoute: async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({
        error: true,
        message:
          "Error: Login required to continue! The token is not being send! A",
      });
    }

    const [, token] = authHeader.split(" ");
    //console.log("Token: " + token);

    if (!token) {
      return res.status(400).json({
        error: true,
        message:
          "Error: Login required to continue! The token is not being send B!",
      });
    }

    try {
      // Checa se o token é válido
      // "@@KJKSZPJ1212" é a assinatura usada em todos os tokens
      const decode = await promisify(jwt.verify)(token, "@@KJKSZPJ1212");
      req.userId = decode.id;
      return next(); // Prossiga!
    } catch (err) {
      return res.status(400).json({
        error: true,
        message: "Error: Login required to continue! Invalid token!",
      });
    }
  },
};
*/
// define a porta e fica a espera de requisições

const PORT = process.env.SERVER_AUTH_PORT;

app.listen(PORT, () => {
  console.log(`O servidor está em execução na porta ${PORT}.`);
});
