import { environment } from '../../environments/environment';

export const CONSTANST = {
    permissions: {},
    routes: {
        authorization: {
            login: environment.HOST + '/user/login',
            logout: environment.HOST + '/logout'
        },
        client: {
            list: environment.HOST + '/api/client',
            delete: environment.HOST + '/api/client/delete/:id',
            save: environment.HOST + '/api/client/save',
            get: environment.HOST + '/api/client/:id'
        },
        user: {}
    },
    lang: {},
    session: {},
    parameters: {}
};
