import { ServiceContract, ServiceLocator } from '../../../interfaces'
import * as React from 'react'
import { Container, injectable } from 'inversify'
import { Provider } from 'react-redux'
import { ResourceType } from '../../../interfaces'
import { Font } from 'expo';

@injectable()
export class AppBootstrapper extends ServiceContract.Bootstrapper<ServiceContract.ModuleProvider> {
  public static readonly Instance: AppBootstrapper = new AppBootstrapper();

  protected registerModules(): ServiceContract.Module[] | ServiceContract.ModuleProvider {
    const hackedRequire = require;
    let ModuleProvider = undefined;
    try { ModuleProvider = require('../../../../../../module.config').default; } catch{ }
    ModuleProvider = ModuleProvider || hackedRequire(`${process.env.PWD}/module.config`).default;
    return new ModuleProvider();
  }

  public static startup(mainViewType?: new (p, s) => React.Component): Container {
    const container: Container = AppBootstrapper.Instance.start(mainViewType || VirtualApp);
    return container;
  }
}

export class VirtualApp extends React.Component {
  private appContainer;
  private store;
  state = {
    isLoadingComplete: false,
  };

  constructor(props) {
    super(props);
    this.appContainer = AppBootstrapper.Instance.container.get<any>(ResourceType.AppRoot);
    this.store = AppBootstrapper.Instance.container.get<any>(ResourceType.AppStore);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Arial': require('../../../assets/fonts/Arial.ttf'),
    });

    this.setState({ isLoadingComplete: true });
  }

  render() {
    return !this.state.isLoadingComplete ? null : (
      <Provider store={this.store}>
        <this.appContainer />
      </Provider>)
  }
}
