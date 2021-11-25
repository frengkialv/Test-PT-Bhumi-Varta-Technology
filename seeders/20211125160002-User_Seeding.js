'use strict';
const fs = require('fs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = JSON.parse(fs.readFileSync("./data/data.json", "utf8"))
    data.forEach(item => {
        item.createdAt = new Date()
        item.updatedAt = new Date()
    });
    return queryInterface.bulkInsert('Users', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
