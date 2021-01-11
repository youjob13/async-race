interface IRouter {
  changePath: (path: string) => void;
  getHash: () => string;
  routeToPage: (parentNode: HTMLElement) => void;
}

class Router implements IRouter {
  constructor(private routes: any[]) {}

  changePath = (path: string): void => {
    window.location.hash = path;
  };

  getHash = (): string => window.location.hash.slice(1);

  routeToPage(parentNode: HTMLElement): void {
    const currentHash = this.getHash();
    this.routes.forEach(
      (route) =>
        route.path === currentHash && parentNode?.append(route.component())
    );
  }
}

export default Router;
