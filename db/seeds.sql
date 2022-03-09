USE employees_db;

INSERT INTO department (name)
VALUES ("Kitchen");
INSERT INTO department (name)
VALUES ("Servers");
INSERT INTO department (name)
VALUES ("Bar");

INSERT INTO role (title, salary, department_id)
VALUES ("Busser", 30000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Runner", 40000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Server", 50000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Bartender", 60000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 70000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Cook", 40000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Chef", 60000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Brady", 6, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Durant", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Conor", "McGregor", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Stephen", "Curry", 7, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tiger", "Woods", 6, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("LeBron", "James", 3, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Shohei", "Ohtani", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Jordan", 3, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Wayne", "Gretzky", 2, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Manny", "Pacquiao", 1, 3);