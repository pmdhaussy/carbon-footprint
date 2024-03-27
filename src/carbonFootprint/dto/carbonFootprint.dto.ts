import { IngredientDto } from './foodProduct.dto';

export class CarbonFootprintDto {
  id: number;
  ingredients: IngredientDto[];
  value: number;
}
