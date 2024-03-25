import { Body, Controller, Logger, Post } from "@nestjs/common";
import { CarbonFootprintService } from "./carbonFootprint.service";
import { FoodProduct } from './foodProduct';

@Controller("carbon-footprint")
export class CarbonFootprintController {
  constructor(
    private readonly carbonFootprintService: CarbonFootprintService
  ) {}

  @Post()
  async computeCarbonFootprint(@Body() foodProduct: FoodProduct): Promise<number | null> {
    Logger.log(
      `[carbon-footprint] [POST] Compute carbon footprint for ${JSON.stringify(foodProduct)}.`,
    );
    const footprint = await this.carbonFootprintService.computeCarbonEmissionForFoodProduct(foodProduct);
    Logger.debug(`[carbon-footprint] [POST] Carbon footprint for ${JSON.stringify(foodProduct)} : ${footprint}.`,);
    return footprint;
  }
}
