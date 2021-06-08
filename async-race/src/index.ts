import './normalize.css';
import App from './app';
import CarServices, { ICarServices } from './components/services/CarServices';
import { store } from './components/store';

const carService: ICarServices = new CarServices();

const rootElem: HTMLElement | null = document.getElementById('app');
if (!rootElem) throw new Error('Root elem is not defined');
const app = new App(rootElem, carService, store);
app.init();
