import { StatusCodes } from "http-status-codes";
import {
  Body,
  Post,
  Route,
  Controller,
  SuccessResponse,
  Res,
  TsoaResponse,
  Get,
  Put,
  Path,
  Delete,
} from "tsoa";

import db from "../sqlz/models";
import { ICardsAttributes } from "../sqlz/models/card";
import { IUserAttributes } from "../sqlz/models/user";

@Route("cards")
export class CardsController extends Controller {
  @SuccessResponse(StatusCodes.OK)
  @Get()
  async list(): Promise<ICardsAttributes[]> {
    return await db.cards.findAll();
  }

  @SuccessResponse(StatusCodes.OK)
  @Post()
  async create(@Body() card: ICardsAttributes): Promise<ICardsAttributes> {
    const user: IUserAttributes = await db.users.findOne();
    const newCard = await db.cards.create({
      ...card,
      user_id: user.id,
    });

    this.setStatus(StatusCodes.OK);
    return newCard;
  }

  @SuccessResponse(StatusCodes.OK)
  @Delete("{id}")
  async delete(
    @Path() id: number,
    @Res()
    unauthorizedResponse: TsoaResponse<
      StatusCodes.NOT_FOUND,
      { message: string }
    >
  ): Promise<void> {
    const card = db.cards.findByPk(id);
    if (!card) {
      return unauthorizedResponse(StatusCodes.NOT_FOUND, {
        message: "not found",
      });
    }
    this.setStatus(StatusCodes.OK);
    card.destroy();
  }

  @SuccessResponse(StatusCodes.OK)
  @Put("{id}")
  async update(
    @Path() id: number,
    @Body() cardContent: ICardsAttributes,
    @Res()
    unauthorizedResponse: TsoaResponse<
      StatusCodes.NOT_FOUND,
      { message: string }
    >
  ): Promise<ICardsAttributes> {
    const card = db.cards.findByPk(id);
    if (!card) {
      return unauthorizedResponse(StatusCodes.NOT_FOUND, {
        message: "not found",
      });
    }
    const updatedCard = card.update(cardContent);
    this.setStatus(StatusCodes.OK);
    return updatedCard;
  }
}
