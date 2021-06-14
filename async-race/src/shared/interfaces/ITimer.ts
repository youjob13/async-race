export interface ITimer {
  startTimer: () => void;
  stopTimer: () => void;
  getTime: () => number;
  clearTimer: () => void;
}
