import { carState } from './components/state/carState';
import './normalize.css';
import App from './app';
import GarageService from './components/services/GarageService';

const garageService = new GarageService();

const rootElem: HTMLElement | null = document.getElementById('app');
if (!rootElem) throw new Error('Root elem is not defined');
const app = new App(rootElem, garageService);
app.init();
