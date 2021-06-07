import './normalize.css';
import App from './app';
import GarageService from './components/services/GarageService';
import Observer from './components/shared/Observer';

const newCarObserver = new Observer();
export default newCarObserver;

const garageService = new GarageService();

const rootElem: HTMLElement | null = document.getElementById('app');
if (!rootElem) throw new Error('Root elem is not defined');
const app = new App(rootElem, garageService, newCarObserver);
app.init();
