import './header.scss';
import { IPropsToBaseControl } from '../shared/interfaces/api';
import BaseControl from '../shared/BaseControl/BaseControl';
import Button from '../shared/Button/Button';

class Header extends BaseControl<HTMLElement> {
  constructor(
    propsToBaseControl: IPropsToBaseControl,
    private changePage: (path: string) => void
  ) {
    super(propsToBaseControl);
  }

  private handleClick = (e: Event): void => {
    e.preventDefault();
    const target = <HTMLAnchorElement>e.target;
    this.changePage(target.getAttribute('href') || '');
  };

  render(hash: string): HTMLElement {
    const buttonsWrapper = new BaseControl({
      tagName: 'div',
      classes: ['header__buttons-wrapper'],
    });

    const buttonToWinnersPage = new Button(
      {
        tagName: 'a',
        classes: ['header__button', 'button'],
        text: 'Winners',
        attributes: { href: 'winners' },
      },
      this.handleClick
    );

    const buttonToGaragePage = new Button(
      {
        tagName: 'a',
        classes: ['header__button', 'button'],
        text: 'Garage',
        attributes: { href: 'garage' },
      },
      this.handleClick
    );

    switch (hash) {
      case 'garage': {
        buttonToGaragePage.node.classList.add('active');
        break;
      }
      case '': {
        buttonToGaragePage.node.classList.add('active');
        break;
      }
      case 'winners': {
        buttonToWinnersPage.node.classList.add('active');
        break;
      }
      default: {
        break;
      }
    }

    buttonsWrapper.node.append(
      buttonToWinnersPage.node,
      buttonToGaragePage.node
    );
    this.node.append(buttonsWrapper.node);
    return this.node;
  }
}

export default Header;
