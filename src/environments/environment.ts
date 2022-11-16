// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.settings.ts`, but if you do
// `ng build --env=prod` then `environment.settings.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  name: 'local',
  production: false,
  settings: {
    CL_HOST: 'http://clifford:4200',
    FI_HOST: '/clifford-formio',
    FI_BASE_URL: 'http://localhost:3001',
    FI_PROJECT_URL: 'http://localhost:3001',
    KC_HOST: 'https://clifford.predockersl.central.sepg.minhac.age/clifford-keycloak',
    BK_HOST: '/servidorbk',
    JB_HOST: '/kie-server/services/rest/server'
  }
};
