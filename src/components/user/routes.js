const routes = [
    {
        path : '/profile',
        type : 'get',
        code : '001',                               //Código para identificar la operacion
        desc : 'Obtiene perfil del usuario',
        auth : true,                                //True requiere authenticacion
        handler : 'getProfileUser',                 //Metodo del controlador
        schemeProperty: '',                         //Esquema que usa para validar los datos
        disable: false                              //True para deshabilitar la ruta
    },
    {
        path : '/building/all',
        type : 'get',
        code : '002',
        desc : 'Obtiene todos los condominios del usuario',
        auth : true,
        handler : 'getUserBuildings',
        schemeProperty: '',
        disable: false
    },
    {
        path : '/building/id/:id_building',
        type : 'get',
        code : '003',
        desc : 'Obtiene un condominio del usuario',
        auth : true,
        handler : 'getOneBuildingUser',
        schemeProperty: 'idBuilding',
        disable: false
    },
    {
        path : '/favorite/building/id/:id_building',
        type : 'put',
        code : '004',
        desc : 'Asigna condominio favorito al usuario',
        auth : true,
        handler : 'setUserFavoriteBuilding',
        schemeProperty: 'idBuilding',
        disable: false
    },
    {
        path : '/leave/building/id/:id_building',
        type : 'put',
        code : '005',
        desc : 'Usuario abandona condominio',
        auth : true,
        handler : 'leaveUserFromBuilding',
        schemeProperty: 'idBuilding',
        disable: false
    }
]

module.exports = routes