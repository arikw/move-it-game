const $cheese = document.getElementById('cheese');
const $mouse = document.getElementById('mouse');
const $mouseCollisionZone = $mouse.querySelector('.collision-zone');
const $cheeseCollisionZone = $cheese.querySelector('.collision-zone');
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
window.addEventListener('resize', function (event) {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  const xRatio = newWidth / windowWidth;
  const yRatio = newHeight / windowHeight;
  windowWidth = newWidth;
  windowHeight = newHeight;
  $cheese.style.left = (parseInt($cheese.style.left) * xRatio) + 'px';
  $cheese.style.top = (parseInt($cheese.style.top) * yRatio) + 'px';
});

document.addEventListener('mousemove', function (event) {
  const mouseRect = $mouse.getBoundingClientRect();
  const pointerX = event.clientX;
  const pointerY = event.clientY;
  $mouse.style.left = pointerX - parseInt(mouseRect.width / 2) + 'px';
  $mouse.style.top = pointerY - parseInt(mouseRect.height / 2) + 'px';
  onMousePositionChanged();
});

// add a keydown event listener to the div
document.addEventListener('keydown', function (e) {
  // get the current top and left values of the div
  let currentPosition = $mouse.getBoundingClientRect();
  let top = parseInt(currentPosition.top) || 0;
  let left = parseInt(currentPosition.left) || 0;

  // set the distance to move the div in pixels
  const distance = 10;

  // check which arrow key was pressed
  switch (e.code) {
    case 'ArrowLeft':
      // decrease the left value by distance
      left -= distance;
      break;
    case 'ArrowUp':
      // decrease the top value by distance
      top -= distance;
      break;
    case 'ArrowRight':
      // increase the left value by distance
      left += distance;
      break;
    case 'ArrowDown':
      // increase the top value by distance
      top += distance;
      break;
    default:
      // do nothing for other keys
      return;
  }

  currentPosition = $mouse.getBoundingClientRect();
  top = (currentPosition.top < 0) ? 0 : top;
  top = (currentPosition.bottom > windowHeight) ? Math.floor(windowHeight - currentPosition.height) : top;
  left = (currentPosition.left < 0) ? 0 : left;
  left = (currentPosition.right > windowWidth) ? Math.floor(windowWidth - currentPosition.width) : left;

  // update the top and left css props of the div
  $mouse.style.top = top + 'px';
  $mouse.style.left = left + 'px';

  onMousePositionChanged();
});

function isCollide(a, b) {
  return !(
    ((a.y + a.height) < (b.y)) || (a.y > (b.y + b.height)) ||
    ((a.x + a.width) < b.x) || (a.x > (b.x + b.width))
  );
}

function onMousePositionChanged() {
  if (isCollide($mouseCollisionZone.getBoundingClientRect(), $cheeseCollisionZone.getBoundingClientRect())) {
    const audio = new Audio('src/resources/bite.mp3');
    audio.play();
    placeCheese();
    changeBackground();
  }
}

function placeCheese() {
  const cheeseRect = $cheese.getBoundingClientRect();
  $cheese.style.left = Math.floor(Math.random() * (window.innerWidth - cheeseRect.width)) + 'px';
  $cheese.style.top = Math.floor(Math.random() * (window.innerHeight - cheeseRect.height)) + 'px';
}

function changeBackground() {  
  const randomNumber = 360 * Math.random();
  const h = parseInt(randomNumber, 10);
  const l = parseInt(
    60 + (15 * Math.abs(Math.sin(randomNumber))),
    10
  );
  document.body.style.backgroundColor = `hsl(${h}, 60%, ${l}%)`;
}

placeCheese();
onMousePositionChanged();