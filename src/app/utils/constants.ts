import { environment } from '../../environments/environment';

export const CONSTANTS = {
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
        formulario: {
            scope: 'MRR',
            list: environment.HOST + '/form',
            get: environment.HOST + '/form/:id'
        },
        submission: {
          list: environment.HOST + '/submission',
          delete: environment.HOST + '/submission/:id',
          create: environment.HOST + '/submission',
          update: environment.HOST + '/submission/:id',
          get: environment.HOST + '/submission/:id'
        }
    },
    lang: {},
    session: {},
    parameters: {}
};
