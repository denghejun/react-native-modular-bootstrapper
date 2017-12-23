import { injectable, inject } from 'inversify'
import { ResourceType } from './ResourceType'
import { Middleware, Store, createStore, applyMiddleware } from 'redux'
import { handleActions } from 'redux-actions'

@injectable()
export abstract class ReduxReducer {
  constructor(protected action: any) { }
  protected abstract ProvideInitState(): any;
  protected abstract ProvideActionHandler(): any;
  public create(): any {
    return handleActions(this.ProvideActionHandler(), this.ProvideInitState());
  }
}
