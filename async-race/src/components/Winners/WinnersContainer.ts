import Winners from './Winners';

interface IWinnersContainer {
  render: () => HTMLElement;
}

class WinnersContainer implements IWinnersContainer {
  render = (): HTMLElement => {
    return new Winners({
      tagName: 'main',
      classes: ['winners'],
    }).render();
  };
}

export default WinnersContainer;
