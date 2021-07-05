import './header.scss';
import { IPropsToBaseControl } from '../../shared/interfaces/api-models';
import BaseControl from '../../shared/templates/BaseControl/BaseControl';
import Button from '../../shared/templates/Button/Button';
import {
  Attribute,
  ButtonClass,
  EmptyString,
  HeaderClasses,
  Route,
  Tag,
} from '../../shared/variables';
import { IRouter } from '../../shared/interfaces/router-model';

class Header extends BaseControl<HTMLElement> {
  constructor(
    propsToBaseControl: IPropsToBaseControl,
    private readonly router: IRouter
  ) {
    super(propsToBaseControl);
    this.render();
  }

  private onPageToggleClick = (event: Event): void => {
    // TODO: ask Ivan (почему header должен знать)
    event.preventDefault();
    const target = <HTMLAnchorElement>event.target;
    this.router.changePath(target.getAttribute(Attribute.HREF) || Route.ROOT);
  };

  render(): void {
    this.node.innerHTML = EmptyString;

    const stylesGarageButton = // TODO: ask Ivan
      this.router.getHash() === Route.GARAGE ||
      this.router.getHash() === Route.ROOT
        ? [HeaderClasses.BUTTON, HeaderClasses.BUTTON_ACTIVE, ButtonClass]
        : [HeaderClasses.BUTTON, ButtonClass];

    const stylesWinnersButton =
      this.router.getHash() === Route.WINNERS
        ? [HeaderClasses.BUTTON, HeaderClasses.BUTTON_ACTIVE, ButtonClass]
        : [HeaderClasses.BUTTON, ButtonClass];

    const headerButtons = [
      new Button(
        {
          tagName: Tag.A,
          classes: stylesWinnersButton,
          text: 'Winners',
          attributes: { href: 'winners' },
        },
        this.onPageToggleClick
      ),
      new Button(
        {
          tagName: Tag.A,
          classes: stylesGarageButton,
          text: 'Garage',
          attributes: { href: 'garage' },
        },
        this.onPageToggleClick
      ),
    ]; // TODO: ask Ivan

    const buttonsWrapper = new BaseControl({
      tagName: Tag.DIV,
      classes: [HeaderClasses.BUTTONS_WRAP],
    });

    buttonsWrapper.node.append(
      ...headerButtons.map((headerButton) => headerButton.node)
    );
    this.node.append(buttonsWrapper.node);
  }
}

export default Header;
