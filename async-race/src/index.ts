import './normalize.css';
import App from './app';
import Garage from './components/Garage/Garage';
import Winners from './components/Winners/Winners';
import store from './store/store';
import Router from './shared/Router';
import { ErrorContent, RootElemId, Route } from './shared/variables';
import { RootElem } from './shared/interfaces/api-models';

const routes = [
  {
    path: Route.ROOT,
    component: (): HTMLElement => new Garage(store).node,
  },
  {
    path: Route.GARAGE,
    component: (): HTMLElement => new Garage(store).node,
  },
  {
    path: Route.WINNERS,
    component: (): HTMLElement => new Winners(store).node,
  },
];
const rootElem: RootElem = document.getElementById(RootElemId);

const router = new Router(routes);

if (!rootElem) {
  throw new Error(ErrorContent.APP_INIT);
}

const app = new App(rootElem, router);
app.initApp();
