import './styles.scss';
import { IRouter } from './shared/interfaces/router-model';
import Header from './components/Header/Header';
import MainTitle from './shared/templates/MainTitle';

class App {
  constructor(
    private readonly rootElem: HTMLElement,
    private readonly router: IRouter
  ) {}

  initApp(): void {
    this.render();
    this.historyStateListener();
  }

  private render(): void {
    this.rootElem.innerHTML = MainTitle;
    this.rootElem.append(new Header(this.router).node);

    const currentPage = this.router.getCurrentPage();
    this.rootElem.append(currentPage);
  }

  private historyStateListener(): void {
    onpopstate = () => this.render();
  }
}

export default App;
