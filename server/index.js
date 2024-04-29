const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
//criptografar
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "banco_login_page",
});

app.use(express.json());
app.use(cors());

//pegar o registro
app.post("/register" ,(req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

            //se já tiver um email com o mesmo nome do valor passado
    db.query("SELECT * FROM usuarios WHERE email = ?", [email],
    (err, result) =>{
        if(err){
            res.status(500).send(err)
        }
        if(result.length == 0){
            bcrypt.hash(password, saltRounds, (err, hash) =>{
                db.query("INSERT INTO usuarios  (name, email, password) VALUES (?, ?, ?)", [name,email, hash], (err, result) =>{
                    if(err){
                        res.status(500).send(err)
                    }
                    res.status(200).send({msg: "Cadastrado com sucesso"})
                })
            })
        } else{
            res.status(400).send({msg: "Usuário já cadastrado."})
        }
    })
})

app.post("/login", (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;

              //se email e senha forem iguais ao que foi passado...
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) =>{
        if(err){
            res.send(err)
        }

        if(result.length > 0){
                                    //compara a senha passada com a senha do usuario no db
            bcrypt.compare(password, result[0].password, (err, match)=>{
                if(match){
                    res.send({msg: "Usuário logado com sucesso", name: result[0].name})
                } else{
                    res.status(400).send({msg: "Senha incorreta"})
                }
            })
        } else{
            res.send({msg: "Conta não encontrada"})
        }
    })
})

app.listen(3001, () =>{
    console.log('Rodando na porta 3001')
}) //abre o server