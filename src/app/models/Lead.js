module.exports = (sequelize, DataTypes) => {
  const Lead = sequelize.define(
    'Lead',
    {
      plan_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      cpf: DataTypes.STRING,
      cep: DataTypes.STRING,
      address: DataTypes.STRING,
      photo_url: DataTypes.STRING,
    },
    {
      tableName: 'leads',
    },
  );

  Lead.associate = (models) => {
    Lead.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Lead.belongsTo(models.Plan, {
      foreignKey: 'plan_id',
      as: 'plan',
    });
  };

  return Lead;
};
