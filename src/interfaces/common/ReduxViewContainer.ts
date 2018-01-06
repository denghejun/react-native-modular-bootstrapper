import * as React from 'react'
import { connect, InferableComponentEnhancer, Dispatch, DispatchProp, Component } from 'react-redux'
import { injectable, Container } from 'inversify'

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
}
