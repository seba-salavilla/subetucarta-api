const { GLOBAL, Logger } = require('../../../config')
const params = require('./params')
const passport = require('passport');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt')
const Model = require('./models/model');

class Controller{
    constructor(){
    }

    /**
     * REGISTER USER
     * Este controlador registra nuevos usuarios y valida situaciones cuando el usuario existe
     * y son creados manualmente o por ingresar con redes sociales.
     * 
     * Lógica aplicada en los casos de validaciones:
     * 1) El usuario existe y contiene contraseña: Esta situación ocurre cuando el usuario
     * es creado con registro manual, por lo tanto retorna usuario en uso.
     * 
     * 2) El usuario existe y no contiene contraseña: Esta situación ocurre cuando el usuario
     * es creado al logear con redes sociales. Para este caso se actualiza la contraseña
     * y retorna usuario creado con exito.
     * 
     * 3) El usuario no existe: Crea nuevo usuario y retorna usuario creado con exito
     */
    static async signup(req, res){
        try {
            const body = req.bodyParser
            body.password = await bcrypt.hash(body.password, 10);
            //Busca usuario en bd
            const user = await Model.findUserByEmail(body.email)

            //Valida si hay error en bd
            if(user && user.error){
                Logger.error(`${Controller.signup.name} : mongo error `, user.error)
                return res.status(500).send({success:false, status:500, message:`En este momento no podemos procesar la solicitud.`, payload:{comp: params.component, hdl:req.opCode}})
            }

            //Si usuario no existe, crea el usuario
            if(!user){
                const result = await Model.insertUser(body);
                if(result.error || !result.insertedId){
                    Logger.error(`${Controller.signup.name} : mongo error `, result.error)
                    return res.status(500).send({success:false, status:500, message:`En este momento no podemos procesar la solicitud.`, payload:{comp: params.component, hdl:req.opCode}})
                }
            }
            //Si usuario existe y no contiene contraseña, actualiza la contraseña
            else if(user && !user.password){
                await Model.updatePasswordByUser(user._id, body.password);
            }else
                return res.status(400).send({success: true, status: 400, message: 'Email already in use'});
            
            //PUNTO A MEJORAR, ENVIAR CORREO A USUARIO PARA COMPLETAR REGISTRO
            res.json({success: true, status: 200, message: 'Signup successful'});
        } catch (err) {
            Logger.fatal(`${Controller.signup.name} : error catch `, err)
            res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
        }
    }

    /**
     * LOGIN USER
     */
    static login(req, res){
        return passport.authenticate('login', async (err, user, info) => {
            try {
                if(err || !user){
                    Logger.error(`${Controller.login.name} : authenticate login `, info || err)
                    return res.status(401).send({success:false, status:401, message:`Error in authentication`, payload: info || {message:"Generic error handle."}})
                }
        
                req.login(user, { session: false }, async (error) => {
                    if (error) return res.status(401).send({success:false, message:`Error in authentication`, payload:error})

                    const token = jwt.sign({ user: { _id: user._id, email: user.email } }, GLOBAL.TOKEN_KEY);
        
                    res.json({success: true, status: 200, message: 'Login successful', payload: {token} });
                })
            } catch (err) {
                Logger.fatal(`${Controller.login.name} : error catch `, err)
                res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
            }
        })(req, res)
    }

    /**
     * GOOGLE AUTH TOKEN
     */
    static GoogleAuthWithToken(req, res) { 
        return passport.authenticate(
            'google-verify-token', { session: false }, (err, user, info) => {
                try {
                    console.log(err, user, info)
                    if(err || !user){
                        Logger.error(`${Controller.GoogleAuthWithToken.name} : authenticate google login `, info || err)
                        return res.status(401).send({success:false, status:401, message:`Error google authentication `, payload: info || {message:"Generic handle error."}})
                    }
    
                    const token = jwt.sign({ user: { _id: user._id, email: user.email } }, GLOBAL.TOKEN_KEY);
                    res.json({success: true, status: 200, message: 'Login successful', payload: {token} });
                } catch (err) {
                    Logger.fatal(`${Controller.GoogleAuthWithToken.name} : error catch `, err)
                    res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
                }
            }
        )(req, res)
    }
    /**
     * FACEBOOK AUTH TOKEN
     * https://github.com/drudge/passport-facebook-token/issues/62
     */
    static FBAuthWithToken (req, res) { 
        return passport.authenticate(
            'facebook-token', { session: false }, (err, user, info) => {
                try {
                    console.log(err, user, info)
                    if(err || !user){
                        Logger.error(`${Controller.FBAuthWithToken.name} : authenticate fb login `, info || err)
                        return res.status(401).send({success:false, status:401, message:`Error Facebook authentication `, payload: info || {message:"Generic handle error."}})
                    }
    
                    const token = jwt.sign({ user: { _id: user._id, email: user.email } }, GLOBAL.TOKEN_KEY);
                    res.json({success: true, status: 200, message: 'Login successful', payload: {token} });
                } catch (err) {
                    Logger.fatal(`${Controller.FBAuthWithToken.name} : error catch `, err)
                    res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
                }
            }
        )(req, res)
    }

    /**
     * GOOGLE AUTH
     */
    static googleAuth(req, res){
        return passport.authenticate('google', {
            session: false,
            scope: ["profile", "email"],
            accessType: "offline",
            approvalPrompt: "force"
        },() =>{

        })(req, res)
    }

    /**
     * GOOGLE AUTH
     */
    static googleAuthRedirect(req, res){
        try {
            console.log('googleAuthRedirect', req.user)
            const token = jwt.sign({ user: { _id: req.user._id, email: req.user.email } }, GLOBAL.TOKEN_KEY);
            res.json({success: true, status: 200, message: 'Login google successful', payload: {token} });
        } catch (err) {
            Logger.fatal(`${Controller.googleAuthRedirect.name} : error catch `, err)
            res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
        }
    }
}

module.exports = Controller;