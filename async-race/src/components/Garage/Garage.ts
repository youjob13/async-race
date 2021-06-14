import {
  getCarsNumberSelector,
  getCarStateSelector,
  getCarsSelector,
  getCurrentGaragePageSelector,
  getCurrentWinnerAndRaceStatus,
} from '../../store/carsSelectors';
import './garage.scss';
import { IPage } from '../../shared/interfaces/page-model';
import { ICar, ICurrentWinner } from '../../shared/interfaces/carState-model';
import {
  getAllCarsTC,
  COUNT_CARS_ON_PAGE,
  nullifyCurrentWinner,
} from '../../store/carsSlice';

import BaseControl from '../../shared/BaseControl/BaseControl';
import GarageHeader from './GarageHeader/GarageHeader';
import GarageFooter from './GarageFooter/GarageFooter';
import GarageContent from './GarageContent/GarageContent';
import WinnerPopup from '../Popup/WinnerPopup';

class Garage extends BaseControl<HTMLElement> implements IPage {
  private cars: ICar[];

  private currentPage: number;

  private carsNumber: number;

  private winnerPopup: BaseControl<HTMLElement> | null;

  constructor(private store: any) {
    super({ tagName: 'main', classes: ['garage'] });
    this.cars = getCarsSelector(this.store.getState().carReducer);
    this.currentPage = getCurrentGaragePageSelector(
      this.store.getState().carReducer
    );
    this.carsNumber = 0;
    this.winnerPopup = null;
    this.node.addEventListener('click', (e: Event) => {
      const target = <HTMLElement>e.target;
      if (this.winnerPopup && !target.classList.contains('popup__content')) {
        console.log(this.winnerPopup.node);
        // this.store.dispatch(nullifyCurrentWinner());
        this.winnerPopup.node.remove(); // TODO: think
      }
    });

    this.store.subscribe(() => {
      const { newCars, newCurrentGaragePage } = getCarStateSelector(
        this.store.getState().carReducer
      );

      const newCarsNumber = getCarsNumberSelector(
        this.store.getState().carReducer
      );

      const currentWinner = getCurrentWinnerAndRaceStatus(
        this.store.getState().carReducer
      );

      if (currentWinner) {
        this.winnerPopup = new WinnerPopup(currentWinner);
        this.node.append(this.winnerPopup.node);
        console.log(currentWinner);
      }

      if (this.carsNumber !== newCarsNumber) {
        this.cars = [...newCars]; // TODO: twice
        this.carsNumber = newCarsNumber;
        this.render();
      }

      if (newCurrentGaragePage !== this.currentPage) {
        this.cars = [...newCars]; // TODO: twice
        this.currentPage = newCurrentGaragePage;
        this.render();
      }
    });

    this.store.dispatch(getAllCarsTC(this.currentPage, COUNT_CARS_ON_PAGE));

    this.render();
  }

  render(): void {
    this.node.innerHTML = '';

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
