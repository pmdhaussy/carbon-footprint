import { CarbonFootprintController } from './carbonFootprint.controller';
import { CarbonFootprintService } from './carbonFootprint.service';
import { dataSource } from '../../config/dataSource';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { TEST_CARBON_EMISSION_FACTORS } from '../seed-dev-data';

describe('CarbonFootprintController', () => {
  let controller: CarbonFootprintController;
  let service: CarbonFootprintService;

  beforeEach(async () => {
    await dataSource.initialize();
    await dataSource
      .getRepository(CarbonEmissionFactor)
      .save(TEST_CARBON_EMISSION_FACTORS);
    service = new CarbonFootprintService(dataSource.getRepository(CarbonEmissionFactor));
    controller = new CarbonFootprintController(service);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const assertedFoodProduct = {
        ingredients: [
          { name: 'ham', quantity: 0.1, unit: 'kg' },
          { name: 'cheese', quantity: 0.15, unit: 'kg' },
          { name: 'tomato', quantity: 0.4, unit: 'kg' },
          { name: 'flour', quantity: 0.7, unit: 'kg' },
          { name: 'oliveOil', quantity: 0.3, unit: 'kg' },
        ]
      };
      const expectFootprint = 0.1 * 0.11 + 0.15 * 0.12 + 0.4 * 0.13 + 0.7 * 0.14 + 0.3 * 0.15;
      jest.spyOn(service, 'computeCarbonEmissionForFoodProduct').mockImplementation(() => Promise.resolve(expectFootprint));

      expect(await controller.computeCarbonFootprint(assertedFoodProduct)).toBe(expectFootprint);
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
});
