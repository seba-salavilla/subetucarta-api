const Db = require('../../../mongo')

const Model = {
    findAllUser : async () =>{
        let result = await Db.collection(Db.tables.user).find({}).toArray();
        return result;
    },

    /**
     * BUSCA LOS CONDOMINIO DE UN USUARIO
     */
    findUserBuildings : async (id_user, projection) =>{
        let result = await Db.collection(Db.tables.building).find({
            'users._id' : id_user
        }, projection ? { projection } : {}).toArray();
        return result;
    },

    /**
     * BUSCA EL CONDOMINIO DE UN USUARIO
     */
    findOneBuildingUser : async (id_building, id_user, projection) =>{
        let result = await Db.collection(Db.tables.building).findOne({
            _id: new Db.ObjectID(id_building),
            'users._id' : id_user
        }, projection ? { projection } : {});

        return result;
    },

    /**
     * BUSCA USUARIO POR ID
     */
    findUserByID : async (id_user, projection) =>{
        let result = await Db.collection(Db.tables.user).findOne({_id : id_user}, projection ? { projection } : {})
        return result
    },

    /**
     * ACTUALIZA CONDOMINIO FAVORITO DEL USUARIO
     */
    updateUserFavoriteBuilding : async (id_user, id_building) =>{
        let result = await Db.collection(Db.tables.user)
            .updateOne(
                {_id: id_user },
                {$set:{
                    id_fav_build : new Db.ObjectID(id_building) }
                }
            )
       
        return result
    },

    /**
     * QUITA USUARIO DEL CONDOMINIO
     */
    pullUserFromBuilding : async (id_user, id_building) =>{
        console.log(id_user, id_building)
        let result = await Db.collection(Db.tables.building)
            .updateOne(
                {
                    _id: new Db.ObjectID(id_building),
                    'users._id' : id_user
                },
                {
                    $pull:{
                        'users' : {
                            _id:id_user
                        }
                    }
                }
            )
       
        return result
    }
}

module.exports = Model