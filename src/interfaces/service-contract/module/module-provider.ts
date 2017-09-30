import { Module } from './module'

export interface ModuleProvider {
  registerModules(): any[];
}
