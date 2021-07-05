import './styles.scss';
import { IRouter } from './shared/interfaces/router-model';
import Header from './components/Header/Header';
import { HeaderClasses, Tag } from './shared/variables';
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
    this.rootElem.append(
      new Header(
        { tagName: Tag.HEADER, classes: [HeaderClasses.HEADER] },
        this.router
      ).node
    );

    const currentPage = this.router.getCurrentPage(); // TODO: ask Ivan
    this.rootElem.append(currentPage);
  }

  private historyStateListener(): void {
    onpopstate = () => this.render();
  }
}

export default App;
