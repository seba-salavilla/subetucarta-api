const { Logger } = require('../../../config')
const params = require('./params')
const Model = require('./models/model')
var QRCode = require('qrcode')

class Controller{

    static async registroRestaurante(req, res){
        try {
            if(!req.file) return res.json({success: false, status: 200, message: 'Debes subir un archivo en formato PDF o de imagen.', payload: false });
            
            const data = req.bodyParser;
            const existe = await Model.getRestaurantByEmail(data.email);
            if(existe){
                return res.json({success: true, status: 200, message: 'Para actualizar tus datos contactar a clientes@subetucarta.cl.', payload: existe.QR });
            }

            const file = {
                originalname: req.file.originalname,
                encoding: req.file.encoding,
                mimetype: req.file.mimetype,
                base64: req.file.buffer.toString('base64')
            }
            // Registra nuevo restaurant
            const result = await Model.newRestaurant(data, file);
            if(result.error){
                throw Error("Error en crear nuevo restaurant")
            }

            // Genera nuevo QR
            const QR = await QRCode.toDataURL(process.env.URL_CARTA+result.insertedId);
            const updt = await Model.addQRToRestaurant(result.insertedId, QR);

            if(!updt || updt.error) throw Error("Error al actualizar QR restaurant.");

            return res.json({
                success: true, 
                status: 200, 
                message: 'Este es tu código QR, escanealo y revisa tu carta.', 
                payload : QR
            });
        } catch (err) {
            Logger.fatal(`${Controller.registroRestaurante.name} : error catch `, err)
            res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
        }
    }

    static async obtenerMenuRestaurantID(req, res){
        try {
            const body = req.bodyParser
            const result = await Model.getRestaurantByID(body.id)
            if(!result){
                return res.json({success: false,status: 400, message: 'Sin información.', payload: false});
            }

            if(result.file.mimetype === 'application/pdf'){
                return res.send('<div style="text-align:center"><iframe src="https://docs.google.com/viewer?url='+process.env.URL_PDF+body.id+'&embedded=true" frameborder="0" height="100%" width="100%" style="border: none;"></iframe></div>')
            }else{
                var file = Buffer.from(result.file.base64, 'base64');
                res.writeHead(200, {
                    'Content-Type': result.file.mimetype,
                    'Content-Length': file.length
                });
                return res.end(file);
            }
            
            /*return res.json({
                success: true, 
                status: 200, 
                message: 'Restaurant encontrado.', 
                payload: result
            });*/
        } catch (err) {
            Logger.fatal(`${Controller.obtenerMenuRestaurantID.name} : error catch `, err)
            res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
        }
    }

    static async obtenerPDFMenuRestaurantID(req, res){
        try {
            const body = req.bodyParser
            const result = await Model.getRestaurantByID(body.id)
            if(!result){
                return res.json({success: false,status: 400, message: 'Sin información.', payload: false});
            }
            var file = Buffer.from(result.file.base64, 'base64');
            
            res.writeHead(200, {
                'Content-Type': result.file.mimetype,
                'Content-Length': file.length
            });

            res.end(file);
        } catch (err) {
            Logger.fatal(`${Controller.obtenerMenuRestaurantID.name} : error catch `, err)
            res.status(500).send({success:false, status:500, message:`Error en los servicios.`, payload:{comp: params.component, hdl:req.opCode}})
        }
    }

}

module.exports = Controller;