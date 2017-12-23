import { combineReducers } from 'redux'
import { injectable, inject } from 'inversify'

@injectable()
export abstract class ReduxReducerCombiner {
  protected abstract ProviderChildrenReducer(): any;
  public Combine(): any {
    return combineReducers(this.ProviderChildrenReducer());
  }
}
