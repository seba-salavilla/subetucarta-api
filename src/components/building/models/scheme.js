const Joi = require('joi');

const newBuilding = Joi.object({
    display_name : Joi.string().trim().min(5).required(),
    type_building: Joi.number().valid(0, 1).required(), //0:departamentos 1:casas
    st_name : Joi.string().trim().required(),
    st_num  : Joi.string().trim().required(),
    locality: Joi.string().trim().required(),
    city    : Joi.string().trim().required(),
    country : Joi.string().trim().required()
})

const searchBuilding = Joi.object({
    display_name : Joi.string().allow('').trim().min(5),
    st_name : Joi.string().when('display_name', { is: Joi.string(), then: Joi.optional().allow(''), otherwise: Joi.required() }),
    st_num  : Joi.string().trim().allow(''),
    locality: Joi.string().trim().allow(''),
    city    : Joi.string().trim().allow(''),
    country : Joi.string().trim().allow('')
})

module.exports = {
    newBuilding,
    searchBuilding
}
