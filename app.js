const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

const nav_menu = [
    {
        type: 'list',
        name: 'nav',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role']
    }
];

const dep_prompts = [
    {
        name: 'new_dep',
        type: 'input',
        message: 'Enter new department name:'
    }
];

const role_prompts = [
    {
        name: 'new_role', 
        type: 'input', 
        message: 'Name of new role:'
    }, 
    {
        name: 'salary', 
        type: 'number', 
        message: 'New role salary:'
    }, 
    {
        name: 'department', 
        type: 'list', 
        message: 'Department of new role:', 
        choices: ['Management', 'Sales', 'Communications', 'HR', 'Engineering']
    }
];

function menu() {
    inquirer.prompt(nav_menu)
        .then(choice => {
            selectedOption(choice)
        });
};

function selectedOption(choice) {
    if (choice.nav === 'View All Employees') {

        db.query('SELECT * FROM employee', (err, data) => {
            if (err) return console.log(err);

            return console.table(data);
        });
    };

    if (choice.nav === 'View All Departments') {

        db.query('SELECT * FROM department', (err, data) => {
            if (err) return console.table(err);

            return console.table(data);
        });
    };

    if (choice.nav === 'View All Roles') {

        db.query('SELECT * FROM roles', (err, data) => {
            if (err) return console.log(err);

            return console.table(data);

        });
    };

    if (choice.nav === 'Add Department') {
        newDepartment();
    };

    if (choice.nav === 'Add Role') {
        newRole();
    };

    if (choice.nav === 'Add Employee') {
        newEmployee();
    }
};

function newDepartment() {

      inquirer.prompt(dep_prompts)
        .then(answers => {
            console.log(`Now adding ${answers.new_dep}`);
            db.query(`INSERT INTO department (dep_name) VALUES ('${answers.new_dep}')`);
        }).then(() => {
            menu();
        })
};

function newRole() {
    let departmentId;

    inquirer.prompt(role_prompts)
      .then(answers => {
          console.log(`Now adding ${answers.new_role}`);
          db.query(`INSERT INTO roles (dep_name) VALUES ('${answers.new_role}')`);
          db.query(`INSERT INTO roles (salary) VALUES ('${answers.salary}')`);
          
          if (answers.department === 'Manager') {
            departmentId = 1;
          }else if(answers.department === 'Communications') {
            departmentId = 2;
          } else if(answers.department === 'Management') {
            departmentId = 3;
          } 

          db.query(`INSERT INTO roles (deparment_id) VALUES (${departmentId})`);

      }).then(() => {
          menu();
      })
};


// .then((answer) => {
// console.log(`Adding ${answer.new_dep}...`)
// db.query(`INSERT INTO department (dep_name) VALUES ("${answer.new_dep}")`);
// }).then(() => {

// db.query('SELECT * FROM department', (err, data) => {
//     if (err) return console.log(err);

//     return console.table(data);
// })
// })



// menu();


// newDepartment();
// welcome();
menu()