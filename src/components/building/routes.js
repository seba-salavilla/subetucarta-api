const routes = [
    {
        path : "/save",
        type : "post",
        code : '001',
        desc : 'Crea condominio',
        auth : true,
        handler : "save",
        schemeProperty: "newBuilding",
        disable: false
    },
    {
        path : "/search",
        type : "post",
        code : '002',
        desc : 'Busca condominios con filtros',
        auth : true,
        handler : "searchBuilding",
        schemeProperty: "searchBuilding",
        disable: false
    }
]

module.exports = routes