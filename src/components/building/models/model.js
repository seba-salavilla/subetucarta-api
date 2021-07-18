const Db = require('../../../mongo')

const Model = {
    /**
     * INSERTA NUEVO CONDOMINIO
     */
    insertBuilding : async (name, type_building, address, user) =>{
        const date = new Date()
        const data = {
            display_name : name,
            type_building,
            users : [
                {
                    _id : user._id,
                    rol : 0, //0:admin, 1:basic
                    join_date: date
                }
            ],
            ...address,
            created_by : {
                _id:user._id,
                name: user.name
            },
            created_on : date,
            picture : 'https://scontent.fiqq1-1.fna.fbcdn.net/v/t1.0-9/13082570_1673825956214734_1910365139064852572_n.jpg?_nc_cat=104&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeGTCOZcToM4d4n7Jo5p5s2bknavPyO38ImSdq8_I7fwiScPuMHIVTQCCvHk3gR2cw0&_nc_ohc=-OW8MAVw5WkAX-PjnKm&_nc_oc=AQlHWkiaWMqTs8AEr3H5KpY2LfXYY4xjyAJ5duKzOWBhgu5TCkmINDHv_iTpCeRaaDc&_nc_ht=scontent.fiqq1-1.fna&oh=3d071eabadace582984849548f6a04e4&oe=5FE533BA'
        }

        let result = await Db.collection(Db.tables.building).insertOne(data);
        return result;
    },

    /**
     * VERIFICA PLACE_ID EXISTENTE
     */
    getBuildingByPlaceID : async (place_id) =>{
        let result = await Db.collection(Db.tables.building).findOne({place_id});
        return result;
    },

    /**
     * BUSCA CONDOMINIOS POR FILTROS
     */
    findBuildingsByFilter : async (filter) =>{
        console.log("filter", filter)
        
        //address_components 0:numero 1:direccion 2:localidad(ciudad/pueblo) 3:comuna 4:provincia(ciudad) 5:region 6:pais
        
        /*const query = {
            display_name : new RegExp(filter.display_name, 'i')
        }*/
        const query = {
            //$or:[]
        }

        if(filter.st_name && filter.display_name){
            query["$or"] = [
                {"display_name": new RegExp(filter.display_name, 'i')}, 
                {"address_components.1.long_name":new RegExp(filter.st_name, 'i')}
            ]
        }else if(filter.display_name){
            query['display_name'] = new RegExp(filter.display_name, 'i')
        }else{
            query['address_components.1.long_name'] = new RegExp(filter.st_name, 'i')
        }

        if(filter.st_num){
            query["address_components.0.long_name"] = filter.st_num
        }
        
        if(filter.city){
            query["$and"] = [
                {$or : [ 
                    {"address_components.2.long_name": new RegExp(filter.city, 'i')}, 
                    {"address_components.4.long_name": new RegExp(filter.city, 'i')}
                ]}
            ]
        }
        if(filter.locality){
            query["address_components.3.long_name"] = new RegExp(filter.locality, 'i')
        }
        if(filter.country){
            query["address_components.6.long_name"] = new RegExp(filter.country, 'i')
        }
        console.log("query", query)
        let result = await Db.collection(Db.tables.building).find(query, {projection:{display_name:1, formatted_address:1, geometry: 1, type_building:1}}).toArray();
        return result;
    }
}

module.exports = Model