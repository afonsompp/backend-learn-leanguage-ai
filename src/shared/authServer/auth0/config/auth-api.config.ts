import * as process from 'process';

export default () => ({
  authApi: {
    clientId: process.env.BACK_END_CLIENT_ID,
    clientSecret: process.env.BACKEND_CLIENT_SECRET,
    audience: process.env.AUTH_API_URL + '/api/v2/',
    url: process.env.AUTH_API_URL,
  },
});
