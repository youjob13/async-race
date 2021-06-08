import { Store } from 'redux';
import { IRouter } from './components/shared/interfaces/router-model';
import { ICarServices } from './components/services/CarServices';
import { getAllCarsTC } from './components/store';
import './styles.scss';
import Router from './components/shared/Router';
import HeaderContainer from './components/Header/HeaderContainer';

class App {
  private router: IRouter;

  constructor(
    private rootElem: HTMLElement,
    private carService: ICarServices,
    private store: Store
  ) {
    this.router = new Router(this.carService, this.store);
  }

  init(): void {
    this.store.subscribe(() => this.render());
    this.store.dispatch(<any>getAllCarsTC());
    // this.render();
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
