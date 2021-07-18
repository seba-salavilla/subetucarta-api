// express config
const express = require( 'express');
const Mongo = require('./mongo')
const cors = require( 'cors');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const upload = multer({
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
            return callback(new Error('Error en la extensión del archivo.'))
        }
        callback(null, true)
    }
});
//const cookieParser = require( 'cookie-parser');
const { GLOBAL, LoggerMiddle, Logger } = require('../config')
const { PrivateRouter, PublicRouter } = require('./routes')
require('./middlewares/passport')

/**
 * Create Express server.
 */
const app = express();

app
.disable('etag')
.disable('x-powered-by')
//.use(cookieParser())
.use('*', cors())
.use(LoggerMiddle)
.use(express.static(__dirname + '/public'))
.use(express.json({ limit: '16mb' }))
.use(express.urlencoded({extended: false }))
.use(express.urlencoded({extended: true }))
.use(upload.single("archivo"))
.use(passport.initialize())
.use(GLOBAL.BASE_URL_PUB, PublicRouter)
.use(GLOBAL.BASE_URL_PRIV, passport.authenticate('jwt', { session: false }), PrivateRouter)
/*.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname,'/static/index.html'));
})*/
.use('*', function(req, res){
    res.status(404).json({
        success: false,
        status: 404,
        message:"Ruta no encontrada"
    })
})
// error handler
.use(function(err, req, res, next) {
    Logger.fatal(err)
    res.status(err.status || 500)
    res.json({success:false, message: err.message || `Error inesperado`});
});

Mongo.connect( res => {
    if(res){
        app.listen(GLOBAL.PORT, () => {
            Logger.info('server started on port ' + GLOBAL.PORT);
        });
    }
})
/*app.listen(config.PORT, () => {
    Logger.info('server started on port ' + config.PORT);
});*/



