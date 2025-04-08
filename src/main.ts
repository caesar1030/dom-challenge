/*
 * Creates star rating functionality
 * @param el DOM Element
 * @param count Number of stars
 * @param callback Returns selected star count to callback
 */

const Star = (el: string, count: number, callback: (value: string) => void) => {
  const starWrapperDiv = document.querySelector(el) as Element;
  const stars = Array.from({ length: count })
    .map((_, idx) => `<i class="fa fa-star-o" data-index="${idx}"></i>`)
    .join('\n');
  starWrapperDiv.innerHTML = stars;

  starWrapperDiv.addEventListener('mousemove', (e) => {
    const hoveredStar = e.target! as HTMLElement;
    if (!hoveredStar.matches('.fa')) return;

    const hoverIndex = Number(hoveredStar.dataset.index);

    document.querySelectorAll('.fa').forEach((el, idx) => {
      idx <= hoverIndex
        ? el.classList.add('fa-star')
        : el.classList.remove('fa-star');
    });
  });

  starWrapperDiv.addEventListener('click', (e) => {
    const hoveredStar = e.target! as HTMLElement;
    if (!hoveredStar.matches('.fa')) return;

    const hoverIndex = Number(hoveredStar.dataset.index) + 1;
    callback(hoverIndex + '');
  });
};

function getStar(value: string) {
  document.getElementById('display-star')!.innerHTML = value;
}

Star('#star', 5, getStar);
