const Joi = require('joi');

const newUser = Joi.object({
    name        : Joi.string().min(1).max(50).required(),
    second_name : Joi.string().min(1).max(50).required(),
    email       : Joi.string().email({ minDomainSegments: 2 }).required(),
    password    : Joi.string().required() //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

const idBuilding = Joi.object({
    id_building  : Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid id.').required()
})

const rolBuilding = Joi.object({
    id_building  : Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid id.').required(),
    rol: Joi.number().valid(0, 1).required(), //0:admin 1:basico
})

const updateApplyPending = Joi.object({
    id_building  : Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid id.').required(),
    id_apply  : Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid id.').required(),
    status: Joi.string().valid('ACC', 'REJ').required(), //0:admin 1:basico
})

module.exports = {
    newUser,
    idBuilding,
    rolBuilding,
    updateApplyPending
}