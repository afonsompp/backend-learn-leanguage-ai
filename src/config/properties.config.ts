import * as process from 'process';

export default () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.TYPEORM_SYNC === 'true' || false,
    logging: process.env.TYPEORM_LOGGING === 'true' || false,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
  },
  oauth: {
    issuer: process.env.OKTA_ISSUER,
    audience: process.env.OKTA_AUDIENCE,
    admin: {
      clientId: process.env.BACK_END_CLIENT_ID,
      clientSecret: process.env.BACKEND_CLIENT_SECRET,
    },
  },
});
