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
          list: environment.HOST + '/:formPath/submission',
          delete: environment.HOST + '/:formPath/submission/:id',
          create: environment.HOST + '/:formPath/submission',
          update: environment.HOST + '/:formPath/submission/:id',
          get: environment.HOST + '/:formPath/submission/:id'
        }
    },
    lang: {},
    session: {},
    parameters: {}
};
