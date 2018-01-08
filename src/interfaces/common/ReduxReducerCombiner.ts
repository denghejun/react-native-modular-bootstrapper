import { combineReducers } from 'redux'
import { injectable, inject } from 'inversify'
import { ReduxReducer } from './ReduxReducer'

@injectable()
export abstract class ReduxReducerCombiner {
  constructor(protected readonly action) { }
  protected abstract ProvideReducers(): { [propName: string]: (new (...args) => ReduxReducer) | (new (...args) => ReduxReducerCombiner) };
  public Combine(): any {
    const combinedReducers = {};
    const reducers = this.ProvideReducers();
    for (let key in reducers) {
      if (reducers[key]['Combine']) {
        combinedReducers[key] = reducers[key]['Combine']();
      } else {
        let instance = new reducers[key](this.action);
        if (instance['create']) {
          combinedReducers[key] = instance['create']();
        } else {
          combinedReducers[key] = instance['Combine']();
        }
      }
    }

    return combineReducers(combinedReducers);
  }
}
