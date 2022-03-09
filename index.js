const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    init();
});

function init() {

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

function viewDepartments() {
    console.log("Viewing Departments\n");
  
    var query =
      `SELECT ID, NAME FROM DEPARTMENT`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      console.table(res);
      console.log("Here are the Departments\n");
  
      init();
    });
  
}

function viewRoles() {
    console.log("Viewing Roles\n");
  
    var query =
      `SELECT ID, TITLE, SALARY, DEPARTMENT_ID FROM ROLE`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      console.table(res);
      console.log("Here are the Roles\n");
  
      init();
    });
  
}

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

function addDepartment() {

    var query1 =
      `SELECT ID, NAME FROM DEPARTMENT`
  
    connection.query(query1, function (err, res) {
      if (err) throw err;
        console.table(res);
    });

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
  
function addRole() {

    var query1 =
      `SELECT title, salary, department_id FROM ROLE`
  
    connection.query(query1, function (err, res) {
      if (err) throw err;
  
      console.table(res);
    });

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


function addEmployee() {
  console.log("Add an Employee")

  var query1 =
    `SELECT first_name, last_name, role_id, manager_id FROM EMPLOYEE`

  connection.query(query1, function (err, res) {
    if (err) throw err;

    console.table(res);
  });

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


function updateEmpRole() {

  var query =
    `SELECT first_name, last_name, role_id, manager_id FROM EMPLOYEE`

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);


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

