import { IRouter } from './shared/interfaces/router-model';
import './styles.scss';
import Router from './shared/Router';
import { getAllCarsTC } from './store/carsSlice';
import Header from './components/Header/Header';

class App {
  private router: IRouter;

  constructor(private rootElem: HTMLElement, private store: any) {
    this.router = new Router(this.store);
  }

  init(): void {
    this.store.dispatch(getAllCarsTC());
    this.render();
    this.eventListeners();
  }

  private render(): void {
    this.rootElem.innerHTML = '<h1 class="h1-title">Async Race</h1>';
    this.rootElem.append(
      new Header(
        { tagName: 'header', classes: ['header'] },
        this.router.changePath,
        this.router.getHash()
      ).node
    );

    const currentPage = this.router.routeToPage();
    this.rootElem.append(currentPage);
  }

  private eventListeners(): void {
    window.onpopstate = () => this.render();
  }
}

export default App;
