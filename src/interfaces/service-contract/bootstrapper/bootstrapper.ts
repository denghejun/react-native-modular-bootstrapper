import "reflect-metadata"
import { Container, inject, injectable } from 'inversify'
import { ServiceLocator, ServiceContract } from '../../index'
import * as React from 'react'
import * as Expo from 'expo'

@injectable()
export abstract class Bootstrapper<T extends ServiceContract.ModuleProvider> {
  protected moduleProvider: T;
  public readonly container: Container = new Container();
  protected modules: any[];
  protected abstract registerModules(): ServiceContract.Module[] | T;

  protected loadModules(moduleType: symbol): void {
    if (this.container != null) {
      const modules: ServiceContract.Module[] = this.container.getAll<ServiceContract.Module>(moduleType);
      if (modules != null) {
        for (let module of modules) {
          module.load(this.container);
        }
      }
    }
  }

  protected _registerModules() {
    const m = this.registerModules();
    if ('registerModules' in m) {
      this.moduleProvider = m as T;
      this.modules = this.moduleProvider.registerModules();
    }
    else {
      this.modules = m as ServiceContract.Module[];
    }

    if (this.modules != null && this.container != null) {
      for (let module of this.modules) {
        this.container.bind<ServiceContract.Module>(ServiceLocator.LOCATOR_MODULE.MODULE).to(module);
      }
    }
  }

  protected initModules() {
    this._registerModules();
    this.loadModules(ServiceLocator.LOCATOR_MODULE.MODULE);
  }

  protected registerOthers(container: Container): void {
    container.bind<ServiceContract.Bootstrapper<T>>(ServiceLocator.LOCATOR_BOOTSTRAPPER.BOOTSTRAPPER).toConstantValue(this);
  }

  public start(mainViewType: new () => React.Component): Container {
    this.initModules();
    this.registerOthers(this.container);
    Expo.registerRootComponent(mainViewType);
    return this.container;
  }
}
