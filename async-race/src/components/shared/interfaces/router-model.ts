export interface IRouter {
  changePath: (path: string) => void;
  getHash: () => string;
  routeToPage: () => void;
}

export interface IRoute {
  path: string;
  component: () => HTMLElement;
}
