import './normalize.css';
import App from './app';
import GarageService, {
  IGarageService,
} from './components/services/GarageService';
import Observer from './components/shared/Observer';
import CarServices, { ICarServices } from './components/services/CarServices';

const newCarObserver = new Observer();
export default newCarObserver;

const garageService: IGarageService = new GarageService();
const carService: ICarServices = new CarServices();

const rootElem: HTMLElement | null = document.getElementById('app');
if (!rootElem) throw new Error('Root elem is not defined');
const app = new App(rootElem, garageService, newCarObserver, carService);
app.init();
