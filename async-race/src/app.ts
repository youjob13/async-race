import HeaderContainer from './components/Header/HeaderContainer';
import { IRouter } from './components/shared/interfaces/router-model';
import Router from './components/shared/Router';

class App {
  private router: IRouter = new Router(this.rootElem);

  constructor(private rootElem: HTMLElement) {}

  init(): void {
    this.render();
    this.eventListeners();
  }

  private render(): void {
    this.rootElem.innerHTML = '';
    this.rootElem.append(new HeaderContainer(this.router.changePath).render());
    this.router.routeToPage();
  }

  private eventListeners(): void {
    window.onpopstate = () => this.render();
  }
}

export default App;
