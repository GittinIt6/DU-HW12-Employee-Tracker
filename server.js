const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
    host: '192.168.147.181',
    user: 'sqladmin',
    password: 'sqladmin1',
    database: 'tracker_db',
    },
    // console.log(`Connected to the tracker_db database.`)
);

let listData = [];
const listEmployees = 'SELECT CONCAT(first_name," ",last_name) AS full_name FROM employee';
const qRoles = 'SELECT title AS Job_Title, role.id AS Role_ID, name AS Department, salary AS Salary FROM role JOIN department ON role.department_id = department.id;';
const qDepartments = 'SELECT name AS Dept_Name, id AS Dept_ID FROM department';
const qEmployees = 'SELECT CONCAT(employee.first_name," ",employee.last_name) AS Employee_Name,employee.id AS Employee_ID,role.title AS Job_Title,role.salary AS Salary,department.name AS Department,CONCAT(a.first_name," ",a.last_name) AS Manager_Name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id JOIN employee a ON employee.manager_id = a.id ORDER BY title;'

let init = () => {
  inquirer
  .prompt([
      {
          type: 'list',
          message: "What would you like to do?",
          name: 'firstChoice',
          choices:['View All Departments', 'View All Roles', 'Veiw All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role','Exit'],
      }
  ])
  .then(async (response) => {
      switch (response.firstChoice) {
          case 'View All Departments':
            await dataQuery(qDepartments,true);
            endQuest();
            break;
          case 'View All Roles':
            await dataQuery(qRoles,true);
            endQuest();
            break;
          case 'Veiw All Employees':
            await dataQuery(qEmployees,true);
            endQuest();
            break;
          case 'Add A Department':
            await departmentAdd();
            break;
          case 'Add A Role':
            await roleAdd();
            break;
          case 'Add An Employee':
            await employeeAdd();
            break;
          case 'Update An Employee Role':
            listData = [];
            const forData = await dataQuery(listEmployees,false);
            for (let i = 0; i < forData.length; i++) {
              listData.push(forData[i].full_name);   
            };
            await employeeUpdate(listData);
            listData = [];
            break;
          case 'Exit':
            db.end();
      }
  });
};

let employeeUpdate = async (choiceInput) => {
  inquirer
  .prompt([
      {
          type: 'list',
          message: "Select the Employee to update:",
          name: 'employeeChoice',
          choices: choiceInput,
      }
  ])
  .then(async(response) => {
      listData = [];
      const forData = await dataQuery('SELECT title FROM role',false)
      for (let i = 0; i < forData.length; i++) {
        listData.push(forData[i].title);   
      };
      employeeRoleUpdate(listData,response.employeeChoice);
  });
  return;
};

let employeeRoleUpdate = (choiceInput,employee) => {
  inquirer
  .prompt([
      {
          type: 'list',
          message: "Select new Employee Role:",
          name: 'employeeRoleChoice',
          choices: choiceInput,
      }
  ])
  .then(async(response) => {
      let empName = employee.split(" ");
      const empID = await dataQuery(`SELECT id FROM employee WHERE first_name = '${empName[0]}' AND last_name = '${empName[1]}'`,false);
      const roleID = await dataQuery(`SELECT id FROM role WHERE title = '${response.employeeRoleChoice}'`,false);
      await dataQuery(`UPDATE employee SET role_id = ${roleID[0].id} WHERE id = ${empID[0].id}`,false);
      console.log(`USER UPDATE SUCCESS: ${employee} new role is ${response.employeeRoleChoice}`);
      return endQuest();
  });
  return;
};

let departmentAdd = async () =>{
  inquirer
  .prompt([
      {
        type: 'input',
        message: "Enter New DEPARTMENT Name:",
        name: 'deptInput',
        default:'New Department',
      }
  ])
  .then(async(response) => {
      await dataQuery(`INSERT INTO department (name) VALUES ('${response.deptInput}')`,false);
      console.log(`NEW Department SUCCESS: ${response.deptInput} added as a new department`);
      return endQuest();
  })
  .catch((error) => {
    console.log('got error', error);
  });
  return;
};

let roleAdd = async () =>{
  listData = [];
  const forData = await dataQuery('SELECT name FROM department',false)
  for (let i = 0; i < forData.length; i++) {
    listData.push(forData[i].name);   
  };
  inquirer
  .prompt([
      {
        type: 'input',
        message: "Enter New ROLE Name:",
        name: 'roleInput',
        default:'New Role',
      },
      {
        type: 'input',
        message: "Enter SALARY of new role:",
        name: 'salaryInput',
        default:'100,000',
      },
      {
        type: 'list',
        message: "Select DEPARTMENT for Role:",
        name: 'departmentChoice',
        choices: listData,
      }
  ])
  .then(async(response) => {
      const deptID = await dataQuery(`SELECT id FROM department WHERE name = '${response.departmentChoice}'`,false);
      await dataQuery(`INSERT INTO role (title, salary, department_id) VALUES ('${response.roleInput}',${parseFloat(response.salaryInput.replace(/,/g, ''))},${deptID[0].id})`,false);
      console.log(`NEW Role SUCCESS: ${response.roleInput} added as a new role in department: ${response.departmentChoice}`);
      listData = [];
      return endQuest();
  })
  .catch((error) => {
    console.log('got error', error);
  });
  return;
};

let employeeAdd = async () =>{
  let roleListData = [];
  let managerListData = [];
  const forDataRole = await dataQuery('SELECT title FROM role',false)
  for (let i = 0; i < forDataRole.length; i++) {
    roleListData.push(forDataRole[i].title);
  };
  const forDataMgr = await dataQuery('SELECT CONCAT(first_name," ",last_name) AS employee_name FROM employee',false)
  for (let i = 0; i < forDataMgr.length; i++) {
    managerListData.push(forDataMgr[i].employee_name);
  };
  inquirer
  .prompt([
      {
        type: 'input',
        message: "Enter Employee FIRST Name:",
        name: 'fnameInput',
        default:'Tim',
      },
      {
        type: 'input',
        message: "Enter Employee LAST Name:",
        name: 'lnameInput',
        default:'Smith',
      },
      {
        type: 'list',
        message: "Select Employee's ROLE:",
        name: 'roleChoice',
        choices: roleListData,
      },
      {
        type: 'list',
        message: "Select Employee's Manager:",
        name: 'managerChoice',
        choices: managerListData,
      }
  ])

  .then(async(response) => {
      let mgrName = response.managerChoice.split(" ");
      const mgrID = await dataQuery(`SELECT id FROM employee WHERE first_name = '${mgrName[0]}' AND last_name = '${mgrName[1]}'`,false);
      const roleID = await dataQuery(`SELECT id FROM role WHERE title = '${response.roleChoice}'`,false);
      await dataQuery(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.fnameInput}','${response.lnameInput}',${roleID[0].id},${mgrID[0].id})`,false);
      console.log(`NEW EMPLOYEE SUCCESS: New employee ${response.fnameInput} ${response.lnameInput}, ${response.roleChoice}, added as a new employee reporting to ${response.managerChoice}.`);
      return endQuest();
  })
  .catch((error) => {
    console.log('got error', error);
  });
  return;
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

let dataQuery = async (qType,renderTable) => {
    let qData;
    await db.promise().query(`${qType}`)
    .then( ([rows,fields]) => {
        qData = rows;
      })

      if (renderTable) {await buildTable(qData);
        return qData;
      }
      else{
          return qData;
      };
};

let buildTable = results => {
  const table = cTable.getTable(results);
  return new Promise ((resolve) => {
      console.log(`Results:`);
      resolve(console.table(table));
  });
}

init();