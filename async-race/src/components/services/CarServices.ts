import { apiEngine } from '../api/api';

export interface ICarServices {
  startEngine: (id: number) => Promise<number>;
  stopEngine: (id: number) => Promise<void>;
  switchEngineMode: (id: number) => Promise<boolean>;
}

class CarServices implements ICarServices {
  private calcCarSpeed = (result: {
    velocity: number;
    distance: number;
  }): number => {
    const { velocity, distance } = result;
    return distance / velocity;
  };

  switchEngineMode = async (id: number): Promise<boolean> => {
    return apiEngine.switchEngineMode(id, 'drive');
  };

  stopEngine = async (id: number): Promise<void> => {
    const result = await apiEngine.toggleEngine(id, 'stopped');
  };

  startEngine = async (id: number): Promise<number> => {
    const result = await apiEngine.toggleEngine(id, 'started');
    const carSpeed = this.calcCarSpeed(result);
    return carSpeed;
  };
}

export default CarServices;
