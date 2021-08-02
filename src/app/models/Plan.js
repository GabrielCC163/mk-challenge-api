module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define(
    'Plan',
    {
      name: DataTypes.STRING,
    },
    {
      tableName: 'plans',
    },
  );

  Plan.associate = (models) => {
    Plan.hasMany(models.Lead, {
      foreignKey: 'plan_id',
      as: 'leads',
    });
  };

  return Plan;
};
