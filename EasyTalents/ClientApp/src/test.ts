// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { getBaseUrl } from './main';
import { destroyPlatform } from '@angular/core';
import { MockAppModule, MockAppRootComponent } from './app/mock-data';

declare const require: any;

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
]

// Destroy the current platform created in main.ts with platformBrowserDynamic() to avoid conflict with the test platform created bellow
destroyPlatform();
// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(providers)
);

// Then we find all the tests.
// const context = require.context('./', true, /\.spec\.ts$/);
 const context = require.context('./', true, /details\.component\.spec\.ts$/);
// And load the modules.
context.keys().map(context);