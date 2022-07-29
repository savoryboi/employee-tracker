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
        message: 'New role salary (in thousands):'
    },
    {
        name: 'department',
        type: 'list',
        message: 'Department of new role:',
        choices: ['Sales', 'Communications', 'Management', 'Engineering']
    }
];



const emp_prompts = [
    {
        name: 'first_name',
        type: 'input',
        message: 'Employee first name:'
    },
    {
        name: 'last_name',
        type: 'input',
        message: 'Employee last name:'
    },
    {
        name: 'role',
        type: 'list',
        message: 'Employee role:', 
        choices: ['Manager', 'Supervisor', 'Comm Lead', 'Salesperson']
    },
    {
        name: 'manager',
        type: 'input',
        message: 'Manager (if applicable):'
    },
]


function menu() {
    inquirer.prompt(nav_menu)
        .then(choice => {
            selectedOption(choice)
        });
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

            console.table(data);
            backToMenu();
        });
    };

    if (choice.nav === 'View All Departments') {

        db.query('SELECT * FROM department', (err, data) => {
            if (err) return console.table(err);

            console.table(data);
            backToMenu();
        })
    };

    if (choice.nav === 'View All Roles') {

        db.query('SELECT * FROM roles', (err, data) => {
            if (err) return console.log(err);

            console.table(data);
            backToMenu();

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

            if (answers.department === 'Sales') {
                departmentId = 1;
            } else if (answers.department === 'Communications') {
                departmentId = 2;
            } else if (answers.department === 'Management') {
                departmentId = 3;
            } else if (answers.department === 'Engineering') {
                departmentId = 4;
            };

            db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.new_role}', ${answers.salary}.000, ${departmentId})`)
        }).then(() => {
            menu();
        })
};

// first_name, last_name, role, and manager
function newEmployee() {

    inquirer.prompt(emp_prompts)
        .then(answers => {
            console.log(`Now Adding ${answers.first_name}`)

            if (answers.role === 'Manager') {
                roleId = 1;
            } else if (answers.role === 'Supervisor') {
                roleId = 2;
            } else if (answers.role === 'Comm Lead') {
                roleId = 3;
            } else if (answers.role === 'Sales'){
                roleId = 4;
            };

            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager) VALUES ('${answers.first_name}', '${answers.last_name}', ${roleId}, '${answers.manager}')`);
        }).then(() => {
            menu();
        })
}



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