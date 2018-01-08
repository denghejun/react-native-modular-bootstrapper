import { combineReducers } from 'redux'
import { injectable, inject } from 'inversify'
import { ReduxReducer } from './ReduxReducer'

@injectable()
export abstract class ReduxReducerCombiner {
  constructor(protected readonly action) { }
  protected abstract ProvideReducers(): { [propName: string]: (new (...args) => ReduxReducer) | (new (...args) => ReduxReducerCombiner) | ReduxReducerCombiner };
  public Combine(): any {
    const combinedReducers = {};
    const reducers = this.ProvideReducers();
    for (let key in reducers) {
      if (reducers[key] instanceof ReduxReducerCombiner) {
        combinedReducers[key] = reducers[key]['Combine']();
      } else {
        const instanceType: any = reducers[key];
        let instance = new instanceType(this.action);
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
