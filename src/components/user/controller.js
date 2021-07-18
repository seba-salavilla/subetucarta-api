const { Logger } = require('../../../config')
const params = require('./params')
const Model = require('./models/model');

class Controller{
    constructor(){

    }

    /**
     * GET PROFILE USER
     */
    static async getProfileUser(req, res){
        try {
            const user = await Model.findUserByID(req.user._id, { password : 0 })
            res.json({success: true, status: 200, message: 'Perfil del usuario', payload:user })
        } catch (err) {
            Logger.fatal(`${Controller.getProfileUser.name} : error in catch `, err)
            res.status(500).send({success:false, message:`Error en los servicios`, comp: params.component, hdl:req.opCode})
        }
    }

    /**
     * GET ALL BUILDINGS OF USER
     * Restricción: El usuario debe pertenecer a los condominios
     */
    static async getUserBuildings(req, res){
        try {
            console.log(req.user)
            const result = await Model.findUserBuildings(req.user._id, { display_name: 1, _id: 1, users:1, picture: 1 })
            if(result.error){
                throw new ExceptionUsuario(result.error) 
            }
            res.json({success: true, status: 200, message: 'Lista de condominios del usuario.', payload:result})
        } catch (err) {
            Logger.fatal(`${Controller.getUserBuildings.name} : error in catch `, err)
            res.status(500).send({success:false, message:`Error en los servicios`, comp: params.component, hdl:req.opCode})
        }
        
    }

    /**
     * Obtiene información de un condominio del usuario
     * Restricción: El usuario debe pertenecer al condominio
     */
    static async getOneBuildingUser(req, res){
        try {
            const { id_building } = req.bodyParser
            //OBTIENE CONDOMINIO DEL USUARIO
            const result = await Model.findOneBuildingUser(id_building, req.user._id)
            if(!result){
                return res.status(400).send({success: false, status: 400, message: 'No tienes acceso al condominio', payload:false})
            }
            if(result.error){
                throw new ExceptionUsuario(result.error) 
            }
            res.json({success: true, status: 200, message: 'Condominio del usuario.', payload:result})
        } catch (err) {
            Logger.fatal(`${Controller.getOneBuildingUser.name} : error in catch `, err)
            res.status(500).send({success:false, message:`Error en los servicios`, comp: params.component, hdl:req.opCode})
        }
        
    }

    /**
     * Asigna nuevo condominio favorito a usuario
     * Restricción: El usuario debe pertenecer al condominio ¡POR IMPLEMENTAR!
     */
    static async setUserFavoriteBuilding(req, res){
        try {
            const { id_building } = req.bodyParser
            const result = await Model.updateUserFavoriteBuilding(req.user._id, id_building)
            
            if(result.error){
                throw new ExceptionUsuario(result.error) 
            }

            if(!result.matchedCount){
                return res.status(400).send({success: false, status: 400, message: 'Error no se pudo actualizar el condominio.', payload:false})
            }
            
            res.json({success: true, status: 200, message: 'Condominio favorito actualizado'})
        } catch (err) {
            Logger.fatal(`${Controller.setUserFavoriteBuilding.name} : error in catch `, err)
            res.status(500).send({success:false, message:`Error en los servicios`, comp: params.component, hdl:req.opCode})
        }
    }

    /**
     * Abandona usuario del condominio
     * Restricción: El usuario debe pertenecer al condominio
     */
    static async leaveUserFromBuilding(req, res){
        try {
            const { id_building } = req.bodyParser
            const result = await Model.pullUserFromBuilding(req.user._id, id_building)
            console.log(result)
            if(result.error){
                throw new ExceptionUsuario(result.error) 
            }

            if(!result.matchedCount){
                return res.status(400).send({success: false, status: 400, message: 'Error no tienes acceso al condominio.', payload:false})
            }
            
            res.json({success: true, status: 200, message: 'Has abandonado el condominio correctamente.'})
        } catch (err) {
            Logger.fatal(`${Controller.leaveUserFromBuilding.name} : error in catch `, err)
            res.status(500).send({success:false, message:`Error en los servicios`, comp: params.component, hdl:req.opCode})
        }
    }
}

function ExceptionUsuario(mensaje) {
    this.mensaje = mensaje;
    this.nombre = "ExceptionUsuario";
 }

module.exports = Controller;