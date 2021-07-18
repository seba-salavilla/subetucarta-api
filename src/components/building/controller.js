const { Logger } = require('../../../config')
const params = require('./params')
const Model = require('./models/model')
const UserModel = require('../user/models/model')

const GoogleServices = require('../../providers/GoogleServices')


class Controller{

    /**
     * USER CREATE NEW BUILDING
     */
    static async save(req, res){
        try {
            const body = req.bodyParser
            const geoAddress = await GoogleServices.AddressVerify(body.st_name, body.st_num, body.locality, body.city, body.country)
            if(geoAddress.error){
                return res.status(400).json({success: false, status: 400, message: 'Error al crear condominio', payload:geoAddress});
            }

            //OBTIENE CONDOMINIO PARA VERIFICAR SI YA FUE CREADO
            const placeID = await Model.getBuildingByPlaceID(geoAddress.place_id)
            if(placeID && placeID.error){
                throw new ExceptionUsuario(placeID.error) 
            }

            //CONDOMINIO YA EXISTE
            if(placeID){
                return res.json({
                    success: false, 
                    status: 200, 
                    message: 'Lo sentimos, el condominio ya existe', 
                    payload:{
                        id:placeID._id
                    }
                });
            }

            //GUARDA CONDOMINIO
            const result = await Model.insertBuilding(body.display_name, body.type_building, geoAddress, req.user)
            //VERIFICA ERROR EN LA INSERCIÓN
            if(result && (result.error || !result.insertedId)){
                throw new ExceptionUsuario(placeID.error || 'Error en la inserción del condominio')
            }

            //ASIGNA NUEVO CONDOMINIO FAVORITO A USUARIO EN CASO DE NO TENER
            /*if(!req.user.id_fav_build){
                console.log("result.insertedId", typeof result.insertedId)
                UserModel.updateUserFavoriteBuilding(req.user._id, result.insertedId)
            }*/

            return res.json({
                success: true, 
                status: 200, 
                message: 'Condominio creado con exito', 
                payload:{
                    id:result.insertedId
                }
            });
        } catch (err) {
            Logger.fatal(`${Controller.save.name} : error catch `, err)
            res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
        }
    }

    /**
     * Busca Condominios por filtros
     * Usado en formulario de busqueda de condominios
     */
    static async searchBuilding(req, res){
        try {
            const body = req.bodyParser
            
            const result = await Model.findBuildingsByFilter(body)
            return res.json({
                success: true, 
                status: 200, 
                message: 'Condominios obtenidos con exito', 
                payload:result
            });
        } catch (err) {
            Logger.fatal(`${Controller.searchBuilding.name} : error catch `, err)
            res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
        }
    }

}

function ExceptionUsuario(mensaje) {
    this.mensaje = mensaje;
    this.nombre = "ExceptionUsuario";
 }

module.exports = Controller;