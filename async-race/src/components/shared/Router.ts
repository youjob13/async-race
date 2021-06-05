import Garage from '../Garage/Garage';
import Winners from '../Winners/Winners';
import { IRoute, IRouter } from './interfaces/router-model';

class Router implements IRouter {
  private routes: IRoute[];
  constructor(private rootElem: HTMLElement) {
    this.routes = [
      {
        path: '',
        component: (): HTMLElement => {
          return new Garage({ tagName: 'div', classes: ['garage'] }).render();
        },
      },
      {
        path: 'garage',
        component: (): HTMLElement => {
          return new Garage({ tagName: 'div', classes: ['garage'] }).render();
        },
      },
      {
        path: 'winners',
        component: (): HTMLElement => {
          return new Winners({ tagName: 'div', classes: ['winners'] }).render();
        },
      },
    ];
  }

  changePath = (path: string): void => {
    window.location.hash = path;
  };

  getHash = (): string => window.location.hash.slice(1);

  routeToPage(): void {
    const currentHash = this.getHash();
    this.routes.forEach((route) => {
      route.path === currentHash && this.rootElem.append(route.component());
    });
  }
}

export default Router;
