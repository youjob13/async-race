import { Store } from 'redux';
import {
  getCarsNumberSelector,
  getCarsStateSelector,
  getCarsSelector,
  getCurrentGaragePageSelector,
  getCurrentWinnerSelector,
} from '../../store/carsSelectors';
import './garage.scss';
import { IPage } from '../../shared/interfaces/page-model';
import { ICar } from '../../shared/interfaces/carState-model';
import { getAllCarsTC } from '../../store/carsSlice';

import BaseControl from '../../shared/templates/BaseControl/BaseControl';
import GarageHeader from './GarageHeader/GarageHeader';
import GarageFooter from './GarageFooter/GarageFooter';
import GarageContent from './GarageContent/GarageContent';
import WinnerPopup from '../Popup/WinnerPopup';
import {
  ICombineCarsState,
  ThunkDispatchType,
} from '../../shared/interfaces/api-models';
import {
  COUNT_CARS_ON_PAGE,
  EmptyString,
  EventName,
  GarageClasses,
  Popup,
  Tag,
} from '../../shared/variables';

class Garage extends BaseControl<HTMLElement> implements IPage {
  private cars: ICar[];

  private currentPage: number;

  private carsNumber: number;

  private winnerPopup: BaseControl<HTMLElement> | null;

  constructor(private readonly store: Store) {
    super({ tagName: Tag.MAIN, classes: [GarageClasses.GARAGE] });
    this.carsNumber = 0;
    this.winnerPopup = null; // TODO: think and recast
    this.cars = getCarsSelector(this.store.getState().carReducer);
    this.currentPage = getCurrentGaragePageSelector(
      this.store.getState().carReducer
    );

    this.node.addEventListener(EventName.CLICK, (event: Event) => {
      const target = <HTMLElement>event.target;

      if (this.winnerPopup && !target.classList.contains(Popup.POPUP_CONTENT)) {
        this.winnerPopup.node.remove(); // TODO: think
      }
    });

    // TODO: try to move out
    this.store.subscribe(() => {
      const { newCars, newGaragePage } = getCarsStateSelector(
        this.store.getState().carReducer
      );

      const newCarsNumber = getCarsNumberSelector(
        this.store.getState().carReducer
      );

      const newWinner = getCurrentWinnerSelector(
        this.store.getState().carReducer
      );

      if (newWinner) {
        this.winnerPopup = new WinnerPopup(newWinner);
        this.node.append(this.winnerPopup.node);
      }

      if (this.carsNumber !== newCarsNumber) {
        this.cars = [...newCars]; // TODO: twice
        this.carsNumber = newCarsNumber;
        this.render();
      }

      if (newGaragePage !== this.currentPage) {
        this.cars = [...newCars]; // TODO: twice
        this.currentPage = newGaragePage;
        this.render();
      }
    });

    (this.store.dispatch as ThunkDispatchType<ICombineCarsState>)(
      getAllCarsTC(this.currentPage, COUNT_CARS_ON_PAGE)
    );

    this.render();
  }

  render(): void {
    this.node.innerHTML = EmptyString;

    const garageHeader = new GarageHeader(
      this.store,
      this.currentPage,
      this.carsNumber
    );

    const garageContent = new GarageContent(this.store, this.cars);

    const garageFooter = new GarageFooter(
      this.store,
      this.currentPage,
      this.carsNumber
    );

    this.node.append(garageHeader.node, garageContent.node, garageFooter.node);
  }
}

export default Garage;
