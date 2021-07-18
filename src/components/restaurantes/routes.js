const routes = [
    {
        path : '/registry',
        type : 'post',
        code : '001',
        desc : 'Registra restaurant y genera código QR',
        auth : false,
        handler : 'registroRestaurante',
        schemeProperty: 'validRegistroRestaurant',
        disable: false
    },
    {
        path : '/menu/:id',
        type : 'get',
        code : '002',
        desc : 'Obtiene menu del restaurant por ID',
        auth : false,
        handler : 'obtenerMenuRestaurantID',
        schemeProperty: 'validObtenerRestaurantID',
        disable: false
    },
    {
        path : '/pdf/menu/:id',
        type : 'get',
        code : '002',
        desc : 'Obtiene PDF menu  del restaurant por ID',
        auth : false,
        handler : 'obtenerPDFMenuRestaurantID',
        schemeProperty: 'validObtenerRestaurantID',
        disable: false
    }
]

module.exports = routes