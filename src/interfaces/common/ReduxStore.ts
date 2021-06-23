import { injectable, inject } from "inversify"
import { ResourceType } from './ResourceType'
import { Middleware, Store, createStore, applyMiddleware } from 'redux'

@injectable()
export abstract class ReduxStore {
  constructor( @inject(ResourceType.AppReducer) protected reducer) { }
  protected abstract ProvideMiddleware(): Middleware[];
  public create(): Store<any> {
    return createStore(this.reducer, applyMiddleware(...this.ProvideMiddleware()));
  }
}
