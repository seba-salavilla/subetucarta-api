const Db = require('../../../mongo')

const Model = {
    /**
     * INSERTA NUEVO USUARIO EN BD
     */
    insertUser : async (data) =>{
        data.created_on = new Date()
        let result = await Db.collection(Db.tables.user).insertOne(data);
        return result;
    },

    /**
     * BUSCA USUARIO POR EMAIL EN BD
     */
    findUserByEmail : async (email) =>{
        let result = await Db.collection(Db.tables.user).findOne({email})
        return result
    },

    /**
     * ACTUALIZA EMAIL DE USUARIO EN BD
     */
    updatePasswordByUser : async (id, password) =>{
        let result = await Db.collection(Db.tables.user).updateOne({_id:id},{$set:{password}})
        return result
    }
}

module.exports = Model