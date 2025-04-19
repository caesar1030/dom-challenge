abstract class Observer {
  target: HTMLElement;

  constructor(
    target: HTMLElement,
    observables: { [key in string]: Observable },
  ) {
    this.target = target;

    Object.keys(observables).forEach((key) => {
      // TODO: 타입 정의 수정
      this[key] = observables[key];
      observables[key].subscribe(this);
    });

    this.render();
    this.handleEventListner();
  }

  createInnerHtml(): string {
    return ``;
  }

  render() {
    this.target.innerHTML = this.createInnerHtml();
  }

  rerender() {
    console.log('rerender');
    this.render();
  }

  handleEventListner() {}
}

abstract class Observable {
  public state: any;
  private observers: Set<Observer> = new Set();

  constructor(state: any) {
    this.state = this.createProxy(state);
  }

  private notify() {
    console.log('notify');
    [...this.observers].forEach((observer) => observer.rerender());
  }

  private createProxy(state: any) {
    return new Proxy(state, {
      set: (state, prop, value) => {
        if (!(prop in this.state)) return false;

        state[prop] = value;
        this.notify();
        return true;
      },
    });
  }

  subscribe(observer: Observer) {
    this.observers.add(observer);
  }
}

class ChessBoardModel extends Observable {
  constructor() {
    const state: {
      clickedIndex: number | null;
    } = {
      clickedIndex: null,
    };

    super(state);
  }
}

class ChessBoardView extends Observer {
  constructor(chessBoardModel: Observable) {
    super(document.querySelector('#app')!, {
      chessBoardModel,
    });
  }

  private decideColor(idx: number) {
    let color = idx % 2 === 0 ? 'white' : 'black';

    // TODO: 타입 정의 수정
    const clickedIndex = this.chessBoardModel.state.clickedIndex;
    if (clickedIndex === null) return color;

    const clickedRow = Math.floor(clickedIndex / 8);
    const clickedCol = clickedIndex % 8;
    const row = Math.floor(idx / 8);
    const col = idx % 8;
    const isDiagonal =
      Math.abs(row - clickedRow) === Math.abs(col - clickedCol);

    if (isDiagonal) color = 'red';
    return color;
  }

  createInnerHtml() {
    const chessboardBoxes = [...new Array(8 * 8)]
      .map((_, idx) => {
        const color = this.decideColor(idx);
        return `<div class="chess-board__box chess-board__box--${color}" data-index="${idx}"></div>`;
      })
      .join('\n');

    return `
    <div class="chess-board">
      ${chessboardBoxes}
    </div>
    `;
  }

  handleEventListner() {
    const handleClick = (e: MouseEvent) => {
      const chessboardBox = (e.target as HTMLElement).closest(
        '.chess-board__box',
      ) as HTMLElement;

      if (!chessboardBox) return;

      const clickIndex = Number(chessboardBox!.dataset.index);
      // TODO: 타입 정의 수정
      this.chessBoardModel.state.clickedIndex = clickIndex;
    };

    this.target.addEventListener('click', handleClick);
  }
}

const test = () => {
  const chessBoardModel = new ChessBoardModel();
  new ChessBoardView(chessBoardModel);

  console.log(
    'observable의 상태가 바뀌면 notify가 콘솔에 출력되어야 함, 동시에 rerender가 출력되어야 함',
  );

  chessBoardModel.state.clickedIndex = 2;
};

// test();

const main = () => {
  const chessBoardModel = new ChessBoardModel();
  new ChessBoardView(chessBoardModel);
};

main();
