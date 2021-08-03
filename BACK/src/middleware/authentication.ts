import expressJwt from "express-jwt";

import { publicRoutes } from "../server";

const checkAuthentication = (): unknown =>
  expressJwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ["HS256"],
  }).unless({ path: publicRoutes });

export default checkAuthentication;
