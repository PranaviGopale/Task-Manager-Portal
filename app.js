const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

var registeredUsersList = [
{ email: "admin@company.com", pass: "admin123", role: "Admin" },
    { email: "testuser@company.com", pass: "user123", role: "Member" }
];

let db = new sqlite3.Database('./tasks.db', (err) => {
if (err) { 
  console.log("db error"); 
    } else {
        db.serialize(() => {
   db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, assigned_to TEXT, status TEXT)");
            db.run("DELETE FROM tasks", [], () => {
    db.run("INSERT INTO tasks (id, title, assigned_to, status) VALUES (1, 'Submit Project Files', 'testuser@company.com', 'Pending')");
     db.run("INSERT INTO tasks (id, title, assigned_to, status) VALUES (2, 'Review Codebase Architecture', 'admin@company.com', 'In Progress')");
                console.log("Database initialized with rows 1 and 2");
            });
        });
    }
});

function checkMyToken(req, res, next) {
   var header = req.headers['authorization'];
   if (!header) {
  return res.send({ success: false, message: "No token given" });
    }
     var currentToken = header.split(' ')[1];
    if (currentToken === "mock_token_secret_123") {
   req.loggedInUser = { email: "testuser@company.com", role: "Member" };
        next();
    } else if (currentToken === "admin_token_secret_abc") {
        req.loggedInUser = { email: "admin@company.com", role: "Admin" };
   next();
    } else {
        res.send({ success: false, message: "Invalid auth token" });
    }
}

app.post('/api/register', function(req, res) {
    var name = req.body.name;
    var userEmail = req.body.email;
    var pass = req.body.password;
    var systemRole = req.body.role;

    if (!name || !userEmail || !pass) {
return res.send({ success: false, message: "All fields are required" });
    }
    if (name.trim().length < 2) {
 return res.send({ success: false, message: "Enter a valid full name" });
    }
    if (userEmail.indexOf('@') === -1 || userEmail.indexOf('.') === -1) {
return res.send({ success: false, message: "Invalid email address format" });
    }

    registeredUsersList.push({
   email: userEmail,
        pass: pass,
        role: systemRole
    });

    res.send({ success: true, message: "User account created sucessfully!" });
});

app.post('/api/login', function(req, res) {
   var emailInput = req.body.email;
    var passInput = req.body.password;

    var foundUser = null;
    for (var i = 0; i < registeredUsersList.length; i++) {
if (registeredUsersList[i].email === emailInput && registeredUsersList[i].pass === passInput) {
            foundUser = registeredUsersList[i];
            break;
        }
    }

    if (foundUser) {
        var secureTokenString = foundUser.role === "Admin" ? "admin_token_secret_abc" : "mock_token_secret_123";
        return res.send({ 
  success: true, 
            token: secureTokenString, 
            role: foundUser.role 
        });
    }

    res.send({ success: false, message: "Wrong details typed." });
});

app.post('/api/forgot-password', function(req, res) {
   var resetEmail = req.body.email;
    if (!resetEmail) {
return res.send({ success: false, message: "Email parameter is missing" });
    }
    
    var accountMatch = null;
    for (var i = 0; i < registeredUsersList.length; i++) {
        if (registeredUsersList[i].email === resetEmail) {
            accountMatch = registeredUsersList[i];
   break;
        }
    }
    
    if (accountMatch) {
  res.send({ success: true, message: "Account recovered! Password is: " + accountMatch.pass });
    } else {
        res.send({ success: false, message: "No profile matches that email address." });
    }
});

app.get('/api/tasks', checkMyToken, function(req, res) {
  var user = req.loggedInUser;
    
    if (user.role === 'Admin') {
db.all("SELECT * FROM tasks", [], function(err, rows) {
    if (err) return res.send({ success: false, message: "Error reading db" });
        res.send({ success: true, tasks: rows });
        });
    } else {
  db.all("SELECT * FROM tasks WHERE assigned_to = ?", [user.email], function(err, rows) {
      if (err) return res.send({ success: false, message: "Error reading db" });
          res.send({ success: true, tasks: rows });
        });
    }
});

app.post('/api/tasks', checkMyToken, function(req, res) {
    if (req.loggedInUser.role !== 'Admin') {
  return res.send({ success: false, message: "Unauthorised access resource" });
    }
    var title = req.body.title;
    var assignTo = req.body.assigned_to;
    var taskStatus = req.body.status || "Pending";

    if (!title || !assignTo) {
return res.send({ success: false, message: "Missing task creation data parameters" });
    }

    db.run("INSERT INTO tasks (title, assigned_to, status) VALUES (?, ?, ?)", [title, assignTo, taskStatus], function(err) {
if (err) {
    return res.send({ success: false, message: "Database failure creating row" });
        }
   res.send({ success: true, message: "New operational task registered details successfully!" });
    });
});

app.put('/api/tasks/:id', checkMyToken, function(req, res) {
    var targetId = req.params.id;
    var rawStatusInput = req.body.status;
    var activeUserObj = req.loggedInUser; 
    if (!rawStatusInput) {
 return res.send({ success: false, message: "Missing new status" });
    }
   db.get("SELECT assigned_to FROM tasks WHERE id = ?", [targetId], function(databaseError, fetchedTaskRow) {
  if (databaseError) {
      return res.send({ success: false, message: "Database Verification Error" });
        }
        if (!fetchedTaskRow) {
return res.send({ success: false, message: "Task not found" });
        }
        var userIsAdmin = activeUserObj.role === 'Admin';
        var ownsThisTask = fetchedTaskRow.assigned_to === activeUserObj.email;
        if (!userIsAdmin && !ownsThisTask) {
  return res.send({ success: false, message: "You can only update your own assigned tasks" });
        }
        db.run("UPDATE tasks SET status = ? WHERE id = ?", [rawStatusInput, targetId], function(updateSqlError) {
     if (updateSqlError) {
         return res.send({ success: false, message: "Failed to update task status" });
            }
   res.send({ success: true, message: "Task status updated sucessfully!" });
        }); 
    }); 
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


const port = process.env.PORT || 8080;

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});