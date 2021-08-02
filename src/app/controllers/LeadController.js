const { Lead, Plan, User } = require('../models');
const fs = require('fs');
const path = require('path');
const { CEPSearch } = require('../utils/CEPValidator');

module.exports = {
  async uploadLeadPhoto(req, res) {
    const { id } = req.params;

    try {
      const lead = await Lead.findByPk(id);

      if (!lead) {
        return res.status(404).json({
          message: 'lead not found',
        });
      }

      if (lead.photo_url) {
        fs.unlinkSync(`${__dirname}/../../uploads/${lead.photo_url}`);
      }

      await Lead.update(
        { photo_url: req.file ? req.file.filename : '' },
        {
          where: { id },
        },
      );

      return res.status(200).send();
    } catch (error) {
      if (error.message) {
        return res.status(500).json({
          message: error.message,
        });
      }

      return res.status(500).send(error);
    }
  },

  async getLeadPhoto(req, res) {
    const { id } = req.params;

    try {
      const lead = await Lead.findByPk(id);

      if (!lead) {
        return res.status(404).json({
          message: 'lead not found',
        });
      }

      if (!lead.photo_url) {
        return res.status(404).json({
          message: 'lead without photo',
        });
      }

      return res
        .status(200)
        .sendFile(
          path.join(`${__dirname}/../../uploads/${lead.photo_url}`),
        );
    } catch (error) {
      if (error.message) {
        return res.status(500).json({
          message: error.message,
        });
      }

      return res.status(500).send(error);
    }
  },

  async store(req, res) {
    const { plan_id, user_id, name, cpf, cep } = req.body;
    let { address } = req.body;

    if (!plan_id || !user_id || !name || !cpf) {
      return res.status(400).json({
        message: 'plan_id, user_id, name and cpf are required',
      });
    }

    try {
      const plan = await Plan.findByPk(plan_id);

      if (!plan) {
        return res.status(400).json({
          message: 'Invalid plan',
        });
      }

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).json({
          message: 'Invalid user',
        });
      }

      if (cep) {
        const cepResult = await CEPSearch(cep);

        if (cepResult && cepResult.cep) {
          if (!address) {
            address = `${cepResult.logradouro}, ${cepResult.bairro} - ${cepResult.localidade}/${cepResult.uf}`;
          }
        }
      }

      const lead = await Lead.create({
        plan_id,
        user_id,
        name,
        cpf,
        cep,
        address,
      });

      return res.status(201).json(lead);
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
      const leads = await Lead.findAll({
        include: [
          {
            association: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            association: 'plan',
            attributes: ['id', 'name'],
          },
        ],
        order: [['id', 'ASC']],
      });

      if (!leads || leads.length === 0) {
        return res.status(404).json({ message: 'no lead found' });
      }

      return res.status(200).json(leads);
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

      const lead = await Lead.findByPk(id, {
        include: [
          {
            association: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            association: 'plan',
            attributes: ['id', 'name'],
          },
        ],
      });

      if (!lead) {
        return res.status(404).json({ message: 'lead not found' });
      }

      return res.status(200).json(lead);
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

      const { plan_id, user_id, name, cpf, cep, address } = req.body;

      if (!plan_id && !user_id && !name && !cpf && !cep && !address) {
        return res.status(400).json({
          message:
            'it is required at least one valid property to update',
        });
      }

      if (plan_id) {
        const plan = await Plan.findByPk(plan_id);

        if (!plan) {
          return res.status(404).json({
            message: 'plan not found',
          });
        }
      }

      if (user_id) {
        const user = await User.findByPk(user_id);

        if (!user) {
          return res.status(404).json({
            message: 'user not found',
          });
        }
      }

      const isUpdated = await Lead.update(
        { plan_id, user_id, name, cpf, cep, address },
        {
          where: { id },
        },
      );

      if (!isUpdated || isUpdated[0] === 0) {
        return res.status(404).json({ message: 'lead not found' });
      }

      const updatedLead = await Lead.findByPk(id, {
        include: [
          {
            association: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            association: 'plan',
            attributes: ['id', 'name'],
          },
        ],
      });

      return res.status(200).json(updatedLead);
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

      const lead = await Lead.findByPk(id);

      if (!lead) {
        return res.status(404).json({ message: 'lead not found' });
      }

      await Lead.destroy({
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
