import './header.scss';
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

const buttonActiveClass = [
  HeaderClasses.BUTTON,
  HeaderClasses.BUTTON_ACTIVE,
  ButtonClass,
];
const buttonNonActiveClass = [HeaderClasses.BUTTON, ButtonClass];
const GARAGE_BUTTON_TEXT = 'Garage';
const WINNERS_BUTTON_TEXT = 'Winners';

const headerPropsToBaseControl = {
  tagName: Tag.HEADER,
  classes: [HeaderClasses.HEADER],
};
const buttonsWrapperPropsToBaseControl = {
  tagName: Tag.DIV,
  classes: [HeaderClasses.BUTTONS_WRAP],
};

class Header extends BaseControl<HTMLElement> {
  constructor(private readonly router: IRouter) {
    super(headerPropsToBaseControl);
    this.render();
  }

  private onPageToggleClick = (event: Event): void => {
    event.preventDefault();
    const target = <HTMLAnchorElement>event.target;
    this.router.changePath(target.getAttribute(Attribute.HREF) || Route.ROOT);
  };

  render(): void {
    this.node.innerHTML = EmptyString;

    const hash = this.router.getHash();

    const stylesGarageButton =
      hash === Route.GARAGE || hash === Route.ROOT
        ? buttonActiveClass
        : buttonNonActiveClass;

    const stylesWinnersButton =
      hash === Route.WINNERS ? buttonActiveClass : buttonNonActiveClass;

    const headerButtons = [
      new Button(
        {
          tagName: Tag.A,
          classes: stylesWinnersButton,
          text: WINNERS_BUTTON_TEXT,
          attributes: { href: Route.WINNERS },
        },
        this.onPageToggleClick
      ),
      new Button(
        {
          tagName: Tag.A,
          classes: stylesGarageButton,
          text: GARAGE_BUTTON_TEXT,
          attributes: { href: Route.GARAGE },
        },
        this.onPageToggleClick
      ),
    ];

    const buttonsWrapper = new BaseControl(buttonsWrapperPropsToBaseControl);

    buttonsWrapper.node.append(
      ...headerButtons.map((headerButton) => headerButton.node)
    );
    this.node.append(buttonsWrapper.node);
  }
}

export default Header;
