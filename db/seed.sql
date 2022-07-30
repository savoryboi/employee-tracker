USE emp_db;

INSERT INTO department (dep_name) VALUES
    ('Sales'), 
    ('Communications'), 
    ('Management');


INSERT INTO roles (title, salary, department_id) VALUES
    ('Manager', 200000, 3), 
    ('Supervisor', 150000, 3), 
    ('Comm Lead', 150000, 2), 
    ('Salesperson', 160000, 1);

INSERT INTO employee (first_name, last_name, role_id) VALUES
    ('Andy', 'Bjerk', 1), 
    ('Jimmy', 'Johnson', 4), 
    ('Nina', 'Pierce', 3), 
    ('Bridget', 'Smitherines', 2);