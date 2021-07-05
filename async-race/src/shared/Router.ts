import { Store } from 'redux';
import { IRoute, IRouter } from './interfaces/router-model';
import Garage from '../components/Garage/Garage';
import Winners from '../components/Winners/Winners';

class Router implements IRouter {
  constructor(private routes: IRoute[]) {}

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
