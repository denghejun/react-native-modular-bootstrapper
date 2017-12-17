import * as React from 'react'
import { connect, InferableComponentEnhancer, Dispatch, DispatchProp, Component } from 'react-redux'
import { injectable } from 'inversify'

@injectable()
export abstract class ReduxViewContainer<TView extends React.Component> {
  protected readonly View: (new (p, c) => TView);
  constructor(view: (new (p, c) => TView)) {
    this.View = view;
  }

  protected abstract MapStateToProps(initialState: any, ownProps: any): any;
  protected abstract MapDispatchToProps(dispatch: Dispatch<any>, ownProps: any): any;
  public create() {
    return connect(this.MapStateToProps.bind(this), this.MapDispatchToProps.bind(this))(this.View);
  }
}
