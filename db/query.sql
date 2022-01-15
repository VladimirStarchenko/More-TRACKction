SELECT roles.*,
  departments.department_name AS department_name
FROM roles
LEFT JOIN departments ON roles.department_id = departments.id;

SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
  roles.salary, CONCAT(manager.first_name, ' ' ,  manager.last_name) AS manager 
FROM employees
LEFT JOIN employees manager ON employees.manager_id = manager.id 
INNER JOIN roles ON employees.role_id = roles.id;