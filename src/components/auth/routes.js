const routes = [
    {
        path : '/signup',
        type : 'post',
        code : '001',
        desc : 'Registra nuevo usuario.',
        handler : 'signup',
        schemeProperty: 'newUser',
        auth:false,
        disable: false
    },
    {
        path : '/login',
        type : 'post',
        code : '002',
        desc : 'Login de usuario.',
        handler : 'login',
        schemeProperty: 'loginUser',
        auth:false,
        disable: false
    },
    /*{
        path : '/google',
        type : 'get',
        code : '003',
        desc : 'Autentica usuario con google.',
        handler : 'googleAuth',
        scheme: false,
        disable: false
    },
    {
        path : '/google/redirect',
        type : 'get',
        code : '004',
        desc : 'Verifica acceso de usuario con google.',
        handler : 'googleAuthRedirect',
        scheme: false,
        disable: false
    },*/
    {
        path : '/google/token',
        type : 'get',
        code : '005',
        desc : 'Verifica token de acceso de usuario con Google.',
        handler : 'GoogleAuthWithToken',
        scheme: 'tokenQuery',
        auth:false,
        disable: false
    },
    {
        path : '/fb/token',
        type : 'get',
        code : '006',
        desc : 'Verifica token de acceso de usuario con Facebook.',
        handler : 'FBAuthWithToken',
        scheme: 'tokenQuery',
        auth:false,
        disable: false
    }
]

module.exports = routes