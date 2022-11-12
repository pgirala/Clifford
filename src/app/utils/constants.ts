import { environment } from '../../environments/environment';

export const CONSTANTS = {
  permissions: {
    sufijoCorreo: '@gob.es'
  },
  keycloak: {
    url: '/auth',
    realm: 'Clifford',
    clientId: 'clifford-front-end'
  },
  routes: {
    local: {
      root: '/'
    },
    authorization: {
      loginIndividual: '/clifford-back/rest/usuarios/token/usuario',
      loginOrganizacion: '/clifford-back/rest/usuarios/token/organizacion',
      logout: '/logout'
    },
    formulario: {
      list: '/form',
      get: '/form/:id',
      find: '/form',
      update: '/form/:id',
      create: '/form',
      delete: '/:formPath',
      clone: '/clifford-back/rest/formularios'
    },
    submission: {
      list: '/:formPath/submission',
      delete: '/:formPath/submission/:id',
      create: '/:formPath/submission',
      update: '/:formPath/submission/:id',
      get: '/:formPath/submission/:id'
    },
    jbpm: {
      procesos: '/queries/processes/definitions',
      crearInstanciaProceso: '/containers/:idContenedor/processes/:idFlujo/instances',
      tareas: '/queries/definitions/cliffordJbpmHumanTasksWithUser/filtered-data?mapper=UserTasks&page=:page&pageSize=:pageSize',
      cambiarEstadoTarea: '/containers/:idContenedor/tasks/:idTarea/states/:estado',
      tratarDatosEntrada: '/containers/:idContenedor/tasks/:idTarea/contents/input',
      tratarDatosSalida: '/containers/:idContenedor/tasks/:idTarea/contents/output'
    },
    role: {
      list: '/role'
    },
    user: {
      find: '/admon/user/submission?data.email=:email'
    },
    envio: {
      create: '/clifford-back/rest/envios'
    },
    check: {
      ping: '/clifford-back/rest/usuarios/ping'
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
    formTarea: 'tarea',
    formMetadatos: 'metadatos',
    formDominio: 'admon/dominio',
    lang: {},
    session: {},
    parameters: {},
    i18n: {
      sp: {
        error: "Corrija los errores existentes.",
        invalid_date: "{{field}} no es una fecha válida.",
        invalid_email: "{{field}} no es un correo válido.",
        invalid_regex: "{{field}} no cumple el patrón {{regex}}.",
        mask: "{{field}} no cumple la máscara.",
        max: "{{field}} no puede ser mayor que {{max}}.",
        maxLength: "{{field}} debe tener como máximo {{length}} caracteres.",
        min: "{{field}} no puede ser menor que {{min}}.",
        minLength: "{{field}} debe tener como mínimo {{length}} caracteres.",
        next: "Siguiente",
        pattern: "{{field}} no cumple el patrón {{pattern}}",
        previous: "Anterior",
        required: "{{field}} obligatorio",
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
        'No choices to choose from': 'No hay elementos',
        "File Name": "Nombre del fichero",
        "Size": "Tamaño",
        "Type": "Tipo"
      }
    }
  }
};
