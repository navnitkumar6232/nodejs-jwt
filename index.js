const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const secretKey="secretkey";
const app = express();
app.use(express.json());
app.use(cors());

const username="";
const password="";
const mysql = require('mysql2');
const { log } = require('console');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
  });


  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to database!');
  
  }
   );
       

app.get("/",(req,res)=>{
    res.json({
        message:"a sample api"
    })
})
// for register router to register a new user to the database
app.post("/register", (req, res) => {
  const value_reg= req.body;
  const name=value_reg.name;
  const email=value_reg.email;
  const password=value_reg.password;
  // for debugging this console
  // console.log(req.body);
  //  console.log("$$$$$$",name);
    // Insert user into database 
    pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password],
      (err, results) => {
        if (err) throw err;
         console.log(results);
        res.json({
          message: 'User registered successfully!'
        });
      }
    );
});


// for login request from postman 

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  console.log(email);
  // Find user in database
  pool.query(
    `SELECT * FROM users WHERE email ='${email}' and password= '${password}' `,
    (err, results) => {
      console.log(results);
      if (err) throw err;
      else if (results.length === 0) {
        res.status(401).json({
          message: 'Invalid email or password'
        });
      } else if(results.length ) {
        const user = results[0];

               console.log(results);

            jwt.sign({user}, secretKey, {expiresIn:'600s'},(err,token)=>{
              if(err) throw err;
              res.json({
                  token,
                  message:"login successful"
              });
             });
            }
        else {
            res.status(401).json({
              message: 'Invalid email or password'
            });
          }      
    }
  );
});


app.listen(5000,()=>{
    console.log("app is running on 5000 port");
})

// for register route the url is 'http://localhost:5000/register';
// for login route the url is 'http://localhost:5000/login';
// in my local sustme.

// for testing  of register router
// {
//   "name": "navnit",
//   "email": "navnitkumar123@gmail.com",
//   "password": "navnit123"
// }

// for testion of login router

  // {
  //   "email": "navnitkumar123@gmail.com",
  //   "password": "navnit123"
  // }

  

