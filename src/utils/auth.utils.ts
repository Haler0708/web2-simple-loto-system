import { auth } from "express-openid-connect";
import dotenv from "dotenv";

dotenv.config();

const config = {
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
};

export const auth0Init = auth(config);
