export interface IObserver {
  observers: any[];
  broadcast: (data?: any) => void;
  subscribe: (fn: () => void) => void;
}

class Observer {
  observers: any[];

  constructor() {
    this.observers = [];
  }

  subscribe(fn: () => void): void {
    this.observers.push(fn);
  }

  unsubscribe(fn: () => void): void {
    this.observers.filter((observer) => observer !== fn);
  }

  broadcast(data?: any): void {
    this.observers.forEach((observer) => observer(data));
  }
}

export default Observer;
