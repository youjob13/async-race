import './styles.scss';
import { IGarageService } from './components/services/GarageService';
import { IRouter } from './components/shared/interfaces/router-model';
import { IObserver } from './components/shared/Observer';
import Router from './components/shared/Router';
import HeaderContainer from './components/Header/HeaderContainer';
import { ICarServices } from './components/services/CarServices';

class App {
  private router: IRouter;

  constructor(
    private rootElem: HTMLElement,
    private garageService: IGarageService,
    private newCarObserver: IObserver,
    private carService: ICarServices
  ) {
    this.router = new Router(
      this.garageService,
      this.newCarObserver,
      this.carService
    );
  }

  init(): void {
    this.newCarObserver.subscribe(this.render.bind(this));
    this.render();
    this.eventListeners();
  }

  private render(): void {
    this.rootElem.innerHTML = '<h1 class="h1-title">Async Race</h1>';
    this.rootElem.append(
      new HeaderContainer(this.router.changePath).render(this.router.getHash())
    );
    const currentPage = this.router.routeToPage();
    this.rootElem.append(currentPage.render());
  }

  private eventListeners(): void {
    window.onpopstate = () => this.render();
  }
}

export default App;
