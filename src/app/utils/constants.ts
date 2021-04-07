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
    parameters: {},
    i18n: {
      sp: {
        error : "Corrija los errores existentes.",
        invalid_date :"{{field}} no es una fecha válida.",
        invalid_email : "{{field}} no es un correo válido.",
        invalid_regex : "{{field}} no cumple el patrón {{regex}}.",
        mask : "{{field}} no cumple la máscara.",
        max : "{{field}} no puede ser mayor que {{max}}.",
        maxLength : "{{field}} debe tener como máximo {{length}} caracteres.",
        min : "{{field}} no puede ser menor que {{min}}.",
        minLength : "{{field}} debe tener como mínimo {{length}} caracteres.",
        next : "Siguiente",
        pattern : "{{field}} no cumple el patrón {{pattern}}",
        previous : "Anterior",
        required : "{{field}} obligatorio",
        complete: "Operación completada",
        submitError: "Corrija los errores existentes",
        submitMessage: "Operación solicitada",
        submitDone: "Operación solicitada",
        unique: "{{field}} debe ser único",
        valueIsNotAvailable: '{{ field }} es un valor no válido.',
        month: 'Mes',
        day: 'Día',
        year: 'Año',
        january: 'Enero',
        february: 'Febrero',
        march: 'Marzo',
        april: 'Abril',
        may: 'Mayo',
        june: 'Junio',
        july: 'Julio',
        august: 'Agosto',
        september: 'Septiembre',
        october: 'Octubre',
        november: 'Noviembre',
        december: 'Diciembre',
        cancel: 'Cancelar',
        submit: 'Aceptar',
        confirmCancel: '¿Está seguro de que quiere cancelar?',
        'Type to search': 'Filtro',
        'Add Another': 'Añadir'
      }
    }
};
