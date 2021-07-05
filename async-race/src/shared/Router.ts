import { IRoute, IRouter } from './interfaces/router-model';

class Router implements IRouter {
  private currentPage: HTMLElement | '404 error';

  constructor(private routes: IRoute[]) {
    this.currentPage = routes[0].component();
  }

  changePath = (path: string): void => {
    window.location.hash = path;
  };

  getHash = (): string => window.location.hash.slice(1);

  routeToPage(): void {
    const currentHash = this.getHash();
    this.currentPage = '404 error'; // TODO: realise 404 page

    this.routes.forEach((route) => {
      if (route.path === currentHash) {
        this.currentPage = route.component();
      }
    });
  }

  getCurrentPage(): HTMLElement | '404 error' {
    this.routeToPage();
    return this.currentPage;
  }
}

export default Router;
