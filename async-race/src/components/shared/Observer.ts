export interface IObserver {
  observers: any[];
  data?: unknown;
  broadcast: () => void;
  subscribe: (fn: () => void) => void;
}

class Observer {
  observers: any[];

  constructor() {
    this.observers = [];
  }

  subscribe<T>(fn: T): void {
    this.observers.push(fn);
  }

  unsubscribe(fn: () => void): void {
    this.observers.filter((observer) => observer !== fn);
  }

  broadcast(data?: unknown): void {
    this.observers.forEach((observer) => observer(data));
  }
}

export default Observer;
