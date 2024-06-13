const { Router } = require('express')
const router = Router()
const logger = require('../utils/logger');

router.get('/loggerTest', (req, res) => {
    logger.debug('Este es un mensaje de debug');
    logger.http('Este es un mensaje http');
    logger.info('Este es un mensaje de info');
    logger.warn('Este es un mensaje de warning');
    logger.error('Este es un mensaje de error');
    logger.fatal('Este es un mensaje de fatal');

    res.send('Logs generados');
});

module.exports = router;
