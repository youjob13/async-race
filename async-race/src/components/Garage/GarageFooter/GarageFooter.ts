import { Store } from 'redux';
import BaseControl from '../../../shared/templates/BaseControl/BaseControl';
import Button from '../../../shared/templates/Button/Button';
import { toggleGaragePageTC } from '../../../store/carsSlice';
import {
  ICombineCarsState,
  ThunkDispatchType,
} from '../../../shared/interfaces/api-models';
import {
  Attribute,
  COUNT_CARS_ON_PAGE,
  FIRST_INDEX,
  FIRST_PAGE,
  GarageClasses,
  Tag,
  ZERO_INDEX,
} from '../../../shared/variables';

class GarageFooter extends BaseControl<HTMLElement> {
  constructor(
    private readonly store: Store,
    private readonly currentPage: number,
    private readonly carsNumber: number
  ) {
    super({
      tagName: Tag.DIV,
      classes: [GarageClasses.FOOTER],
    });
    this.render();
  }

  private switchToPrevGaragePage = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      toggleGaragePageTC(false)
    );
  };

  private switchToNextGaragePage = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      toggleGaragePageTC(true)
    );
  };

  private render(): void {
    const pageSwitches = [
      new Button(
        {
          tagName: Tag.BUTTON,
          classes: [GarageClasses.ARROW, GarageClasses.ARROW_LEFT],
          text: 'Prev',
        },
        this.switchToPrevGaragePage
      ),
      new Button(
        {
          tagName: Tag.BUTTON,
          classes: [GarageClasses.ARROW, GarageClasses.ARROW_RIGHT],
          text: 'Next',
        },
        this.switchToNextGaragePage
      ),
    ];

    const arrowsPagesWrapper = new BaseControl({
      tagName: Tag.DIV,
      classes: [GarageClasses.PAGES],
    });

    if (this.currentPage === FIRST_PAGE)
      pageSwitches[ZERO_INDEX].node.setAttribute(
        Attribute.DISABLED,
        Attribute.DISABLED
      );

    if (this.carsNumber - COUNT_CARS_ON_PAGE * this.currentPage < FIRST_PAGE)
      pageSwitches[FIRST_INDEX].node.setAttribute(
        Attribute.DISABLED,
        Attribute.DISABLED
      );

    arrowsPagesWrapper.node.append(
      ...pageSwitches.map((button) => button.node)
    );
    this.node.append(arrowsPagesWrapper.node);
  }
}

export default GarageFooter;
