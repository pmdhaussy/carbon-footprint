import { Injectable } from '@nestjs/common';
import { FoodProductDto, IngredientDto } from './dto/foodProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { Repository } from 'typeorm';
import { CarbonFootprintEntity, IngredientEntity } from './carbonFootprint.entity';
import { CarbonFootprintDto } from './dto/carbonFootprint.dto';

@Injectable()
export class CarbonFootprintService {
  constructor(
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>,
    @InjectRepository(CarbonFootprintEntity)
    private carbonFootprintRepository: Repository<CarbonFootprintEntity>
  ) {
  }

  find(id: number): Promise<CarbonFootprintDto | null> {
    return this.carbonFootprintRepository.findOne({
      where: { id },
      relations: {
        ingredients: true,
      },
    });
  }

  async computeAndSaveCarbonFootprint(foodProduct: FoodProductDto): Promise<CarbonFootprintDto | null> {
    const value = await this.computeCarbonEmissionForFoodProduct(foodProduct);
    if (value === null) {
      return null;
    }
    return await this.carbonFootprintRepository.manager.save(new CarbonFootprintEntity({
      ingredients: foodProduct.ingredients.map(i => new IngredientEntity(i)),
      value
    }));
  }

  async computeCarbonEmissionForFoodProduct(foodProduct: FoodProductDto): Promise<number | null> {
    const emissions = await Promise.all(
      foodProduct.ingredients.map((ingredient) => this.computeCarbonEmissionForIngredient(ingredient))
    );
    // If the emission of any ingredient is null the food product emission is null
    if (emissions.some(e => e === null)) {
      return null;
    }
    return emissions.reduce((sum: number, element: number) => sum + element);
  }

  async computeCarbonEmissionForIngredient(ingredient: IngredientDto): Promise<number | null> {
    const emissionFactor = await this.carbonEmissionFactorRepository
      .createQueryBuilder('ingredient')
      .where('ingredient.name = :name and ingredient.unit = :unit', ingredient)
      .getOne();
    if (emissionFactor == null) {
      return null;
    }
    return emissionFactor?.emissionCO2eInKgPerUnit * ingredient.quantity;
  }
}
