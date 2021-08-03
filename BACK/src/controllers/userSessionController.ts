import { StatusCodes } from "http-status-codes";
import {
  Body,
  Post,
  Route,
  Controller,
  SuccessResponse,
  Res,
  TsoaResponse,
} from "tsoa";

import { IUserAttributes } from "@models/user";

import db from "../sqlz/models";

@Route("/")
export class UserSessionController extends Controller {
  @SuccessResponse(StatusCodes.OK)
  @Post("login")
  async authenticate(
    @Body() loginBody: Pick<IUserAttributes, "password" | "login">,
    @Res()
    unauthorizedResponse: TsoaResponse<
      StatusCodes.UNAUTHORIZED,
      { message: string }
    >
  ): Promise<{ token: string }> {
    const { login, password } = loginBody;
    const user = db.users.findOne({ where: { login } });

    const userExists = !!user;
    if (userExists) user.password = password;

    if (!userExists || !(await user.validPassword())) {
      this.setStatus(StatusCodes.UNAUTHORIZED);
      return unauthorizedResponse(StatusCodes.UNAUTHORIZED, {
        message: "unauthorized",
      });
    }

    this.setStatus(StatusCodes.OK);

    return {
      token: user.generateToken(),
    };
  }
}
