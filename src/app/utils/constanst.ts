const HOST = 'http://localhost:3001';

export const CONSTANST = {
    permissions: {},
    routes: {
        authorization: {
            login: HOST + '/user/login',
            logout: HOST + '/logout'
        },
        client: {
            list: HOST + '/api/client',
            delete: HOST + '/api/client/delete/:id',
            save: HOST + '/api/client/save',
            get: HOST + '/api/client/:id'
        },
        user: {}
    },
    lang: {},
    session: {},
    parameters: {}
};
