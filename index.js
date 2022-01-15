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

// these functions will handle the view (table) responses, converting node responses to the below sql syntax
function viewDepartments() {
  const sql = `SELECT * FROM departments`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW ALL DEPARTMENTS");
    console.log("\n");
    console.table(res);
    tableCreation();
  });
}

function viewRoles() {
  const sql = `SELECT roles.*,
    departments.department_name AS department_name
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id;`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW ALL ROLES");
    console.log("\n");
    console.table(res);
    tableCreation();
  });
}

function viewEmployees() {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
  roles.salary, CONCAT(manager.first_name, ' ' ,  manager.last_name) AS manager 
FROM employees
LEFT JOIN employees manager ON employees.manager_id = manager.id 
INNER JOIN roles ON employees.role_id = roles.id;`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW ALL EMPLOYEES");
    console.log("\n");
    console.table(res);
    tableCreation();
  });
}

// handles the addition of a new departmen
function newDepartment(departmentQuestions) {
  const sql = `INSERT INTO departments (department_name)
VALUES
('${departmentQuestions.department_name}');`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("ADD DEPARTMENT");
    console.log("\n");
    viewDepartments();
  });
}

// handles the addition of a new role
function newRole(roleQuestions) {
  const sql = `INSERT INTO roles (title, salary, department_id)
VALUES
('${roleQuestions.role_title}', ${roleQuestions.role_salary}, ${roleQuestions.role_department});`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("ADD ROLE");
    console.log("\n");
    viewRoles();
  });
}
