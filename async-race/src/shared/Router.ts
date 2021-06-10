import { IRoute, IRouter } from './interfaces/router-model';
import Garage from '../components/Garage/Garage';
import Winners from '../components/Winners/Winners';

class Router implements IRouter {
  private routes: IRoute[];

  constructor(private store: any) {
    this.routes = [
      {
        path: '',
        component: (): HTMLElement => {
          return new Garage(this.store).node;
        },
      },
      {
        path: 'garage',
        component: (): HTMLElement => {
          return new Garage(this.store).node;
        },
      },
      {
        path: 'winners',
        component: (): HTMLElement => {
          return new Winners({
            tagName: 'main',
            classes: ['winners'],
          }).node;
        },
      },
    ];
  }

  changePath = (path: string): void => {
    window.location.hash = path;
  };

  getHash = (): string => window.location.hash.slice(1);

  routeToPage(): HTMLElement | '404 error' {
    const currentHash = this.getHash();
    let currentPage: HTMLElement | '404 error' = '404 error'; // TODO: realise 404 page

    this.routes.forEach((route) => {
      if (route.path === currentHash) {
        currentPage = route.component();
      }
    });

    return currentPage;
  }
}

export default Router;
