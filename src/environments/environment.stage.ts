export const environment = {
  production: true,
  api: 'https://hc-stage.cust.digio.ch/api/v1',
  oauth: {
    url: 'https://db.scout.ch/oauth/authorize',
    responseType: 'code',
    clientId: 'hF8zomWvDOZBEWNx3BdFfeKp0jK5t_NbXDSiJpDW4DY',
    redirectUri: 'https://hc-stage.cust.digio.ch/callback',
    scope: 'email name with_roles',
  },
  version: '1.4.1'
};
