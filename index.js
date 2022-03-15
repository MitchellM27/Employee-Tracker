const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require('dotenv').config();
//requring mysql2 for database, inquierer for user interface, console.table for tables, and dotenv for security.

const connection = mysql.createConnection({
  //creating a connection to local host
    host: 'localhost',

    //defining port 3306
    port: 3306,

    //using .env file to hide user, password, and database name.
    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    init();
});

//initial function prompting user for input.
function init() {

  //inquiring what the user would like to do using prompts.
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View Departments",
        "View Roles",
        "View Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Exit"]
    })
    //switch statement allows program to split depending what option is chosen.
    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          viewEmployee();
          break;

        case "View Departments":
          viewDepartments();
          break;

        case "View Roles":
          viewRoles();
          break;  

        case "Add Department":
          addDepartment();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmpRole();
          break;
  
          case "End":
          connection.end();
          break;
      }
    });
}

//if the user views departments.
function viewDepartments() {
    console.log("Viewing Departments\n");

    //using the ID and Name from the Departments.
    var query =
      `SELECT ID, NAME FROM DEPARTMENT`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
      
      //console.table is used to display information.
      console.table(res);
      console.log("Here are the Departments\n");
  
      init();
    });
  
}

//if user chooses to view roles
function viewRoles() {
    console.log("Viewing Roles\n");
    //ID, Title, Salary, and Department ID are selected to be viewed.
    var query =
      `SELECT ID, TITLE, SALARY, DEPARTMENT_ID FROM ROLE`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      console.table(res);
      console.log("Here are the Roles\n");
  
      init();
    });
  
}

//function for user choosing to view employee
function viewEmployee() {
  console.log("Viewing employees\n");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Employees viewed!\n");

    init();
  });

}

//function if user chooses to add a department.
function addDepartment() {

    var query1 =
      `SELECT ID, NAME FROM DEPARTMENT`
  
    connection.query(query1, function (err, res) {
      if (err) throw err;
        console.table(res);
    });

    //prompting user to input the name of the new department.
    inquirer
    .prompt([
      {
        type: "input",
        name: "newDep",
        message: "What will the Department name be?"
      },
    ])
    .then(function (answer) {

      var query2 = `INSERT INTO department SET ?`

      connection.query(query2, {
        name: answer.newDep
      },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Department added");

          init();
        });

    });
  }
  
//if user chooses to add a new role.
function addRole() {

    var query1 =
      `SELECT title, salary, department_id FROM ROLE`
  
    connection.query(query1, function (err, res) {
      if (err) throw err;
  
      console.table(res);
    });


    //user is prompted to input the new title, salary and department of the new role.
    inquirer
      .prompt([
        {
          type: "input",
          name: "newName",
          message: "Role title?"
        },
        {
          type: "input",
          name: "newSalary",
          message: "Role Salary"
        },
        {
          type: "input",
          name: "newDepartmentId",
          message: "Department?",
        },
      ])
      .then(function (answer) {
        
        //the new query is inserted into the existing db.
        var query = `INSERT INTO role SET ?`
        console.log(answer)
  
        connection.query(query, {
          title: answer.newName,
          salary: answer.newSalary,
          department_id: answer.newDepartmentId
        },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log("Role added");
  
            init();
          });
  
      });
  }

//function if the user chooses to add an employee.
function addEmployee() {
  console.log("Add an Employee")

  var query1 =
    `SELECT first_name, last_name, role_id, manager_id FROM EMPLOYEE`

  connection.query(query1, function (err, res) {
    if (err) throw err;

    console.table(res);
  });

  //the user is prompted to add in the first, last name, role, and their manager.
  inquirer
    .prompt([
      {
        type: "input",
        name: "newFirst_name",
        message: "What is their first name?"
      },
      {
        type: "input",
        name: "newLast_name",
        message: "What is their last name?"
      },
      {
        type: "input",
        name: "newRole",
        message: "What is their role ID?",
      },
      {
        type: "input",
        name: "newManager",
        message: "What will their manager's ID be?",
      },
    ])
    .then(function (answer) {
      console.log(answer);

      //the user's answers are then imput into the existing employee table in the db.
      var query2 = `INSERT INTO employee SET ?`
      connection.query(query2,
        {
          first_name: answer.newFirst_name,
          last_name: answer.newLast_name,
          role_id: answer.newRole,
          manager_id: answer.newManager,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Employee Added \n");

          init();
        });
    });
}

//function to update an existing employee's role.
function updateEmpRole() {

  //existing employees are shown for convenience.
  var query =
    `SELECT first_name, last_name, role_id, manager_id FROM EMPLOYEE`

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);


    //user is prompted to chose by employee id and role id, whom they'd like adjust.
    inquirer
    .prompt([
      {
        type: "input",
        name: "empId",
        message: "Which employee (by ID) do you want to give a different role?",
      },
      {
        type: "input",
        name: "role",
        message: "Which role (by ID) do you want to assign to them?",
      },
    ])
    .then(function (answer) {

      //user's input is then logged into the query and the table is adjusted.
      var query = `UPDATE employee SET role_id = ? WHERE id = ?`
      connection.query(query,
        [ answer.role,  
          answer.empId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Updated successfully!");

          init();
        });
    });

  });
}

