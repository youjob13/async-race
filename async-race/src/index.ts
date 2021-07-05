import './normalize.css';
import App from './app';
import Garage from './components/Garage/Garage';
import Winners from './components/Winners/Winners';
import store from './store/store';
import Router from './shared/Router';

const routes = [
  {
    path: '',
    component: (): HTMLElement => {
      return new Garage(store).node;
    },
  },
  {
    path: 'garage',
    component: (): HTMLElement => {
      return new Garage(store).node;
    },
  },
  {
    path: 'winners',
    component: (): HTMLElement => {
      return new Winners(store).node;
    },
  },
];

const router = new Router(routes);

const rootElem: HTMLElement | null = document.getElementById('app');
if (!rootElem) throw new Error('Root elem is not defined');

const app = new App(rootElem, router);
app.init();
