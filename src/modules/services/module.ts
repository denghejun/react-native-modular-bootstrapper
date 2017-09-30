import { injectable, Container } from 'inversify'
import { ServiceContract, ServiceLocator } from '../../interfaces'
import { SimpleCalculatorService } from './index'

@injectable()
export class ServiceModule implements ServiceContract.Module {
  public load(container: Container): void {
    // register any services you want to export from the module 'ServiceModule'.
    container.bind<ServiceContract.CalculatorService>(ServiceLocator.LOCATOR_CALCULATOR.CALCULATOR).to(SimpleCalculatorService);

    // continue to bind other services here if you want ... ...
  }
}
