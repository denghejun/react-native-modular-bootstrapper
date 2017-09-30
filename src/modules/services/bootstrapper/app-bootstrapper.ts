import { ServiceContract, ServiceLocator } from '../../../interfaces'
import * as React from 'react'
import { Container, injectable } from 'inversify'
import ModuleProvider from '../../../../../../module.config'

@injectable()
export class AppBootstrapper extends ServiceContract.Bootstrapper<ServiceContract.ModuleProvider> {
  public static readonly Instance: AppBootstrapper = new AppBootstrapper();

  protected registerModules(): ServiceContract.Module[] | ServiceContract.ModuleProvider {
    return new ModuleProvider();
  }

  public static startup(mainViewType: new () => React.Component): Container {
    const container: Container = AppBootstrapper.Instance.start(mainViewType);
    return container;
  }
}
