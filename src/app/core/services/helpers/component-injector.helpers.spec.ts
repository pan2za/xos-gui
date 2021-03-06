import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import * as $ from 'jquery';
import {XosComponentInjector, IXosComponentInjectorService} from './component-injector.helpers';

let service: IXosComponentInjectorService;
let element, scope: angular.IRootScopeService, compile: ng.ICompileService, $state: ng.ui.IStateService;

describe('The XosComponentInjector service', () => {
  beforeEach(() => {
    angular
      .module('test', ['ui.router'])
      .config((
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider
      ) => {
        $stateProvider
          .state('empty', {
            url: '/empty',
            template: 'empty template',
          })
          .state('home', {
            url: '/',
            component: 'target',
          });
        $urlRouterProvider.otherwise('/');
      })
      .component('extension', {
        template: 'extended'
      })
      .component('target', {
        template: `<div id="target"></div>`
      })
      .service('XosComponentInjector', XosComponentInjector);

    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((
    XosComponentInjector: IXosComponentInjectorService,
  ) => {
    service = XosComponentInjector;
  }));

  beforeEach(angular.mock.inject((
    $rootScope: ng.IRootScopeService,
    $compile: ng.ICompileService,
    _$state_: ng.ui.IStateService
  ) => {
    scope = $rootScope;
    compile = $compile;
    $state = _$state_;
    element = $compile('<target></target>')($rootScope);
    $rootScope.$digest();
  }));

  it('should have an InjectComponent method', () => {
    expect(service.injectComponent).toBeDefined();
  });

  it('should have an removeInjectedComponents method', () => {
    expect(service.removeInjectedComponents).toBeDefined();
  });

  xit('should add a component to the target container', () => {
    service.injectComponent($('#target', element), 'extension');
    scope.$apply();
    const extension = $('extension', element);
    expect(extension.text()).toBe('extended');
  });

  it('should should store an injected components', () => {
    spyOn(service, 'storeInjectedComponent').and.callThrough();
    service.injectComponent($('#target', element), 'extension');
    scope.$apply();
    expect(service['storeInjectedComponent']).toHaveBeenCalled();
    expect(service.injectedComponents.length).toBe(1);
  });
});
