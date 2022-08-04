const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const Employee = require('./models/Employee');
const Role = require('./models/Role');
const Department = require('./models/Department');

// PROMPT ARRAYS
const nav_menu = [
    {
        type: 'list',
        name: 'nav',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role']
    }
];
const role_prompts = [
    {
        name: 'new_role',
        type: 'input',
        message: 'enter name of new role:',
    },
    {
        name: 'salary',
        type: 'input',
        message: 'input new role\'s salary:'
    },
    {
        name: 'department',
        type: 'list',
        message: 'select the department to which the new role belongs to:',
        choices: []
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
        choices: []
    },
    {
        name: 'manager',
        type: 'list',
        message: 'Manager (if applicable):',
        choices: ['N/A']
    },
];


// MAIN MENU AND BACK TO MENU FUNCTIONS FOR FLOW OF APPLICATION 
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

// This function directs to the necessary functions based on selected option from main menu
function selectedOption(choice) {
    if (choice.nav === 'View All Employees') {

        Employee.findAll()
            .then(all_employees => {
                all_employees = all_employees.map(emp => {
                    return { id: emp.id, first_name: emp.first_name, last_name: emp.last_name, roleId: emp.roleId }
                })
                console.table(all_employees)
            })
            .then(() => backToMenu());

    };

    if (choice.nav === 'View All Departments') {

        Department.findAll()
            .then(all_deps => {
                all_deps = all_deps.map(dep => {
                    return { id: dep.id, dep_name: dep.dep_name }
                })
                console.table(all_deps)
            })
            .then(() => backToMenu());
        // db.query('SELECT * FROM department', (err, data) => {
        //     if (err) return console.table(err);

        //     const dep_Table = cTable.getTable(data)
        //     console.table(dep_Table);
        //     backToMenu();
        // })
    };

    if (choice.nav === 'View All Roles') {

        Role.findAll()
            .then(roles => {
                roles = roles.map(role => {
                    return { id: role.id, title: role.title, salary: role.salary, departmentId: role.departmentId }
                })
                console.table(roles)
            })
            .then(() => backToMenu());
        // db.query('SELECT * FROM roles', (err, data) => {
        //     if (err) return console.log(err);

        //     const role_Table = cTable.getTable(data)
        //     console.table(role_Table);
        //     backToMenu();

        // });
    };

    if (choice.nav === 'Add Department') {
        inquirer.prompt(
            {
                name: 'new_dep',
                type: 'input',
                message: 'enter new department name:'
            }
        )
            .then(answer => {
                Department.create({
                    dep_name: answer.new_dep
                })
            })

            .then(() => {
                backToMenu()
            })

    };

    if (choice.nav === 'Add Role') {
        createNewRole()


    };

    if (choice.nav === 'Add Employee') {
        createNewEmployee()
    };

    if (choice.nav === 'Update Employee Role') {
        updateWhichEmployee()

    }

};


function createNewRole() {

    const findDeps = Department.findAll()
        .then(all_deps => {
            all_deps = all_deps.map(dep => {
                return { id: dep.id, dep_name: dep.dep_name }

            })
            // empty dep choices array in prompt
            role_prompts[2].choices.length = 0;

            // push updated array of departments to the prompt choices
            all_deps.forEach(department => {
                role_prompts[2].choices.push(department.dep_name)
            })
        })

    inquirer.prompt(role_prompts)
        .then(answers => {

            Department.findAll(
                {
                    where: {
                        dep_name: answers.department
                    }
                })
                .then((d) => {

                    Role.create({
                        title: answers.new_role,
                        salary: answers.salary,
                        departmentId: d[0].id
                    })



                })
        })
        .then(() => {
            console.log('added role!')
            menu()
        })

};

function createNewEmployee() {
    Role.findAll()
        .then(all_roles => {
            all_roles = all_roles.map(role => {
                return { id: role.id, title: role.title, salary: role.salary, departmentId: role.departmentId }
            })

            emp_prompts[2].choices.length = 0;

            all_roles.forEach(role => {
                emp_prompts[2].choices.push(role.title)
            })
        })

    inquirer.prompt(emp_prompts)
        .then(answers => {

            Role.findAll({
                where: {
                    title: answers.role
                }
            })
                .then(r => {
                    Employee.create({
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        roleId: r[0].id
                    })
                })
        })
        .then(() => {
            menu()
        })
};



function updateWhichEmployee() {
    Employee.findAll()
        .then(all_employees => {
            all_employees = all_employees.map(emp => {
                return `${emp.first_name}`;

            })
            inquirer.prompt({
                name: 'employee',
                type: 'list',
                message: 'select the employee you want to update:',
                choices: all_employees
            })
                .then(choice => {
                    choice = choice.employee
                    whichRole(choice)
                })
        })
};

function whichRole(chosen_employee) {
    Role.findAll()
        .then(roles => {
            roles = roles.map(role => {
                return `${role.title}`
            })
            inquirer.prompt({
                name: 'new_role',
                type: 'list',
                message: 'select their new role:',
                choices: roles
            })
                .then(chosen_role => {
                   let roleTitle = chosen_role.new_role;

                    Role.findOne({
                        where: {
                            title: roleTitle
                        }
                    }).then(roleObj => {
                        // chosen_role = roleObj;
                        updateRole(chosen_employee, roleObj);
                    })


                })
        })
};

function updateRole(chosen_employee, new_role) {
    
    Employee.update(
        {
        
            roleId: new_role.id
        },{
            where: {
                first_name: chosen_employee
            }
        }
    )
        .then(() => {
            menu()
        })
}

menu();

