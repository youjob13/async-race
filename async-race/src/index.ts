import './normalize.css';
import App from './app';

const rootElem: HTMLElement | null = document.getElementById('app');

const app = new App();
app.render();
