import { CarbonFootprintController } from './carbonFootprint.controller';
import { CarbonFootprintService } from './carbonFootprint.service';
import { dataSource, GreenlyDataSource } from '../../config/dataSource';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { TEST_CARBON_EMISSION_FACTORS } from '../seed-dev-data';
import { CarbonFootprintEntity } from './carbonFootprint.entity';

const expectFootprint = 0.1 * 0.11 + 0.15 * 0.12 + 0.4 * 0.13 + 0.7 * 0.14 + 0.3 * 0.15;
let controller: CarbonFootprintController;
let service: CarbonFootprintService;

beforeAll(async () => {
  await dataSource.initialize();
  service = new CarbonFootprintService(
    dataSource.getRepository(CarbonEmissionFactor),
    dataSource.getRepository(CarbonFootprintEntity)
  );
  controller = new CarbonFootprintController(service);
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource
    .getRepository(CarbonEmissionFactor)
    .save(TEST_CARBON_EMISSION_FACTORS);
});

describe('CarbonFootprintController', () => {
  const assertedFoodProduct = {
    ingredients: [
      { name: 'ham', quantity: 0.1, unit: 'kg' },
      { name: 'cheese', quantity: 0.15, unit: 'kg' },
      { name: 'tomato', quantity: 0.4, unit: 'kg' },
      { name: 'flour', quantity: 0.7, unit: 'kg' },
      { name: 'oliveOil', quantity: 0.3, unit: 'kg' },
    ]
  };

  describe('get /:id', () => {
    it('should return the footprint of the provided product', async () => {
      const savedFootprint = await controller.computeAndSaveCarbonFootprint(assertedFoodProduct);
      const getFootprint = await controller.getCarbonFootprint({
        id: savedFootprint?.id
      });
      expect(getFootprint).toBeDefined();
      expect(getFootprint?.value).toEqual(expectFootprint);
    });
  });

  describe('post /', () => {
    it('should compute save and return the footprint of the provided product', async () => {
      jest.spyOn(service, 'computeCarbonEmissionForFoodProduct').mockImplementation(() => Promise.resolve(expectFootprint));
      const footprint = await controller.computeAndSaveCarbonFootprint(assertedFoodProduct);
      expect(footprint?.value).toBe(expectFootprint);
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
