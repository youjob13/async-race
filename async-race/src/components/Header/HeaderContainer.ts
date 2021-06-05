import { IHeaderContainer } from '../shared/interfaces/header-model';
import Header from './Header';

class HeaderContainer implements IHeaderContainer {
  constructor(private changePath: (path: string) => void) {}

  private changePage = (path: string): void => {
    this.changePath(path);
  };

  render(hash: string): HTMLElement {
    return new Header(
      { tagName: 'header', classes: ['header'] },
      this.changePage
    ).render(hash);
  }
}

export default HeaderContainer;
