use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 100000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 115000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Doe', 2, 1),
    ('Ashley', 'Jones', 3, NULL),
    ('Sam', 'Smith', 4, 3),
    ('Ryan', 'Brown', 5, NULL),
    ('George', 'Forman', 6, 5),
    ('David', 'Lee', 7, NULL),
    ('Chris', 'Army', 8, 7);
