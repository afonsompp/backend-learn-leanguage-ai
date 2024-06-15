import * as process from 'process';

export default () => ({
  okta: {
    issuer: process.env.OKTA_ISSUER,
    audience: process.env.OKTA_AUDIENCE,
  },
});
