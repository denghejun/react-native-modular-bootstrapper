import { ServiceContract } from '../../../interfaces'
import { injectable } from 'inversify'

@injectable()
export class SimpleCalculatorService implements ServiceContract.CalculatorService {
  public add(a: number, b: number): number {
    return a + b;
  }
}
