require('dotenv').config();

/**
 * Load environment variables from .env file
 */

module.exports = {
    PORT: process.env.PORT || 3000,
    ENV: process.env.NODE_ENV === 'dev' || 'prod',
    MONGO_HOST: process.env.MONGO_HOST || 'localhost',
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_DB: process.env.MONGO_DB || 'test',
    TOKEN_KEY: process.env.KEY_TOKEN || 'supermegasecreto',
    GOOGLE_APIKEY: process.env.GOOGLE_APIKEY || '',
    BASE_URL_PUB: process.env.BASE_URL_PUB || '/api/pb',
    BASE_URL_PRIV: process.env.BASE_URL_PRIV || '/api/pr'
};
