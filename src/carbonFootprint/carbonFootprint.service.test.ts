import { dataSource } from '../../config/dataSource';
import { TEST_CARBON_EMISSION_FACTORS } from '../seed-dev-data';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CarbonFootprintService } from './carbonFootprint.service';

let carbonFootprintService: CarbonFootprintService;

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource
    .getRepository(CarbonEmissionFactor)
    .save(TEST_CARBON_EMISSION_FACTORS);
  carbonFootprintService = new CarbonFootprintService(dataSource.getRepository(CarbonEmissionFactor));
});

describe('CarbonFootprint.service', () => {
  describe('compute carbon footprint for food product', () => {
    it('should produce result', async () => {
      const expectFootprint = 0.1 * 0.11 + 0.15 * 0.12 + 0.4 * 0.13 + 0.7 * 0.14 + 0.3 * 0.15;
      let assertedFootprint = await carbonFootprintService.computeCarbonEmissionForFoodProduct({
        ingredients: [
          { name: 'ham', quantity: 0.1, unit: 'kg' },
          { name: 'cheese', quantity: 0.15, unit: 'kg' },
          { name: 'tomato', quantity: 0.4, unit: 'kg' },
          { name: 'flour', quantity: 0.7, unit: 'kg' },
          { name: 'oliveOil', quantity: 0.3, unit: 'kg' },
        ]
      });
      expect(assertedFootprint).toBeDefined();
      expect(assertedFootprint).toEqual(expectFootprint);
    });
    it('should produce null', async () => {
      let footprint = await carbonFootprintService.computeCarbonEmissionForFoodProduct({
        ingredients: [
          { name: 'ham', quantity: 0.1, unit: 'kg' },
          { name: 'cheese', quantity: 0.15, unit: 'kg' },
          { name: 'tomato', quantity: 0.4, unit: 'kg' },
          { name: 'flour', quantity: 0.7, unit: 'kg' },
          { name: 'pineapple', quantity: 0.2, unit: 'kg' },
        ]
      });
      expect(footprint).toBeNull();
    });
  });

  describe('compute carbon footprint for ingredient', () => {
    it('should produce result', async () => {
      const expectFootprint = 0.1 * 0.11;
      let assertedFootprint = await carbonFootprintService.computeCarbonEmissionForIngredient({
        name: 'ham',
        quantity: 0.1,
        unit: 'kg'
      });
      expect(assertedFootprint).toBeDefined();
      expect(assertedFootprint).toEqual(expectFootprint);
    });
    it('should produce null', async () => {
      let footprint = await carbonFootprintService.computeCarbonEmissionForIngredient({
        name: 'pineapple',
        quantity: 0.2,
        unit: 'kg'
      });
      expect(footprint).toBeNull();
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
