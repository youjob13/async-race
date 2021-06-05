import HeaderContainer from './components/Header/HeaderContainer';
import { IRouter } from './components/shared/interfaces/router-model';
import Router from './components/shared/Router';
import { IGarageService } from './components/services/GarageService';

class App {
  private router: IRouter;

  constructor(
    private rootElem: HTMLElement,
    private garageService: IGarageService
  ) {
    this.router = new Router(this.garageService);
  }

  init(): void {
    this.render();
    this.eventListeners();
  }

  private render(): void {
    this.rootElem.innerHTML = '';
    this.rootElem.append(new HeaderContainer(this.router.changePath).render());
    const currentPage = this.router.routeToPage();
    this.rootElem.append(currentPage.render());
  }

  private eventListeners(): void {
    window.onpopstate = () => this.render();
  }
}

export default App;
