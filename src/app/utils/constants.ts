import { environment } from '../../environments/environment';

export const CONSTANTS = {
    permissions: {},
    keycloak: {
      url: environment.KC_HOST + '/auth',
      realm: 'Clifford',
      clientId: 'clifford-front-end'
    },
    routes: {
        local:{
          root: environment.LOCAL_HOST + '/'
        },
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
            scope: 'forms',
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
