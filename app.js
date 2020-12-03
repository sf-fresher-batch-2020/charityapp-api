const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
app.use(cors());
app.use(express.json());
// Create Connection Pool
const mysql = require("mysql2/promise");
const { request } = require('express');
const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Priya@123",
    database: "test_db",
    connectionLimit: 10
});
// Create Routes
app.get('/api/users', getAllUsers);
app.post('/api/users', createUser);
app.post('/api/users/login', login);
//addrequest task  
app.post('/api/requests', requests);
app.get('/api/requests', getAllrequests);



async function createUser(req, res) {
    let user = req.body;
    let params = [user.name, user.email, user.password, user.number, user.age];
    const result = await pool.query("insert into users (name,email,password,number,age) values ( ?,?,?,?,?)", params);
    res.status(201).json({ id: result[0].insertId });
}

async function getAllUsers(req, res) {
    const result = await pool.query("select id,name,email,password,number,age from users");
    res.status(200).json(result[0]);
}
async function login(req, res) {
    const user = req.body;
    let params = [user.email, user.password];
    const result = await pool.query("SELECT id, name, email FROM users WHERE email = ? AND password = ?", params);
    if (result[0].length == 0) {
        throw new Error("Invalid Login Credentials");
    }
    res.status(201).json(result[0]);
}
//addrequest
async function requests(req, res) {
    let request = req.body;
    let params = [request.category, request.amount,request.label];
    const result = await pool.query("INSERT INTO request (category,amount,label) values (?,?,?)", params);
    res.status(201).json({ id: result[0].insertId });
}

async function getAllrequests(req, res) {
    const result = await pool.query("SELECT * from request");
    res.status(200).json(result[0]);
}

app.use(function(err, req, res, next) {
    console.log("common error handler");
    console.error(err);
    res.json({ errorMessage: err.message });
});
app.listen(port, () => console.log(`app listening on port ${port}`));





