import { Container } from 'inversify'

export interface Module {
  load(container: Container): void;
}
