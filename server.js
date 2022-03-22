const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

// const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
    host: '192.168.147.181',
    user: 'sqladmin',
    password: 'sqladmin1',
    database: 'tracker_db',
    },
    console.log(`Connected to the tracker_db database.`)
);

const qRoles = 'SELECT title AS Job_Title, role.id AS Role_ID, name AS Department, salary AS Salary FROM role JOIN department ON role.department_id = department.id;';
const qDepartments = 'SELECT name AS Dept_Name, id AS Dept_ID FROM department';
const qEmployees = 'SELECT CONCAT(employee.first_name," ",employee.last_name) AS Employee_Name,employee.id AS Employee_ID,role.title AS Job_Title,role.salary AS Salary,department.name AS Department,CONCAT(a.first_name," ",a.last_name) AS Manager_Name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id JOIN employee a ON employee.manager_id = a.id ORDER BY title;'
let dbQuery = qEmployees;

let init = async () => {
  inquirer
  .prompt([
      {
          type: 'list',
          message: "What would you like to do?",
          name: 'firstChoice',
          choices:['View All Departments', 'View All Roles', 'Veiw All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role'],
      }
  ])
  .then(async (response) => {
      switch (response.firstChoice) {
          case 'View All Departments':
              dbQuery = qDepartments;
              await dataQuery(dbQuery);
              endQuest();
              break;
          case 'View All Roles':
              dbQuery = qRoles;
              await dataQuery(dbQuery);
              endQuest();
              break;
          case 'Veiw All Employees':
              dbQuery = qEmployees;
              await dataQuery(dbQuery);
              endQuest();
              }
  });
};

const endQuest = () =>{
  inquirer
  .prompt([
      {
          type: 'confirm',
          message: "Would you like to perform more actions?",
          name: 'restart',
          default: true,
      }
  ])
  .then( (response) => {
      switch (response.restart) {
          case true:
              init();
              break;
          case false:
            db.end();
      }
  });
}

let dataQuery = async (qType) => {
    let qData;
    await db.promise().query(`${qType}`)
    .then( ([rows,fields]) => {
        qData = rows;
      })
      // .catch(console.log)
      // .then( () => db.end());
    await buildTable(qData);
    console.log('done building table');
    return;
};

let buildTable = results => {
  const table = cTable.getTable(results);
  return new Promise ((resolve) => {
      console.log('printing table');
      resolve(console.table(table));
  });
}

//Inquirer Question: What would you like to do? Options:view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

    //view all departments: presented with a formatted table showing department names and department ids
    //console.table
    //SELECT * FROM department;

    //view all roles: presented with the job title, role id, the department that role belongs to, and the salary for that role
    //console.table
    //join role and department on department_id;

    //view all employees: presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to 
    //console.table
    //join employee role and department;

    //add a department: prompted to enter the name of the department and that department is added to the database
      //ENTER NAME OF DEPARTMENT:
      //INSERT INTO department (name) VALUES (${string of dept});
    
    //add a role: prompted to enter the name, salary, and department for the role and that role is added to the database
      //inquirer text//ENTER ROLE NAME:
      //inquirer text//ENTER ROLE SALARY:
      //inquirer options - get departments from department table to be inserted as options
      //ENTER ROLE DEPARTMENT:
        //get department id from department table, set to role.department_id variable
      //INSERT INTO role (title, salary, department_id) VALUES (?,?,?),{title}, {salary}, {department_id};

    //add an employee: prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
      //inquirer text//ENTER EMPLOYEE FIRST NAME:
      //inquirer text//ENTER EMPLOYEE LAST NAME:
      //inquirer options - get roles from role table to be inserted as options
      //ENTER EMPLOYEE ROLE:
        //get role id from role table, set to employee.role_id variable
      //inquirer options - get managers from employee table
        //SELECT id FROM employee WHERE manager_id = id;
        //+ option to add the Employee as the manager
      //ENTER EMPLOYEE MANAGER:
       //INSERT INTO employee (first_name, last_name, role_id, manager_id);

    //update an employee role: prompted to select an employee to update and their new role and this information is updated in the database 
      //inquirer options - get employees from [employee] table
      //SELECT first_name,last_name FROM employee;
      //CHOOSE EMPLOYEE:
        //set choice to variable
        //get employee id from [employee] table to be used to update.
        //inquirer options - get roles from role table to be inserted as options
      //CHOOSE NEW EMPLOYEE ROLE:
        //get role id from role table, set to employee.role_id variable
        //UPDATE employee SET role_id = {role_id} WHERE id = {id}
init();

// app.listen(PORT, () =>
//   console.log(`App listening at http://localhost:${PORT} 🚀`)
// );