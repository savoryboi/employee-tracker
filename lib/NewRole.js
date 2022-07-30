const db = require('../db/connection');
const inquirer = require('inquirer');


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

function newRole() {
    // Update choices in prompt array with all departments in DB
    db.query('SELECT * FROM department', (err, data) => {
        for (let i = 0; i < data.length; i++) {
            role_prompts[2].choices[i] = data[i].dep_name;
        }
    })

    inquirer.prompt(role_prompts)
        .then(answers => {
            console.log(`Now adding ${answers.new_role} to ${answers.department}`);

            // Find the corresponding db department Id and assign to new role
            let dep_id;
            db.query('SELECT * FROM department', (err, data) => {

                for (let i = 0; i < data.length; i++) {
                    // console.log(chosenDepartment, data[i].dep_name)
                    if (data[i].dep_name == answers.department) {
                        dep_id = data[i].id;
                    }
                }
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.new_role}', ${answers.salary}, ${dep_id})`)
            });

        })
  
};

module.exports = newRole;