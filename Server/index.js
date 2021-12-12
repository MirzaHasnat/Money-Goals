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
    host: '172.17.0.1',
    port: 3306,
    user: 'hasnat',
    password: 'root',
    database: 'moneyg',
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
    if(connection) res.send("GOOD");
    else res.sendStatus(500);
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
            res.send(rsp(true,"",rows[0]));

        } else {
            res.send(rsp(false,"User Not Found."));
        }
    });
});


// User Registration
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
            res.send(rsp(true,"User Created Successfully Please goto /login to login."));
        });

    } else {
        res.send(rsp(false,"Please Fill All Required Fields And Try Again."));
    }
})



// Goals
app.get("/goals",isAuthoried,(req,res)=>{
    
    connection.query("SELECT * FROM goals", (err,data)=>{

        if (err) throw err;
        res.send(rsp(true,"",data)) 
    })
})


app.post("/goals", (req, res) => {
    let goal = req.body.goalname;
    let amount = req.body.goalamount;
    let date = req.body.daterange;

    // connection.query("SELECT * FROM users WHERE token = ?", [token], (err, results) => {
    //     if (err) throw err;
        if (goal && amount && date) {
            let sql = "INSERT INTO goals (id,goal,amount,goalstartdate,goalenddate) VALUES (?,?,?,?,?)";

            connection.query(sql, [randomid(16), goal, amount, date], (err, results) => {
                if (err) throw err;

                res.send(rsp(true,"Goal Added Successfully."));
            });
        } else {
            res.send(rsp(false,"Please Fill The Required Fields."));
        }
    // });
});


// Middlewares and other functions

// Check If The User is Logged In
function isAuthoried(req,res,next){
    
    let token = req.headers.token
    console.log(token);

    connection.query("SELECT * FROM users WHERE token=?",[token],(err,results)=>{

        if (err) throw err;
        if (results.length<1) res.sendStatus(401);
        else next();
    })
}

// check if email is already exist
function checkEmail(req, res, next) {
    
    let email = req.body.email;

    connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    
        if (err) throw err;
        if (results.length > 0) res.send({"status": false, "message": "Email Already Exist"});
        else next();

    });
}

// For Response MSG Generation
function rsp(status,msg="",data={}){
    
    return {"status":status,"message":msg,"data":data }

}

// create a function to generate random 16 byte uuid using crypto
function randomid(stringlength) {
    return crypto.randomBytes(stringlength).toString('hex');
}


app.listen(3001, function () {
    console.log('Server started on port 3000');
});