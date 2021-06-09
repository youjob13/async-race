import { IPage } from './interfaces/page-model';
import { IRoute, IRouter } from './interfaces/router-model';
import WinnersContainer from '../Winners/WinnersContainer';
import Garage from '../Garage/Garage';

class Router implements IRouter {
  private routes: IRoute[];

  constructor(private store: any) {
    this.routes = [
      {
        path: '',
        component: (): IPage => {
          return new Garage(this.store);
        },
      },
      {
        path: 'garage',
        component: (): IPage => {
          return new Garage(this.store);
        },
      },
      {
        path: 'winners',
        component: (): IPage => {
          return new WinnersContainer();
        },
      },
    ];
  }

  changePath = (path: string): void => {
    window.location.hash = path;
  };

  getHash = (): string => window.location.hash.slice(1);

  routeToPage(): IPage | '404 error' {
    const currentHash = this.getHash();
    let currentPage: IPage | '404 error' = '404 error';

    this.routes.forEach((route) => {
      if (route.path === currentHash) {
        currentPage = route.component();
      }
    });

    return currentPage;
  }
}

export default Router;
