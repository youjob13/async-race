import { Store } from 'redux';
import BaseControl from '../../../shared/BaseControl/BaseControl';
import Button from '../../../shared/Button/Button';
import { toggleGaragePageTC } from '../../../store/carsSlice';
import {
  ICombineCarsState,
  ThunkDispatchType,
} from '../../../shared/interfaces/api-models';
import { COUNT_CARS_ON_PAGE } from '../../../shared/variables';

class GarageFooter extends BaseControl<HTMLElement> {
  constructor(
    private store: Store,
    private currentPage: number,
    private carsNumber: number
  ) {
    super({
      tagName: 'div',
      classes: ['garage__footer'],
    });
    this.render();
  }

  private onPrevPageBtnClick = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      toggleGaragePageTC(false)
    );
  };

  private onNextPageBtnClick = (): void => {
    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      toggleGaragePageTC(true)
    );
  };

  private render(): void {
    const arrowsPagesWrapper = new BaseControl({
      tagName: 'div',
      classes: ['garage__pages'],
    });

    const leftArrow = new Button(
      {
        tagName: 'button',
        classes: ['arrow', 'arrow-left'],
        text: 'Prev',
      },
      this.onPrevPageBtnClick
    );

    const rightArrow = new Button(
      {
        tagName: 'button',
        classes: ['arrow', 'arrow-right'],
        text: 'Next',
      },
      this.onNextPageBtnClick
    );

    if (this.currentPage === 1)
      leftArrow.node.setAttribute('disabled', 'disabled');

    if (this.carsNumber - COUNT_CARS_ON_PAGE * this.currentPage < 1)
      rightArrow.node.setAttribute('disabled', 'disabled');

    arrowsPagesWrapper.node.append(leftArrow.node, rightArrow.node);
    this.node.append(arrowsPagesWrapper.node);
  }
}

export default GarageFooter;
