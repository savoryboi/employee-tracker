const db = require('../db/connection');


function Departments() {
    db.query('SELECT * FROM department', (err, data) => {
        if (err) return console.log(err);

        let allDepartments =[];

        for(let i = 0; i < data.length; i++) {
            allDepartments.push(data[i])
        }
        

        return allDepartments;
    });
};



module.exports = Departments;