import { Module } from "@nestjs/common";
import { CarbonFootprintService } from "./carbonFootprint.service";
import { CarbonFootprintController } from "./carbonFootprint.controller";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarbonEmissionFactor])],
  providers: [CarbonFootprintService],
  controllers: [CarbonFootprintController],
})
export class CarbonFootprintModule {}
