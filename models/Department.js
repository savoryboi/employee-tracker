const { DataTypes, Model } = require('sequelize');
const Role = require('./Role');

class Department extends Model { }

Department.init({
    dep_name: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    }, {
    // Other model options go here
    sequelize: require('../db/connection'), // We need to pass the connection instance
    modelName: 'department' // We need to choose the model name
});

Department.hasMany(Role);
Role.belongsTo(Department);

module.exports = Department;