const db = require('../db/connection');
const inquirer = require('inquirer');



const dep_prompts = [
    {
        name: 'new_dep',
        type: 'input',
        message: 'Enter new department name:'
    }
];


function newDepartment() {

    inquirer.prompt(dep_prompts)
        .then(answers => {
            console.log(`Now adding ${answers.new_dep}`);
            db.query(`INSERT INTO department (dep_name) VALUES ('${answers.new_dep}')`);
        })
        
};

module.exports = newDepartment;