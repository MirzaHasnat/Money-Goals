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

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');

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
app.get("/goals",[isAuthoried,getUserId],(req,res)=>{
    
    connection.query("SELECT goals.*,SUM(goal_entries.entry_amount) AS total_added,DATEDIFF(goals.goal_end_date,NOW()) as days_left FROM goals INNER JOIN goal_entries ON goals.id=goal_entries.goal_id WHERE goals.user_token=? GROUP BY goal_entries.goal_id",[res.locals.userid], (err,data)=>{

        if (err) throw err;
        res.send(rsp(true,"",data)) 
    })
})


// Get Goals By ID
app.get("/goals/:id",[isAuthoried,getUserId],(req,res)=>{

    connection.query("SELECT * FROM goals WHERE id=? and user_token=?",[req.params.id,res.locals.userid],(err,data)=>{
        
        if (err) throw err;        
        if(data.length>0) res.send(rsp(true,"",data));
        else res.send(rsp(false,"Goal Not Found"));
    
    })

})


// Insert Goals
app.post("/goals", [isAuthoried,getUserId] , (req, res) => {
    let goal = req.body.goalname;
    let goalsdate = req.body.goaldate[0];
    let goaledate = req.body.goaldate[1] || new Date();
    let amount = req.body.goalamount;
    let inamount = req.body.inamount || 0;
    let userid = res.locals.userid;
    let goalid = randomid(16);

    if (goal && amount && goaledate && goalsdate) {
                
        connection.query("INSERT INTO goals (id,goal_name,goal_amount,goal_start_date,goal_end_date,user_token) VALUES (?,?,?,?,?,?)", [goalid, goal, amount, goalsdate, goaledate,userid], (err, results) => {
            if (err) throw err;

            connection.query("INSERT INTO goal_entries(id,entry_des,entry_amount,money_type,goal_id)VALUES(?,?,?,?,?)",[randomid(8),"INITIAL AMOUNT",inamount,"ADD",goalid],(err,result)=>{
                
                if (err) throw err;
                res.send(rsp(true,"Goal Added Successfully."));
            
            })
        
        });
    
    } else {
        
        res.send(rsp(false,"Please Fill The Required Fields."));
    
    }   
});


// Delete Goals
app.delete("/goals/:id",[isAuthoried,getUserId],(req,res)=>{
    let goalid = req.params.id;
    let userid = res.locals.userid;

    connection.query("DELETE FROM goals WHERE id=? and user_token=?",[goalid,userid],(err,result)=>{
        
        if(result.affectedRows>0) res.send(rsp(true,"Goal Deleted Successfully."));
        else res.send(rsp(false,"Unable To Delete The Goal Please Try Again Letter."));
    
    })
})

// Update Goals
app.put("/goals/:goalid",[isAuthoried,getUserId],(req,res)=>{
    let goal = req.body.goalname;
    let goalsdate = req.body.goalstartdate;
    let goaledate = req.body.goalenddate;
    let amount = req.body.goalamount;
    let userid = res.locals.userid;
    let goalid = req.params.goalid;

    connection.query("UPDATE goals SET goal_name=CASE WHEN ? = '' THEN goal_name ELSE ? END , goal_start_date=CASE WHEN ? = '' THEN goal_start_date ELSE ? END , goal_end_date=CASE WHEN ? = '' THEN goal_end_date ELSE ? END , goal_amount=CASE WHEN ? = '' THEN goal_amount ELSE ? END WHERE id=? AND user_token=?",[goal,goal,goalsdate,goalsdate,goaledate,goaledate,amount,amount,goalid,userid],(err,result)=>{
        
        if (err) throw err;
        if (result.affectedRows>0) res.send(rsp(true,"Updated Successfully!"));
        // else res.send(rsp(false,"Unable To Update The Goal Please Try Again Latter."));
        else res.send(rsp(false,"Unable To Update The Goal Please Try Again Latter."));
    
    })
})



// get Goal Entries
app.get("/goals/:goalid/entries",[isAuthoried,getUserId,isValidGoal],(req,res)=>{
    let goalid = req.params.goalid;

    connection.query("SELECT * FROM goal_entries WHERE goal_id=? ",[goalid],(err,data)=>{
        
        if (err) throw err;
        if (data.length>0) res.send(rsp(true,"",data));
        else res.send(rsp(false,"No Entries Found."));
    
    })
})

// create a new goal entry
app.post("/goals/:goalid/entries",[isAuthoried,getUserId,isValidGoal],(req,res)=>{
    let goalid = req.params.goalid;
    let entrydes = req.body.entrydes;
    let entryamount = req.body.entryamount;
    let moneytype = "ADD";
    console.log(req.body.entryamount);
    
    if(entryamount>0){
        connection.query("INSERT INTO goal_entries (id,entry_des,entry_amount,money_type,goal_id)VALUES(?,?,?,?,?)",[randomid(8),entrydes,entryamount,moneytype,goalid],(err,result)=>{
                
            if (err) throw err;
            if (result.affectedRows>0) res.send(rsp(true,"Entry Created Successfully."));
            else res.send(rsp(false,"Unable To Create Entry Please Try Again Latter."));
            
        })
    }else{
        res.send(rsp(false,"Please Fill The Required Fields."));
    }
})

app.delete("/goals/:goalid/entries/:entrieid",[isAuthoried,getUserId,isValidGoal],(req,res)=>{
    let goalid = req.params.goalid;
    let entrieid = req.params.entrieid;

    connection.query("DELETE FROM goal_entries WHERE id=? AND goal_id=?",[entrieid,goalid],(err,result)=>{
        
        if (err) throw err;
        if (result.affectedRows>0) res.send(rsp(true,"Entry Deleted Successfully."));
        else res.send(rsp(false,"Unable To Delete The Entry Please Try Again Latter."));
    
    })
})

app.put("/goals/:goalid/entries/:entrieid",[isAuthoried,getUserId,isValidGoal],(req,res)=>{
    let goalid = req.params.goalid;
    let entrieid = req.params.entrieid;
    let entrydes = req.body.entrydes;
    let entryamount = req.body.entryamount;
    let moneytype = req.body.moneytype;

    connection.query("UPDATE goal_entries SET entry_des=CASE WHEN ? = '' THEN entry_des ELSE ? END , entry_amount=CASE WHEN ? = '' THEN entry_amount ELSE ? END , money_type=CASE WHEN ? = '' THEN money_type ELSE ? END WHERE id=? AND goal_id=?",[entrydes,entrydes,entryamount,entryamount,moneytype,moneytype,entrieid,goalid],(err,result)=>{
        
        if (err) throw err;
        if (result.affectedRows>0) res.send(rsp(true,"Entry Updated Successfully."));
        else res.send(rsp(false,"Unable To Update The Entry Please Try Again Latter."));
    
    })
})

// Middlewares and other functions

// Check If The User is Logged In
function isAuthoried(req,res,next){
    
    let token = req.headers.token

    connection.query("SELECT * FROM users WHERE token=?",[token],(err,results)=>{

        if (err) throw err;
        if (results.length<1) res.sendStatus(401);
        else next();
    })
}

// Getting User Id
function getUserId(req,res,next){
    let token = req.headers.token;

    connection.query("SELECT id FROM users WHERE token=?",[token],(err,user)=>{
        if(user.length>0){
            res.locals.userid = user[0].id;
            next();
        }else{
            res.send(rsp(false,"Invalid Token"));
        }
    })
}

function isValidGoal(req,res,next){
    let goalid = req.params.goalid;
    let userid = res.locals.userid;

    connection.query("SELECT * FROM goals WHERE id=? AND user_token=?",[goalid,userid],(err,data)=>{
        
        if(data.length>0) next();
        else res.send(rsp(false,"This Goal Is Not Blongs to You Or Does Not Exist."));
    
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