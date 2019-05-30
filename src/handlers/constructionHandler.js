const constructionModel = require('../models/construction');

const getConstructions = async () => {
  const result = await constructionModel.getConstructions();
  return {
    ok: true,
    data: result.map(item => item.construction_name)
  };
}

const constructionHandler = {
  getConstructions
};

module.exports = constructionHandler;