let express = require('express');
let mysql = require('mysql');
let app = express();
let bodyParser = require('body-parser');
let crypto = require('crypto');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//creaete connection to database with root@hasnat@localhost with mysql pool
let connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'hasnat',
    database: 'moneyg',
    port: 3306,
    connectionLimit: 10,
});


app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


app.get("/", (req, res) => {
    res.send("Money Goal Api Is Working Fine");
});

// Auth
// Register
app.post("/auth/login",(req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    connection.query('SELECT token FROM users WHERE email = ? AND password = ?', [email,password], (err, rows, results) => {
        if (err) throw err;
        console.log(req.body)
        if (rows.length > 0) {
            res.send(JSON.stringify({
                "status": true,
                "data": rows[0]
            }));

        } else {
            res.send(JSON.stringify({
                "status": false,
                "message": "User Not Found"
            }));
        }
    });
});

app.post("/auth/register", [checkEmail], (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    if (username && email && password) {
        // encrypt username+password into sha256
        let hash = crypto.createHash('sha256');
        hash.update(username + password + email);
        let token = hash.digest('hex');

        let sql = "INSERT INTO users (id,username,email,password,token) VALUES (?,?,?,?,?)";

        connection.query(sql, [randomid(10),username, email, password, token], (err, results) => {
            if (err) throw err;

            res.send({
                "status": true,
                "message": "User Created Successfully"
            });
        });

    } else {
        res.send({
            "status": false,
            "message": "Please Fill All Fields"
        });
    }
})


app.post("/goals/add", (req, res) => {
    let goal = req.body.goalname;
    let amount = req.body.goalamount;
    let date = req.body.daterange;

    // connection.query("SELECT * FROM users WHERE token = ?", [token], (err, results) => {
    //     if (err) throw err;

        if (goal && amount && date) {
            let sql = "INSERT INTO goals (id,goal,amount,goalstartdate,goalenddate) VALUES (?,?,?,?,?)";

            connection.query(sql, [randomid(16), goal, amount, date], (err, results) => {
                if (err) throw err;

                res.send({
                    "status": true,
                    "message": "Goal Added Successfully"
                });
            });
        } else {
            res.send({
                "status": false,
                "message": "User Not Found"
            });
        }
    // });
});


// Middlewares and other functions
// check if email is already exist
function checkEmail(req, res, next) {
    let email = req.body.email;

    connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) res.send({"status": false, "message": "Email Already Exist"});
        else next();

    });
}

// create a function to generate random 16 byte uuid using crypto
function randomid(stringlength) {
    return crypto.randomBytes(stringlength).toString('hex');
}


app.listen(3001, function () {
    console.log('Server started on port 3000');
});