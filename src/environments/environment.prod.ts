export const environment = {
  production: true,
  api: 'https://hc.scout.ch/api/v1',
  oauth: {
    url: 'https://db.scout.ch/oauth/authorize',
    responseType: 'code',
    clientId: 'hF8zomWvDOZBEWNx3BdFfeKp0jK5t_NbXDSiJpDW4DY',
    redirectUri: 'https://hc.scout.ch/callback',
    scope: 'email name with_roles',
  },
  version: '1.5.0'
};
