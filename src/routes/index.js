const { GLOBAL, Logger } = require('../../config')
const PrivateRouter = require('express').Router()
const PublicRouter = require('express').Router()
const { validate } = require('../middlewares/routeMiddleware')

/**
 * LOAD ROUTES COMPONENTS
 */
const components = require('./components')
components.forEach( com => {
    Logger.info(`Load Component: ${com}`, )
    const params = require(`../components/${com}/params`)
    const routes = require(`../components/${com}/routes`)
    const controller = require(`../components/${com}/controller`)
    var scheme = {}
    try {
        scheme = require(`../components/${com}/models/scheme`)
    } catch (err) {
        console.log(err)
        Logger.warn(`Can't load scheme for component ${com}`);
        process.exit(0)
    }
    

    routes.forEach( rt => {
        const url = `${params.endpoint+rt.path}`
        const handler = controller[rt.handler]
        const schemeValidate = typeof scheme[rt.schemeProperty] === 'object' ? scheme[rt.schemeProperty] : false
        if(rt.disable)
            Logger.warn(`route ${url} disabled`);
        else if(typeof handler !== 'function')
            Logger.warn(`Can't load handler ${rt.handler} of controller ${com}`);
        else{
            if(rt.auth){
                Logger.info(`Route: ${GLOBAL.BASE_URL_PRIV}${url} - Handler ${rt.handler}`, )
                PrivateRouter[rt.type](url, validate(rt, params, schemeValidate), handler)
            }else{
                Logger.info(`Route: ${GLOBAL.BASE_URL_PUB}${url} - Handler ${rt.handler}`, )
                PublicRouter[rt.type](url, validate(rt, params, schemeValidate), handler)
            }
        }
        
    });
})


/**
 * LOAD AUTH ROUTES
 */

/*const authRoute = require('../components/auth/routes')
const authController = require('../components/auth/controller')
const authScheme = require('../components/auth/models/scheme')
const params = require('../components/auth/params')*/

/*authRoute.routes.forEach( rt => {
    const url = `/${name+rt.path}`
    Logger.info(`Load route: ${rt.type.toUpperCase()} /auth${url} - controller handler ${rt.handler}`, )
    const handler = authController[rt.handler]
    rt.name = name
    if(rt.disable)
        Logger.warn(`route /${name+rt.path} disabled`);
    else if(typeof handler !== 'function')
        Logger.warn(`Can't load handler ${rt.handler} of controller ${com}`);
    else if (authScheme == false || !rt.scheme)
        Logger.warn(`Auth Component required schemes ${rt.handler} of controller ${com}`);
    else
    AuthRouter[rt.type](url, RouteParams.bind(rt), ValidScheme.bind(authScheme), handler)
        
    
});*/
/*authRoute.routes.forEach( rt => {
    const url = `${params.endpoint+rt.path}`
    Logger.info(`Load Route: ${rt.type.toUpperCase()} /auth${url} - controller handler ${rt.handler || 'no handler'}`, )
    const handler = authController[rt.handler]
    switch (rt.code) {
        case '001': //REGISTER USER
        case '002': //LOGIN USER
            AuthRouter[rt.type](url, 
                RouteParams.bind(rt, params), 
                ValidScheme.bind(authScheme), handler)
            break;
        case '003': //GOOGLE OAUTH2
            AuthRouter[rt.type](url, 
                RouteParams.bind(rt, params), 
                passport.authenticate("google", {scope: ["profile", "email"] })
            );
            break;
        case '004': //GOOGLE AUTH REDIRECT
            AuthRouter[rt.type](url,
                RouteParams.bind(rt, params),
                passport.authenticate('google', { session: false }),
                handler
            );
            break;
        case '005': //GOOGLE AUTH TOKEN
            AuthRouter[rt.type](url,
                RouteParams.bind(rt, params),
                ValidScheme.bind(authScheme),
                //passport.authenticate('google-verify-token', { session: false }),
                handler
            );
            break;
        case '006': //FACEBOOK AUTH TOKEN
            AuthRouter[rt.type](url,
                RouteParams.bind(rt, params),
                ValidScheme.bind(authScheme),
                //passport.authenticate('facebook-token', { session: false }),
                handler
            );
        break;
        default:
            break;
    }
})*/


module.exports = { PrivateRouter, PublicRouter };