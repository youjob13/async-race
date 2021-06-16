import { Store } from 'redux';
import './styles.scss';
import { IRouter } from './shared/interfaces/router-model';
import Router from './shared/Router';
import Header from './components/Header/Header';

class App {
  private router: IRouter;

  constructor(private rootElem: HTMLElement, private store: Store) {
    this.router = new Router(this.store);
  }

  init(): void {
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
