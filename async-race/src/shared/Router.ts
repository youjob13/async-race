import { IRoute, IRouter } from './interfaces/router-model';
import ErrorPage from '../components/ErrorPage/ErrorPage';

class Router implements IRouter {
  private currentPage: HTMLElement;

  constructor(private routes: IRoute[]) {
    this.currentPage = routes[0].component();
  }

  changePath = (path: string): void => {
    window.location.hash = path;
  };

  getHash = (): string => window.location.hash.slice(1);

  routeToPage(): void {
    const currentHash = this.getHash();
    this.currentPage = new ErrorPage().node;

    this.routes.forEach((route) => {
      if (route.path === currentHash) {
        this.currentPage = route.component();
      }
    });
  }

  getCurrentPage(): HTMLElement {
    this.routeToPage();
    return this.currentPage;
  }
}

export default Router;
