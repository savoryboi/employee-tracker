const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Departments = require('./lib/Departments');



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

    db.query('SELECT * FROM department', (err, data) => {
        for (let i = 0; i < data.length; i++) {
            role_prompts[2].choices[i] = data[i].dep_name;
        }
    })

    inquirer.prompt(role_prompts)
        .then(answers => {
            console.log(`Now adding ${answers.new_role} to ${answers.department}`);
            

            let dep_id;
            db.query('SELECT * FROM department', (err, data) => {
                let chosenDepartment = answers.department;

                for(let i = 0; i < data.length; i++) {
                    // console.log(chosenDepartment, data[i].dep_name)
                    if (data[i].dep_name == answers.department) {
                        dep_id = data[i].id;
                    } 
                }

                db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.new_role}', ${answers.salary}, ${dep_id})`)
            });
        })
        .then(() => {
            menu();
        })
};


// first_name, last_name, role, and manager
function newEmployee() {
    db.query('SELECT * FROM roles', (err, data) => {
        for (let i = 0; i < data.length; i++) {
            emp_prompts[2].choices[i] = data[i].title;
        }
    })

    inquirer.prompt(emp_prompts)
        .then(answers => {
            console.log(`Now Adding ${answers.first_name}`)

            if (answers.role === 'Manager') {
                roleId = 1;
            } else if (answers.role === 'Supervisor') {
                roleId = 2;
            } else if (answers.role === 'Comm Lead') {
                roleId = 3;
            } else if (answers.role === 'Salesperson') {
                roleId = 4;
            };

            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}', '${answers.last_name}', ${roleId}, '${answers.manager}')`);
        }).then(() => {
            menu();
        })
}

menu()