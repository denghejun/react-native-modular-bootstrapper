import { Module } from './module'

export interface ModuleProvider {
  registerModules(): (new () => Module)[];
}
