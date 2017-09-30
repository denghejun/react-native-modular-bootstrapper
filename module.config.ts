import { ServiceContract, ServiceLocator } from './src/interfaces'
import { ServiceModule } from './src/modules/'
import { Container } from 'inversify'

export default class AppModuleProvider implements ServiceContract.ModuleProvider {
  public registerModules(): any[] {
    return [ServiceModule];
  }
}
