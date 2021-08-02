const routes = require('express').Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/uploads`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.params.id}-${Date.now()}${path.extname(
        file.originalname,
      )}`,
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Please upload an image.'));
    }

    cb(null, true);
  },
});

const authMiddleware = require('./app/middleware/auth');

const SessionController = require('./app/controllers/SessionController');
const PlanController = require('./app/controllers/PlanController');
const LeadController = require('./app/controllers/LeadController');
const CepValidationController = require('./app/controllers/CepValidationController');

routes.post('/login', SessionController.store);

routes.use(authMiddleware);

routes.patch(
  '/leads/:id/photo',
  upload.single('image'),
  LeadController.uploadLeadPhoto,
);
routes.get('/leads/:id/photo', LeadController.getLeadPhoto);

routes.get('/leads', LeadController.index);
routes.get('/leads/:id', LeadController.show);
routes.post('/leads', LeadController.store);
routes.put('/leads/:id', LeadController.update);
routes.delete('/leads/:id', LeadController.destroy);

routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.destroy);

routes.get('/validate-cep', CepValidationController.validateCEP);

routes.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome!',
  });
});

module.exports = routes;
