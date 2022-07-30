const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Departments = require('./lib/Departments');
const newDepartment = require('./lib/NewDepartment');
const newRole = require('./lib/NewRole');
const newEmployee = require('./lib/NewEmployee');


const nav_menu = [
    {
        type: 'list',
        name: 'nav',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role']
    }
];

function menu() {
    inquirer.prompt(nav_menu)
        .then(choice => {
            selectedOption(choice)
        })
};

function backToMenu() {
    inquirer.prompt({
        name: 'back',
        message: 'press enter for main menu'
    }).then(answer => {
        menu();
    })
}

function selectedOption(choice) {
    if (choice.nav === 'View All Employees') {

        db.query('SELECT * FROM employee', (err, data) => {
            if (err) return console.log(err);

            const emp_Table = cTable.getTable(data);

            console.table(emp_Table)
            backToMenu();
        });
    };

    if (choice.nav === 'View All Departments') {

        db.query('SELECT * FROM department', (err, data) => {
            if (err) return console.table(err);

            const dep_Table = cTable.getTable(data)
            console.table(dep_Table);
            backToMenu();
        })
    };

    if (choice.nav === 'View All Roles') {
        db.query('SELECT * FROM roles', (err, data) => {
            if (err) return console.log(err);

            const role_Table = cTable.getTable(data)
            console.table(role_Table);
            backToMenu();

        });
    };

    if (choice.nav === 'Add Department') {
        newDepartment()
         
    };

    if (choice.nav === 'Add Role') {
        newRole() 
       
    };

    if (choice.nav === 'Add Employee') {
        newEmployee()

};
}


menu();
