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

departmentQuestions = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What is the name of the department you would like to add?",
      },
    ])
    .then(newDepartment);
};

roleQuestions = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "role_title",
        message: "Which role would you like to add?",
      },
      {
        type: "input",
        name: "role_salary",
        message: "What is the salary of this role?",
      },
      {
        type: "input",
        name: "role_department",
        message: "What is the roles department_id?",
      },
    ])
    .then(newRole);
};

employeeQuestions = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "employee_first",
        message: "What is your employee's first name?",
      },
      {
        type: "input",
        name: "employee_last",
        message: "What is your employee's last name?",
      },
      {
        type: "input",
        name: "employee_role",
        message: "What is your employee's role id?",
      },
      {
        type: "input",
        name: "employee_manager",
        message: "What is your employee's manager id?",
      },
    ])
    .then(newEmployee);
};

updateEmployee = () => {
  db.query("SELECT * FROM employees ORDER BY first_name", (err, data) => {
    const employees = data.map((employee) => {
      console.log(data);
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
    db.query("SELECT * FROM roles ORDER BY title", (err, data) => {
      const roles = data.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "update_employee",
            message: "Which Employee would you like to update?",
            choices: employees,
          },
          {
            type: "list",
            name: "update_role",
            message: "What is your employee's new role?",
            choices: roles,
          },
        ])
        .then((res) => {
          db.query(
            "UPDATE employees SET role_id = ? WHERE id = ?",
            [res.update_role, res.update_employee],
            (err, data) => {
              viewEmployees();
            }
          );
        });
      console.log(data);
    });
  });
};
