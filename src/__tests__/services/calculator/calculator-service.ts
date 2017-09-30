import { AppBootstrapper, Container, ServiceLocator, ServiceContract } from '../../../../index'

beforeAll(() => {
  AppBootstrapper.startup(null);
});

it('[calculator-service : 01] should get right result.', async () => {
  // given
  const a = 100, b = 200;

  // when
  const service = Container.get<ServiceContract.CalculatorService>(ServiceLocator.LOCATOR_CALCULATOR.CALCULATOR);
  const result = service.add(a, b)

  // then
  expect(result).toBe(300);
})
