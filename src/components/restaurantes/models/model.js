const Db = require('../../../mongo')

const Model = {
    newRestaurant : async (data, file) =>{
        let result = await Db.collection(Db.tables.restaurantes).insertOne({
            alias:data.nombre,
            email:data.email,
            address:data.direccion,
            file
        });
        return result;
    },
    addQRToRestaurant : async (id, QR) =>{
        let result = await Db.collection(Db.tables.restaurantes).updateOne({_id:id}, {$set:{QR}});
        return result;
    },
    getRestaurantByID : async (id) =>{
        console.log(id)
        let result = await Db.collection(Db.tables.restaurantes).findOne({_id:Db.ObjectID(id)});
        return result;
    },
    getRestaurantByEmail : async (email) =>{
        let result = await Db.collection(Db.tables.restaurantes).findOne({email});
        return result;
    },
}

module.exports = Model