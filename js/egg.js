// いわゆるイースターエッグ
let clickCount = 0;

function rotateImage() {
  const image = document.getElementById('caution');
  const background = document.querySelector('.full-screen-no-support');
  const text = document.querySelectorAll('.txt');

  clickCount++;

  image.style.animation = 'shake 0.5s ease';

  setTimeout(() => {
    image.style.animation = ''; // アニメーションをリセット
  }, 500);

  // 意味がわからないのでやめておく
  // const rotation = clickCount * 36;
  // image.style.transform = `rotate(${rotation}deg)`;
  // image.style.transition = 'transform 0.3s ease';

  // 流石に怖いのでやめとく
  // const greenValue = Math.max(255 - (clickCount * 25), 0);
  // const blueValue = Math.max(255 - (clickCount * 25), 0);
  // const whiteValue = Math.max(0 + (clickCount * 25), 0);
  // background.style.backgroundColor = `rgb(255, ${greenValue}, ${blueValue})`;
  // text.forEach(element => {
  //   element.style.color = `rgb(${whiteValue}, ${whiteValue}, ${whiteValue})`;
  // });

  if (clickCount >= 10) {
    window.location.href = 'http://www.ics.teikyo-u.ac.jp/~shionome/works/bird/index.html';
  }
}

document.getElementById('caution').addEventListener('click', rotateImage);