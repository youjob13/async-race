export interface IRouter {
  changePath: (path: string) => void;
  getHash: () => string;
  routeToPage: () => void;
  getCurrentPage: () => HTMLElement;
}

export interface IRoute {
  path: string;
  component: () => HTMLElement;
}
