export class FoodProductDto {
  ingredients: IngredientDto[];
}

export class IngredientDto {
  name: string;
  quantity: number;
  unit: string;
}
