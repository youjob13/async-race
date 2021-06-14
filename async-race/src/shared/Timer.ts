class Timer {
  private counter: number;

  private timerId: number;

  constructor() {
    this.counter = 0;
    this.timerId = 0;
  }

  clearTimer(): void {
    this.counter = 0;
  }

  getTime(): number {
    return this.counter;
  }

  stopTimer(): void {
    window.clearTimeout(this.timerId);
  }

  startTimer(): void {
    this.timerId = window.setTimeout(() => {
      this.counter++;
      this.startTimer();
    }, 1000);
  }
}

export default Timer;
