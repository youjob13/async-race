import { Store } from 'redux';
import BaseControl from '../../../shared/templates/BaseControl/BaseControl';
import Button from '../../../shared/templates/Button/Button';
import { toggleGaragePageTC } from '../../../store/carsSlice';
import { ICombineCarsState } from '../../../shared/interfaces/api-models';
import {
  Attribute,
  COUNT_CARS_ON_PAGE,
  FIRST_INDEX,
  FIRST_PAGE,
  GarageClasses,
  PageDirection,
  Tag,
  ZERO_INDEX,
} from '../../../shared/variables';
import dispatchThunk from '../../../shared/helperFunctions/dispatchThunk';

const PREV_PAGE_BUTTON_CONTENT = 'Prev';
const NEXT_PAGE_BUTTON_CONTENT = 'Next';

const garageFooterPropsToBaseControl = {
  tagName: Tag.DIV,
  classes: [GarageClasses.FOOTER],
};
const prevPageButtonProps = {
  tagName: Tag.BUTTON,
  classes: [GarageClasses.ARROW, GarageClasses.ARROW_LEFT],
  text: PREV_PAGE_BUTTON_CONTENT,
  attributes: { id: PageDirection.PREV },
};
const nextPageButtonProps = {
  tagName: Tag.BUTTON,
  classes: [GarageClasses.ARROW, GarageClasses.ARROW_RIGHT],
  text: NEXT_PAGE_BUTTON_CONTENT,
  attributes: { id: PageDirection.NEXT },
};
const controlPagesWrapperProps = {
  tagName: Tag.DIV,
  classes: [GarageClasses.PAGES],
};

class GarageFooter extends BaseControl<HTMLElement> {
  constructor(
    private readonly store: Store,
    private readonly currentPage: number,
    private readonly carsNumber: number
  ) {
    super(garageFooterPropsToBaseControl);
    this.render();
  }

  private toggleGaragePage = (event: Event): void => {
    const target = <HTMLElement>event.target;
    dispatchThunk<ICombineCarsState>(
      this.store,
      toggleGaragePageTC(PageDirection.NEXT === target.id)
    );
  };

  private render(): void {
    const pageSwitches = [
      new Button(prevPageButtonProps, this.toggleGaragePage),
      new Button(nextPageButtonProps, this.toggleGaragePage),
    ];
    const controlPagesWrapper = new BaseControl(controlPagesWrapperProps);

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

    controlPagesWrapper.node.append(
      ...pageSwitches.map((button) => button.node)
    );
    this.node.append(controlPagesWrapper.node);
  }
}

export default GarageFooter;
