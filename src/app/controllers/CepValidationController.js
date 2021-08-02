const { CEPSearch } = require('../utils/CEPValidator');

module.exports = {
  async validateCEP(req, res) {
    const { cep } = req.body;

    try {
      const result = await CEPSearch(cep);

      if (result) {
        return res.status(200).json(result);
      }

      return res.status(400).json({
        message: 'Invalid CEP',
      });
    } catch (error) {
      if (error.message) {
        return res.status(500).json({
          message: error.message,
        });
      }

      return res.status(500).send(error);
    }
  },
};
