const { Plan } = require('../models');

module.exports = {
  async store(req, res) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'name is required',
      });
    }

    const planFound = await Plan.findOne({
      where: { name },
    });

    if (planFound) {
      return res.status(400).json({
        message: `plan ${planFound.name} already exists`,
      });
    }

    try {
      const plan = await Plan.create({ name });

      return res.status(201).json(plan);
    } catch (error) {
      if (error.message) {
        return res.status(500).json({
          message: error.message,
        });
      }

      return res.status(500).send(error);
    }
  },

  async index(req, res) {
    try {
      const plans = await Plan.findAll({ order: [['id', 'ASC']] });

      if (!plans || plans.length === 0) {
        return res.status(404).json({ message: 'no plan found' });
      }

      return res.status(200).json(plans);
    } catch (error) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).send(error);
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      const plan = await Plan.findByPk(id, {
        include: {
          association: 'leads',
          attributes: ['name'],
          required: false,
        },
      });

      if (!plan) {
        return res.status(404).json({ message: 'plan not found' });
      }

      return res.status(200).json(plan);
    } catch (error) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).send(error);
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          message: 'it is required name to update',
        });
      }

      const isUpdated = await Plan.update(
        { name },
        {
          where: { id },
        },
      );

      if (!isUpdated || isUpdated[0] === 0) {
        return res.status(404).json({ message: 'plan not found' });
      }

      const updatedPlan = await Plan.findByPk(id);

      return res.status(200).json(updatedPlan);
    } catch (error) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).send(error);
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;

      const plan = await Plan.findByPk(id);

      if (!plan) {
        return res.status(404).json({ message: 'plan not found' });
      }

      await Plan.destroy({
        where: { id },
      });

      return res.sendStatus(204);
    } catch (error) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).send(error);
    }
  },
};
