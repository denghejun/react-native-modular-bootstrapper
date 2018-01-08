import * as React from 'react'
import { connect, InferableComponentEnhancer, Dispatch, DispatchProp, Component } from 'react-redux'
import { injectable, Container } from 'inversify'

export interface ReduxViewContainerProvider {
  [propName: string]: new (...args: any[]) => ReduxViewContainer<any>;
}

@injectable()
export abstract class ReduxViewContainer<TView extends React.Component> {
  constructor(protected view: (new (p, c) => TView)) {
  }

  protected abstract MapStateToProps(initialState: any, ownProps: any): any;
  protected abstract MapDispatchToProps(dispatch: Dispatch<any>, ownProps: any): any;
  public create() {
    return connect(this.MapStateToProps.bind(this), this.MapDispatchToProps.bind(this))(this.view);
  }

  private static registerReduxContainerConnected(container: Container,
    reduxViewContainer: new (...args: any[]) => ReduxViewContainer<any>,
    registerReduxContainerConnectedType: symbol): void {
    container.bind(registerReduxContainerConnectedType).toDynamicValue(context => {
      return context.container.getNamed<ReduxViewContainer<any>>(reduxViewContainer.name + '_', reduxViewContainer.name).create();
    });
  }

  private static registerReduxContainersConnected(container: Container,
    reduxViewContainerProvider: ReduxViewContainerProvider,
    registerReduxContainerConnectedType: symbol): void {
    container.bind(registerReduxContainerConnectedType).toDynamicValue(context => {
      const combinedConnectedContainer = {};
      for (let key in reduxViewContainerProvider) {
        combinedConnectedContainer[key] = context.container.getNamed<ReduxViewContainer<any>>(reduxViewContainerProvider[key].name + '_', reduxViewContainerProvider[key].name).create();
      }

      return combinedConnectedContainer;
    });
  }

  private static registerOriginalReduxContainer(container: Container,
    reduxViewContainer: new (...args: any[]) => ReduxViewContainer<any>): void {
    container.bind<ReduxViewContainer<any>>(reduxViewContainer.name + '_').to(reduxViewContainer).whenTargetNamed(reduxViewContainer.name);
  }

  public static registerReduxViewContainer(container: Container,
    reduxViewContainer: new (...args: any[]) => ReduxViewContainer<any>,
    registerReduxContainerConnectedType: symbol): void {
    this.registerOriginalReduxContainer(container, reduxViewContainer);
    this.registerReduxContainerConnected(container, reduxViewContainer, registerReduxContainerConnectedType);
  }

  public static registerReduxViewContainers(container: Container,
    reduxViewContainerProvider: ReduxViewContainerProvider,
    registerReduxContainerConnectedType: symbol): void {
    for (let key in reduxViewContainerProvider) {
      this.registerOriginalReduxContainer(container, reduxViewContainerProvider[key]);
    }

    this.registerReduxContainersConnected(container, reduxViewContainerProvider, registerReduxContainerConnectedType);
  }
}
