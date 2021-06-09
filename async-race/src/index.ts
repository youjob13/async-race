import './normalize.css';
import App from './app';
import store from './store/store';

const rootElem: HTMLElement | null = document.getElementById('app');
if (!rootElem) throw new Error('Root elem is not defined');
const app = new App(rootElem, store);
app.init();
