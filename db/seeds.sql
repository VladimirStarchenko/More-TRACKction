INSERT INTO departments (department_name)
VALUES
('Legal'),
('Human Resources'),
('Software Development');

INSERT INTO roles (title, salary, department_id)
VALUES
('Software Engineer', 175000, 3),
('HR representative', 80000, 2),
('Lawyer', 230000, 1),
('Manager', 110000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Bob', 'Smith', 4, null),
('John', 'Doe', 1, null),
('Amy', 'Smith', 3, null),
('Michael', 'Scott', 2, 1);