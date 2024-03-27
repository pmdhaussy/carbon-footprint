import { dataSource, GreenlyDataSource } from '../../config/dataSource';
import { TEST_CARBON_EMISSION_FACTORS } from '../seed-dev-data';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CarbonFootprintService } from './carbonFootprint.service';
import { CarbonFootprintEntity } from './carbonFootprint.entity';

let carbonFootprintService: CarbonFootprintService;

beforeAll(async () => {
  await dataSource.initialize();
  carbonFootprintService = new CarbonFootprintService(
    dataSource.getRepository(CarbonEmissionFactor),
    dataSource.getRepository(CarbonFootprintEntity)
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource
    .getRepository(CarbonEmissionFactor)
    .save(TEST_CARBON_EMISSION_FACTORS);
});

describe('CarbonFootprint.service', () => {
    it('compute carbon footprint for food product and save it', async () => {
      const footprint = await carbonFootprintService.computeAndSaveCarbonFootprint({
        ingredients: [
          { name: 'ham', quantity: 0.1, unit: 'kg' },
          { name: 'cheese', quantity: 0.15, unit: 'kg' },
          { name: 'tomato', quantity: 0.4, unit: 'kg' },
          { name: 'flour', quantity: 0.7, unit: 'kg' },
          { name: 'oliveOil', quantity: 0.3, unit: 'kg' },
        ]
      });

      expect(footprint?.value).not.toEqual(0);
      expect(footprint?.ingredients[0].name).toEqual('ham');
    });
    it('should return an existing carbon footprint', async () => {
      const assertedFootprint = await carbonFootprintService.computeAndSaveCarbonFootprint({
        ingredients: [
          { name: 'ham', quantity: 0.1, unit: 'kg' },
          { name: 'cheese', quantity: 0.15, unit: 'kg' },
          { name: 'tomato', quantity: 0.4, unit: 'kg' },
          { name: 'flour', quantity: 0.7, unit: 'kg' },
          { name: 'oliveOil', quantity: 0.3, unit: 'kg' },
        ]
      });
      const footprint = await carbonFootprintService.find(assertedFootprint!.id);

      expect(footprint).toBeDefined();
      expect(footprint?.id).toEqual(assertedFootprint?.id);
      expect(footprint?.ingredients[0].name).toEqual('ham');
    });
  describe('compute carbon footprint for food product', () => {
    it('should produce result', async () => {
      await dataSource
        .getRepository(CarbonEmissionFactor)
        .save(TEST_CARBON_EMISSION_FACTORS);
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
