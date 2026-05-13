const express = require('express');
const router = express.Router();
const bossesController = require('../controllers/bossesController');


router.get('/', bossesController.getHomepage);

router.get('/bosses', bossesController.getBoss);

router.get('/bosses/:id', bossesController.getBossById);

router.post('/bosses', bossesController.addBoss);

router.put('/bosses/:id', bossesController.updateBoss);

router.delete('/bosses/:id', bossesController.deleteBoss);





module.exports = router;