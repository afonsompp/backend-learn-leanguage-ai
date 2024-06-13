import * as process from 'process';

export default () => ({
  okta: {
    clientId: process.env.OKTA_CLIENTID,
    issuer: process.env.OKTA_ISSUER,
    audience: process.env.OKTA_AUDIENCE,
  },
});
