import { auth } from "express-openid-connect";
import { auth as jwtAuth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";

dotenv.config();

const CONFIG = Object.freeze({
  authRequired: false,
  idpLogout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_DOMAIN,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  authorizationParams: {
    response_type: "code",
  },
});

const JWT_VALIDATION_CONFIG = Object.freeze({
  audience: process.env.AUTH_API,
  issuerBaseURL: process.env.AUTH_DOMAIN,
  tokenSigningAlg: process.env.JWT_SIGNING_ALG,
  secret: "", // won't work without this.
  // After some debugging I found out that under the hood in node_modules/express-oauth2-jwt-bearer/dist/index.js
  // it loads itself env variables and then it takes a secret that exists as and env variable because of express-openid-connect that needs it.
  // Here we override this config to use a direct secret that is an empty string as an argument to mitigate that bug
});

export const roundsJwtValidation = jwtAuth(JWT_VALIDATION_CONFIG);

export const auth0Init = auth(CONFIG);
