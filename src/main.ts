let gridElement = document.getElementById('grid')!;
const scoreElement = document.getElementById('score')!;

let score = 0;
let gridSize = 4;
let oddIndex = 0;

function getRandomColors() {
  const ratio = 0.618033988749895;
  const hue = (Math.random() + ratio) % 1;
  const saturation = Math.floor(Math.random() * 85);
  const lightness = Math.floor(Math.random() * 85);

  const color = `hsl(${Math.floor(360 * hue)}, ${saturation}%, ${lightness}%)`;
  const oddColor = `hsl(${Math.floor(360 * hue)}, ${saturation}%, ${lightness + 5}%)`;

  return { color, oddColor };
}

const createGrid = () => {
  const clonedGrid = gridElement.cloneNode(false) as HTMLElement;
  clonedGrid.classList.remove('shake');
  clonedGrid.style.gridTemplateColumns = `repeat(${gridSize}, auto)`;

  const { color, oddColor } = getRandomColors();
  const totalCells = gridSize * gridSize;
  oddIndex = Math.floor(Math.random() * totalCells);

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.style.backgroundColor = i === oddIndex ? oddColor : color;
    cell.dataset.idx = String(i);
    fragment.appendChild(cell);
  }

  clonedGrid.appendChild(fragment);
  clonedGrid.addEventListener('click', handleGridClick);

  gridElement.parentElement!.replaceChild(clonedGrid, gridElement);
  gridElement = clonedGrid;
};

const handleGridClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.classList.contains('cell')) return;

  const idx = Number(target.dataset.idx);
  if (idx === oddIndex) {
    score++;
    gridSize++;
    createGrid();
  } else {
    score = 0;
    gridSize = 4;
    gridElement.classList.add('shake');
    setTimeout(createGrid, 800);
  }

  scoreElement.textContent = `Score: ${score}`;
};

createGrid();
