'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10,
    );

    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'mk',
          email: 'user@mk.com',
          password_hash: passwordHash,
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
