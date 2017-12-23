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
    originalReduxContainerConnectedType: symbol,
    registerReduxContainerConnectedType: symbol): void {
    container.bind(registerReduxContainerConnectedType).toDynamicValue(context => {
      return context.container.get<ReduxViewContainer<any>>(originalReduxContainerConnectedType).create();
    });
  }

  private static registerOriginalReduxContainer(container: Container,
    originalReduxContainerConnectedType: symbol,
    reduxViewContainer: new (...args: any[]) => ReduxViewContainer<any>): void {
    container.bind<ReduxViewContainer<any>>(originalReduxContainerConnectedType).to(reduxViewContainer);
  }

  public static registerReduxViewContainer(container: Container,
    reduxViewContainer: new (...args: any[]) => ReduxViewContainer<any>,
    originalReduxContainerConnectedType: symbol,
    registerReduxContainerConnectedType: symbol): void {
    this.registerOriginalReduxContainer(container, originalReduxContainerConnectedType, reduxViewContainer);
    this.registerReduxContainerConnected(container, originalReduxContainerConnectedType, registerReduxContainerConnectedType);
  }
}
