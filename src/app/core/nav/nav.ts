import './nav.scss';
import {IXosNavigationService, IXosNavigationRoute} from '../services/navigation';
import {IXosAuthService} from '../../datasources/rest/auth.rest';
import {IXosStyleConfig} from '../../../index';

class NavCtrl {
  static $inject = ['$scope', '$state', 'NavigationService', 'AuthService', 'StyleConfig'];
  public routes: IXosNavigationRoute[];
  public navSelected: string;
  public appName: string;
  public payoff: string;

  constructor(
    private $scope: ng.IScope,
    private $state: angular.ui.IStateService,
    private navigationService: IXosNavigationService,
    private authService: IXosAuthService,
    private StyleConfig: IXosStyleConfig
  ) {
    // NOTE we'll need to have:
    // - Base routes (defined from configuration based on BRAND)
    // - Autogenerated routes (nested somewhere)
    // - Service Routes (dynamically added)
    this.routes = [];
    this.$scope.$watch(() => this.navigationService.query(), (routes) => {
      this.routes = routes;
    });
    this.appName = this.StyleConfig.projectName;
    this.payoff = this.StyleConfig.payoff;
  }

  activateRoute(route: IXosNavigationRoute) {
    this.navSelected = route.state;
  }

  includes(state: string): boolean {
    return this.$state.includes(state);
  }

  isSelected(navId: string, navSelected: string) {
    const activeRoute = this.$state.current.name;
    const separateRoutes = activeRoute.split('.');

    if (!navSelected) {
      navSelected = separateRoutes[1];
    }

    if (navId === navSelected) {
      return false;
    }
    else if (this.$state.current.name.indexOf(navId) === -1 && navId === navSelected ) {
      return false;
    }
    else {
      return true;
    }
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.$state.go('login');
      });
  }
}

export const xosNav: angular.IComponentOptions = {
  template: require('./nav.html'),
  controllerAs: 'vm',
  controller: NavCtrl
};
