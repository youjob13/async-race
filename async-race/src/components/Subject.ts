class Subject {
  private observers: unknown;

  constructor() {
    this.observers = [];
  }

  unsubscribe = () => {};

  subscribe = () => {};

  notify = () => {};
}
