import { Store } from 'redux';
import { getCarsState, getCurrentGaragePage } from '../../store/carsSelectors';
import './garage.scss';
import { IPage } from '../../shared/interfaces/page-model';
import { ICar } from '../../shared/interfaces/carState-model';
import { getAllCarsTC } from '../../store/carsSlice';
import BaseControl from '../../shared/templates/BaseControl/BaseControl';
import GarageHeader from './GarageHeader/GarageHeader';
import GarageFooter from './GarageFooter/GarageFooter';
import GarageContent from './GarageContent/GarageContent';
import WinnerPopup from '../Popup/WinnerPopup';
import { ICombineCarsState } from '../../shared/interfaces/api-models';
import {
  COUNT_CARS_ON_PAGE,
  EmptyString,
  EventName,
  GarageClasses,
  INITIAL_CARS_NUMBER,
  PopupClasses,
  Tag,
} from '../../shared/variables';
import dispatchThunk from '../../shared/helperFunctions/dispatchThunk';

const garagePropsToBaseControl = {
  tagName: Tag.MAIN,
  classes: [GarageClasses.GARAGE],
};

class Garage extends BaseControl<HTMLElement> implements IPage {
  private cars: ICar[];

  private currentPage: number;

  private carsNumber: number;

  private winnerPopup: BaseControl<HTMLElement> | null;

  constructor(private readonly store: Store) {
    super(garagePropsToBaseControl);
    this.carsNumber = INITIAL_CARS_NUMBER;
    this.winnerPopup = null;
    this.cars = [];
    this.currentPage = getCurrentGaragePage(this.store.getState().carReducer);

    this.node.addEventListener(EventName.CLICK, (event: Event) => {
      const target = <HTMLElement>event.target;

      if (
        this.winnerPopup &&
        !target.classList.contains(PopupClasses.POPUP_CONTENT)
      ) {
        this.winnerPopup.node.remove();
      }
    });

    store.subscribe(() => {
      const { newCars, newGaragePage, newWinner, newCarsNumber } = getCarsState(
        this.store.getState().carReducer
      );

      if (newWinner) {
        this.winnerPopup = new WinnerPopup(newWinner);
        this.node.append(this.winnerPopup.node);
      }

      if (newCarsNumber !== this.carsNumber) {
        this.cars = [...newCars];
        this.carsNumber = newCarsNumber;
        this.render();
      }

      if (newGaragePage !== this.currentPage) {
        this.cars = [...newCars];
        this.currentPage = newGaragePage;
        this.render();
      }
    });

    dispatchThunk<ICombineCarsState>(
      store,
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
