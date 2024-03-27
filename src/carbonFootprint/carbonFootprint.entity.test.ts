import { dataSource, GreenlyDataSource } from '../../config/dataSource';
import { CarbonFootprintEntity, IngredientEntity } from './carbonFootprint.entity';

let hamCheesePizza: CarbonFootprintEntity;
beforeAll(async () => {
  await dataSource.initialize();
  hamCheesePizza = new CarbonFootprintEntity({
    ingredients: [
      new IngredientEntity({ name: 'ham', quantity: 0.1, unit: 'kg' }),
      new IngredientEntity({ name: 'cheese', quantity: 0.15, unit: 'kg' }),
      new IngredientEntity({ name: 'tomato', quantity: 0.4, unit: 'kg' }),
      new IngredientEntity({ name: 'flour', quantity: 0.7, unit: 'kg' }),
      new IngredientEntity({ name: 'oliveOil', quantity: 0.3, unit: 'kg' }),
    ],
    value: 0.224
  });
});
beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});
describe('CarbonFootprintEntity', () => {
  describe('constructor', () => {
    it('should create a carbon footprint', () => {
      expect(hamCheesePizza.ingredients).toContainEqual({ name: 'ham', quantity: 0.1, unit: 'kg' });
      expect(hamCheesePizza.ingredients).toContainEqual({ name: 'cheese', quantity: 0.15, unit: 'kg' });
      expect(hamCheesePizza.ingredients).toContainEqual({ name: 'tomato', quantity: 0.4, unit: 'kg' });
      expect(hamCheesePizza.ingredients).toContainEqual({ name: 'flour', quantity: 0.7, unit: 'kg' });
      expect(hamCheesePizza.ingredients).toContainEqual({ name: 'oliveOil', quantity: 0.3, unit: 'kg' });
      expect(hamCheesePizza.value).toBe(0.224);
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
