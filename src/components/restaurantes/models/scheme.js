const Joi = require('joi');

const validRegistroRestaurant = Joi.object({
    nombre      : Joi.string().trim().required(),
    email       : Joi.string().trim().lowercase().email().required(),
    direccion   : Joi.string().trim().required()
})

const validObtenerRestaurantID = Joi.object({
    id      : Joi.string().required()
})

module.exports = {
    validRegistroRestaurant,
    validObtenerRestaurantID
}
