import { environment } from '../../environments/environment';

export const CONSTANTS = {
    permissions: {
      sufijoCorreo: '@gob.es'
    },
    keycloak: {
      url: environment.KC_HOST + '/auth',
      realm: 'Clifford',
      clientId: 'clifford-front-end'
    },
    routes: {
        local:{
          root: environment.CL_HOST + '/'
        },
        authorization: {
            loginIndividual: environment.BK_HOST + '/clifford-back/rest/usuarios/token/usuario',
            loginOrganizacion: environment.BK_HOST + '/clifford-back/rest/usuarios/token/organizacion',
            logout: environment.FI_HOST + '/logout'
        },
        client: {
          list: environment.FI_HOST + '/api/client',
          delete: environment.FI_HOST + '/api/client/delete/:id',
          save: environment.FI_HOST + '/api/client/save',
          get: environment.FI_HOST + '/api/client/:id'
        },
        formulario: {
            list: environment.FI_HOST + '/form',
            get: environment.FI_HOST + '/form/:id',
            find: environment.FI_HOST + '/form',
            update: environment.FI_HOST + '/form/:id',
            create: environment.FI_HOST + '/form',
            delete: environment.FI_HOST + '/:formPath',
            clone: environment.BK_HOST + '/clifford-back/rest/formularios'
        },
        submission: {
          list: environment.FI_HOST + '/:formPath/submission',
          delete: environment.FI_HOST + '/:formPath/submission/:id',
          create: environment.FI_HOST + '/:formPath/submission',
          update: environment.FI_HOST + '/:formPath/submission/:id',
          get: environment.FI_HOST + '/:formPath/submission/:id'
        },
        role: {
          list: environment.FI_HOST + '/role'
        },
        user: {
          find: environment.FI_HOST + '/admon/user/submission?data.email=:email'
        },
        envio: {
          create: environment.BK_HOST + '/clifford-back/rest/envios'
        },
        check: {
          ping:  environment.BK_HOST + '/clifford-back/rest/usuarios/ping'
        }
    },
    formularios: {
        multiple: 'common',
        size: {
            small: 'small',
            medium: 'medium',
            large: 'large'
        },
        formEnvio: 'envio',
        formMetadatos: 'metadatos',
        formDominio: 'admon/dominio',
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
            complete: "Actualización en curso. Espere la confirmación (puede tardar unos segundos)",
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
            cancel: 'Limpiar',
            submit: 'Aceptar',
            confirmCancel: '¿Está seguro de que quiere limpiar el formulario?',
            'Type to search': 'Filtro',
            'Add Another': 'Añadir',
            'No choices to choose from': 'No hay elementos'
          }
        }
    }
};
