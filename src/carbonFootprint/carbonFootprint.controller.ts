import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { CarbonFootprintService } from "./carbonFootprint.service";
import { FoodProductDto } from './dto/foodProduct.dto';
import { CarbonFootprintDto } from './dto/carbonFootprint.dto';

@Controller("carbon-footprint")
export class CarbonFootprintController {
  constructor(
    private readonly carbonFootprintService: CarbonFootprintService
  ) {}

  @Get(':id')
  getCarbonFootprint(@Param() params: any): Promise<CarbonFootprintDto | null> {
    Logger.log(
      `[carbon-footprint] [GET] CarbonFootprint: getting carbon footprint identified by provided ID: ${params.id}.`
    );
    return this.carbonFootprintService.find(params.id);
  }

  @Post()
  async computeAndSaveCarbonFootprint(@Body() foodProduct: FoodProductDto): Promise<CarbonFootprintDto | null> {
    Logger.log(
      `[carbon-footprint] [POST] Compute carbon footprint for ${JSON.stringify(foodProduct)}.`,
    );
    const footprint = await this.carbonFootprintService.computeAndSaveCarbonFootprint(foodProduct);
    Logger.debug(`[carbon-footprint] [POST] Carbon footprint ${JSON.stringify(footprint)}.`);
    return footprint;
  }
}
