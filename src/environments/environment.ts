// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  CL_HOST: 'http://clifford:4200',
  FI_HOST: 'http://formio:3001',
  KC_HOST: 'http://keycloak:8080',
  BK_HOST: 'http://clifford-back:8090'
};
