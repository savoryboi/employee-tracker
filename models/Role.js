const { DataTypes, Model } = require('sequelize');
const Employee = require('./Employee');

class Role extends Model {};

Role.init({
    title: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    salary: {
        type: DataTypes.INTEGER, 
        defaultValue: null
    }
}, 
{
    sequelize: require('../db/connection'), 
    modelName: 'role'
});

Role.hasMany(Employee)
Employee.belongsTo(Role)

module.exports = Role;