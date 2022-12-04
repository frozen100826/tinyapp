const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca", 
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Sending HTML
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls/new", (req, res) => {
  const userObjt = users[req.params.id]
  if (userObjt === undefined) {
    res.redirect("/login");
  }
  if (userObjt) {
    const templateVars = { user: userObjt, urls: urlDatabase };
    res.render("urls_new", templateVars);
  }
});

//Adding Routes
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//Add a route for /urls
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//URL - Edit 
app.post("/urls", (req, res) => {
  console.log(req.body.longURL); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});


//new Route
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  
  const longURL = urlDatabase[req.params.id].longURL
  const templateVars = {id, longURL }
  res.render("urls_show", templateVars );
});


//change to shorURL
app.post("/urls/:id", (req, res) =>{
  const newURL = req.params.id
  urlDatabase[newURL].longURL = req.body.longURL; 
  console.log(req.body.longURL)
 res.redirect('/urls');
});

// /u/:id
app.get("/u/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

// id/delete
app.post("/urls/:id/delete", (req,res) => {
  delete  urlDatabase[req.params.id];
  res.redirect("/urls" );
})


function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result
};



/* sign in - get*/
app.get("/login", (req, res)=>{
  console.log("hi");
  let user = null;
  res.render("urls_login",{user: null});
});

/* sign in - post*/
app.post('/login', (req, res)=>{
  req.session.user_id = userID;
  res.redirect('/urls')

      
  // if (userID) {
  //   if (bcrypt.compareSync(req.body.password, users[userID].password)) {
  //     console.log("rescookie done");
  //     req.session.user_id = userID;
  //     res.redirect("/urls");
  //   } else {
  //     res.status(403).send("wrong");
  //   }
  // } else {
  //   res.status(403).send("wrong");
  // }
  // ;
});


/* loggout */
app.post("/logout", (req, res)=>{
    
  req.session.user_id = null;
  res.redirect("/urls");
});

/* register - get */
app.get("/register", (req, res)=>{
  console.log("GET");
  res.render("urls_register", {user: null});
});

// /* register - post */
app.post("/register", (req, res)=>{
  let getEmail = req.body.email;
  console.log(getEmail);
  let getPassword = req.body.password;
  if (getEmail === '' || getPassword === '') {
    console.log("error");
    return res.status(400).send("Error");
  } else {
  for (let keys in users) {
      if (users[keys].email === getEmail) {
        return res.status(400).send("email already exitsts");
      }
    };
  res.redirect('/urls')
  }});
