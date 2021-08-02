const Correios = require('node-correios');

const correios = new Correios();

module.exports = {
  CEPSearch: async (cep) => {
    const result = await correios.consultaCEP({ cep: String(cep) });

    return result;
  },
};
