# [React Native Modular Bootstrapper](https://github.com/denghejun/react-native-modular-bootstrapper.git) &middot;[![npm version](https://badge.fury.io/js/react-native-modular-bootstrapper.svg)](https://badge.fury.io/js/react-native-modular-bootstrapper)

[![NPM](https://nodei.co/npm-dl/react-native-modular-bootstrapper.png?months=9&height=3)](https://nodei.co/npm/react-native-modular-bootstrapper/)

[![NPM](https://nodei.co/npm/react-native-modular-bootstrapper.png?downloads=true&downloadRank=true)](https://nodei.co/npm/react-native-modular-bootstrapper/)

[![logo](https://raw.githubusercontent.com/denghejun/react-native-modular-bootstrapper/master/src/image/logo3.png)](http://denghejun.github.io)

One useful modular development framework depends on Ioc, Expo and TypeScript for react native.

Please feel free to give me your star on my [react-native-modular-bootstrapper repository](https://github.com/denghejun/react-native-modular-bootstrapper) if you like it and want to let more people know. I will continue working on this package to make it better as well. Thanks!

## You Will Get From This Documentation

- [What is Modular Programing](#what-is-modular-programing)
- [What is High Cohesion and Low Coupling](#what-is-high-cohesion-and-low-coupling)
- [How your app will look like if you choose this](#how-your-app-will-look-like-if-you-choose-this)
- [Install](#install)
- [Getting Started](#getting-started)
  - [1. Define Your Services](#1define-your-services)
  - [2. Define Your Modules](#2define-your-modules)
  - [3. Define Your Module Provider Configuration](#3define-your-module-provider-configuration)
  - [4. Use it](#4use-it)
- [Extra](#extra)
- [BSD 3-Clause License](#bsd-3-clause-license)

## What is Modular Programing

Modular always be a better choice whatever you're programing for. A complex application always need some dependences (e.g. a movie app may depend on a movie search service). And different kinds of dependences will like a mess of porridge once you stop managing. Basically, I have an idea to manage them, that maybe `Modular`.

## What is High Cohesion and Low Coupling
One kind of dependence should be in one `Module`. Naturally, one app should have different kinds of `Module`(s).

- For one `app`, the only thing you need to do is just tell to `app` which modules should be loaded while `startup`.
- For each `module`, the only thing you need to do is just tell to `module` which services (or dependences) should be exported or registered to use by app.


The exciting thing is after you've provided all modules and all services which each module has, the app will load all modules automatically. Then all registered services (or dependences) will be stored in a memory `Container`. It means you can call any service which exports from or register by any module anywhere from the `Container` rather than call the services (or dependences) directly. That is high cohesion and low coupling.

## How your app will look like if you choose this
*Just a short and small code snapshot here.*
In your app's main (or entry) script file (e.g.: `index.ios.js`):

```
import { AppBootstrapper } from 'react-native-modular-bootstrapper'
import { App } from './App.tsx'

AppBootstrapper.startup(App); // 'App' will be your root view of react native component

```

And then you can call any service anywhere. e.g:

```
import { Container } from 'react-native-modular-bootstrapper'
import { CalculatorService, LOCATOR_CALCULATOR } from './calculator-service-interface'

const a = 100, b = 200;
const service = Container.get<CalculatorService>(LOCATOR_CALCULATOR.CALCULATOR);
const result = service.add(a, b); // 'result' will be 300

```

## Install
To use this package, you need to install package `inversify` at the same time (see below).
```
npm install --save react-native-modular-bootstrapper inversify
```
To make it works you should make sure you have options below in your `tsconfig.json`.
```
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}

```

## Getting Started

Please make sure you are using `TypeScript`, `expo` before we go.
### 1.Define Your Services
The services which will be used somewhere in the future. So we should write some codes to tell how it works. e.g. I will define a very simple calculator service here.
```
// calculator-service-interface.ts

export interface CalculatorService {
  add(a: number, b: number): number;
}

export const LOCATOR_CALCULATOR = {
  CALCULATOR: Symbol('CALCULATOR') // this locator is used to register service, just like one unique id for one service.
}
```

```
// calculator-service.ts

import { injectable } from 'inversify'
import { CalculatorService } from './calculator-service-interface'

@injectable()
export class SimpleCalculatorService implements CalculatorService {
  public add(a: number, b: number): number {
    return a + b;
  }
}

```

### 2.Define Your Modules
In fact, you will have more modules. But we just define one module here,
let us give it a name with `ServicesModule`. It means this module will provide different kinds of services to app to use.

```
// ServicesModule.ts

import { injectable, Container } from 'inversify'
import { ServiceContract } from 'react-native-modular-bootstrapper'
import { CalculatorService, LOCATOR_CALCULATOR } from './calculator-service-interface'
import { SimpleCalculatorService } from './calculator-service'

@injectable()
export class ServicesModule implements ServiceContract.Module {
  public load(container: Container): void {
    // register any services you want to export from the module 'ServicesModule'.
    container.bind<CalculatorService>(LOCATOR_CALCULATOR.CALCULATOR).to(SimpleCalculatorService);

    // continue to bind other services here if you want ... ...
  }
}

```

### 3.Define Your Module Provider Configuration
To let app knows which modules it has, you need to create a new TypeScript file named `module.config.ts` (must be this name) under your app root path (where the `package.json` file in). It will be read automatically.

```
// module.config.ts

import { ServicesModule } from './ServicesModule'
import { ServiceContract } from 'react-native-modular-bootstrapper'

export default class AppModuleProvider implements ServiceContract.ModuleProvider {
  public registerModules(): any[] {
    return [ServicesModule]; // this is an array of all your modules.
  }
}

```

### 4.Use it
In your app's main (or entry) script file (e.g.: `index.ios.js`):

```
import { AppBootstrapper } from 'react-native-modular-bootstrapper'
import { App } from './App.tsx'

AppBootstrapper.startup(App); // 'App' will be your root view of react native component

```

And then you can call any service anywhere. e.g:

```
import { Container } from 'react-native-modular-bootstrapper'
import { CalculatorService, LOCATOR_CALCULATOR } from './calculator-service-interface'

const a = 100, b = 200;
const service = Container.get<CalculatorService>(LOCATOR_CALCULATOR.CALCULATOR);
const result = service.add(a, b); // 'result' will be 300

```

## Extra

if you want to use it in your unit tests. e.g. I will test the `CalculatorService` in my `jest` unit test.

```
// calculator-service.spec.ts

import { AppBootstrapper, Container } from 'react-native-modular-bootstrapper'
import { CalculatorService, LOCATOR_CALCULATOR } from './calculator-service-interface'

beforeAll(() => {
  AppBootstrapper.startup(null);
});

it('[calculator-service : 01] should get right result 300.', async () => {
  // given
  const a = 100, b = 200;

  // when
  const service = Container.get<CalculatorService>(LOCATOR_CALCULATOR.CALCULATOR);
  const result = service.add(a, b);

  // then
  expect(result).toBe(300);
})

```


#### BSD 3-Clause License

Copyright (c) 2017, ColorfulWindmill
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
