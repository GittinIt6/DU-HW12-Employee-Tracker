INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Technology");
INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 100000.99, 1),
       ("Engineer", 100001.99, 2),
       ("Lead Engineer", 100002.99, 2),
       ("Accountant", 100003.99, 3),
       ("Lead Accountant", 100004.99, 3),
       ("Legal Team Lead", 100005.99, 4),
       ("Lawyer", 100006.99, 4),
       ("Software Engineer", 100007.99, 5),
       ("IT Manager", 100008.99, 5),
       ("Support Technician", 100009.99, 5);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Johnny", "Quick", 1),
       ("Susan", "Summers", 2),
       ("Barbara", "Walters", 4),
       ("Jim", "McJimmerton", 3),
       ("Judge", "Judy", 6),
       ("Peter", "Brady", 7),
       ("Tinker","Bell", 5),
       ("Bob","Loblaw", 8),
       ("Bill","Clinton", 9),
       ("Frank","Sinatra", 10);
       
