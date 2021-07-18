const Joi = require('joi');

const newUser = Joi.object({
    name        : Joi.string().min(2).max(50).required(),
    email       : Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password    : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

const loginUser = Joi.object({
    email       : Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password    : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

const tokenQuery = Joi.object({
    access_token: Joi.string().required(),
})

module.exports = {
    newUser,
    loginUser,
    tokenQuery
}