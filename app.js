const db = require('./db/connection');
const inquirer = require('inquirer');

const nav_menu = [
    {
        type: 'list',
        name: 'nav',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role']
    }
]

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
        })


};

function selectedOption(choice) {
    if (choice.nav === 'View All Employees') {

        db.query('SELECT * FROM employee', (err, data) => {
            if (err) return console.log(err);

            return console.log(data);
        });
    };

   if (choice.nav === 'View All Departments') {

        db.query('SELECT * FROM department', (err, data) => {
            if (err) return console.log(err);

            return console.log(data);
        });
    };

   if(choice.nav === 'View All Roles'){

        db.query('SELECT * FROM roles', (err, data) => {
            if (err) return console.log(err);
    
            return console.log(data);
        });
    };
}


welcome();
