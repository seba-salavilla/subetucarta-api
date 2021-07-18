const { Logger } = require('../../config')

function validate (route, params, scheme) {
    return (req, res, next) =>{
        Logger.info(`${params.acronym}:${route.handler}:${route.code} : ${route.desc}`)
        req.opCode = route.code
        req.bodyParser = {}
        if(scheme){
            const data = req.method === 'POST' ? req.body : {...req.body, ...req.params, ...req.query}
            const { error, value } = scheme.validate(data)
            if(error){
                Logger.error("Invalid data scheme ", error.details)
                return res.status(400).send({success:false, status:400, message:`Error data validation.`, payload: error.details})
            }
            req.bodyParser = value
        }

        
        return next()
    }
}

function getIp (req, res, next) {
    var xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '');
    var ip = xForwardedFor || req.connection.remoteAddress;
    if (ip.includes('::ffff:')) {
        ip = ip.split(':').reverse()[0]
    }
    if ((ip === '127.0.0.1' || ip === '::1')) {
        return "Localhost" // {error:"This won't work on localhost"}
    }
    req.ipInfo = ip;
    next();
}

module.exports = { validate, getIp }