import { Injectable } from '@nestjs/common';
import { FoodProduct } from './foodProduct';
import { InjectRepository } from '@nestjs/typeorm';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient';
import { isNull } from 'lodash';

@Injectable()
export class CarbonFootprintService {
  constructor(
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
  ) {
  }

  async computeCarbonEmissionForFoodProduct(foodProduct: FoodProduct): Promise<number | null> {
    const emissions = await Promise.all(
      foodProduct.ingredients.map((ingredient) => this.computeCarbonEmissionForIngredient(ingredient))
    );
    if(emissions.some(isNull)) {
      return null;
    }
    return emissions.reduce((sum: number, element: number) => sum+element);
  }

  async computeCarbonEmissionForIngredient(ingredient: Ingredient): Promise<number | null> {
    const emissionFactor = await this.carbonEmissionFactorRepository
      .createQueryBuilder("ingredient")
      .where("ingredient.name = :name and ingredient.unit = :unit", ingredient)
      .getOne();
    if(emissionFactor == null) {
      return null;
    }
    return emissionFactor?.emissionCO2eInKgPerUnit * ingredient.quantity;
  }
}
