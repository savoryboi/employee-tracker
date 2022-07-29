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
    },
    {
        name: 'thanks',
        message: 'thanks!'
    }
];

function welcome() {
    inquirer.prompt({
        name: 'welcome',
        message: 'Welcome to the Employee Tracker!'
    });
    menu();
};

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
        newDepartment()

    };

function newDepartment() {
      inquirer.prompt(dep_prompts)
        .then(answers => {
            console.log(answers)
        })

    };
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
welcome();
