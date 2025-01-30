// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  token_name                            : 'token',
  id_user                               : 'id_user',
  api_baseurl                           : 'http://127.0.0.1:123',
  // backend_baseurl                       : 'http://localhost:12351',
  backend_baseurl                       : 'http://38.47.70.195:12351',
  token_header                          : 'Bearer',

  // router use hash for development & no hash for production
  router_hash                           : false,
  current_tab                           : 1
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
