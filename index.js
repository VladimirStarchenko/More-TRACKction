// link all libraries/packages
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "company_db",
  },
  console.log("Connected to the company database")
);

db.connect((err) => {
  if (err) throw err;
  tableCreation();
});

tableCreation = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        message: "What would you like to do? (Required)",
        validate: (selection) => {
          if (selection) {
            return true;
          } else {
            console.log("Cannot leave as a blank value!");
            return false;
          }
        },
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then((choice) => {
      console.log("choice", choice);
      if (choice.selection === "View all departments") {
        return viewDepartments();
      } else if (choice.selection === "View all roles") {
        return viewRoles();
      } else if (choice.selection === "View all employees") {
        return viewEmployees();
      } else if (choice.selection === "Add a department") {
        return departmentQuestions();
      } else if (choice.selection === "Add a role") {
        return roleQuestions();
      } else if (choice.selection === "Add an employee") {
        return employeeQuestions();
      } else if (choice.selection === "Update an employee role") {
        return updateEmployee();
      } else {
        console.log("Thank you for visiting.");
        db.end();
      }
    });
};
