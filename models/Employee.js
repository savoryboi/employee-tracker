const { DataTypes, Model} = require('sequelize');

class Employee extends Model { }

Employee.init({
    first_name: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    last_name: {
        type: DataTypes.STRING, 
        allowNull: false
    },
}, 
{
    sequelize: require('../db/connection'), 
    modelName: 'employee'
}
); 


module.exports = Employee;