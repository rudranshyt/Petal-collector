const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const flowerBasket = new Image();
flowerBasket.src = "../flower collector.png";

const borderWidth = 5;
let timer = 10;

function adjustCanvasSize() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (
    (viewportWidth === 375 && viewportHeight === 667) ||
    (viewportWidth === 667 && viewportHeight === 375)
  ) {
    canvas.width = viewportWidth;
    canvas.height = viewportHeight;
  } else if (viewportWidth >= 1440) {
    canvas.width = 1000;
    canvas.height = 500;
  } else {
    canvas.width = 300;
    canvas.height = 500;
  }
}

adjustCanvasSize();
window.addEventListener("resize", adjustCanvasSize);

const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  size: 90,
  speed: 5,
  draw: function () {
    if (flowerBasket.complete) {
      ctx.drawImage(
        flowerBasket,
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    } else {
      ctx.fillStyle = "blue";
      ctx.fillRect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    }
  },
};

const flowers = [];
const flowerEmojis = ["🌸", "🌹", "🌺", "🌻", "🌼"];
let score = 0;

function generateFlowers() {
  const numFlowers = Math.floor(Math.random() * 16) + 5;
  for (let i = 0; i < numFlowers; i++) {
    flowers.push({
      x: Math.random() * (canvas.width - 3),
      y: (Math.random() * (canvas.height - 3)) / 2,
      size: 50,
      isCollected: false,
      image: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
    });
  }
}

function drawFlowers() {
  for (let flower of flowers) {
    if (!flower.isCollected) {
      ctx.font = flower.size + "px serif";
      ctx.fillText(
        flower.image,
        flower.x - flower.size / 4,
        flower.y + flower.size / 4
      );
    }
  }
}

function checkCollision() {
  for (let i = 0; i < flowers.length; i++) {
    const flower = flowers[i];
    const distanceX = Math.abs(player.x - flower.x);
    const distanceY = Math.abs(player.y - flower.y);

    if (
      distanceX < player.size / 2 + flower.size / 2 &&
      distanceY < player.size / 2 + flower.size / 2 &&
      !flower.isCollected
    ) {
      flowers[i].isCollected = true;
      score++;
    }
  }
  if (score === flowers.length) {
    alert(
      "Congratulations! You collected all the flowers! \n Click ok to Claim your reward"
    );
    window.location.href = "../templates/flowers.html";
  }

  if (
    player.x - player.size / 2 < borderWidth ||
    player.x + player.size / 2 > canvas.width - borderWidth ||
    player.y - player.size / 2 < borderWidth ||
    player.y + player.size / 2 > canvas.height - borderWidth
  ) {
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
  }
}

let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;
let isDownPressed = false;

function updatePlayer() {
  if (isLeftPressed && player.x > player.size / 2) {
    player.x -= player.speed;
  } else if (isRightPressed && player.x < canvas.width - player.size / 2) {
    player.x += player.speed;
  }

  if (isUpPressed && player.y > player.size / 2) {
    player.y -= player.speed;
  } else if (isDownPressed && player.y < canvas.height - player.size / 2) {
    player.y += player.speed;
  }
}

function drawBorder() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, borderWidth, canvas.height);
  ctx.fillRect(0, 0, canvas.width, borderWidth);
  ctx.fillRect(canvas.width - borderWidth, 0, borderWidth, canvas.height);
  ctx.fillRect(0, canvas.height - borderWidth, canvas.width, borderWidth);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayer();
  drawBorder();
  drawFlowers();
  player.draw();

  checkCollision();

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Time Left: " + timer, 10, 60);

  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");

  document.getElementById("infoText").textContent =
    "Hey " + username + ", collect all flowers to claim your reward";

  requestAnimationFrame(animate);
}

generateFlowers();

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    isLeftPressed = true;
  } else if (event.key === "ArrowRight") {
    isRightPressed = true;
  } else if (event.key === "ArrowUp") {
    isUpPressed = true;
  } else if (event.key === "ArrowDown") {
    isDownPressed = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    isLeftPressed = false;
  } else if (event.key === "ArrowRight") {
    isRightPressed = false;
  } else if (event.key === "ArrowUp") {
    isUpPressed = false;
  } else if (event.key === "ArrowDown") {
    isDownPressed = false;
  }
});

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);
canvas.addEventListener("touchend", handleTouchEnd);

function handleTouchStart(event) {
  event.preventDefault();
  handleTouchEvent(event.touches[0]);
}

function handleTouchMove(event) {
  event.preventDefault();
  handleTouchEvent(event.touches[0]);
}

function handleTouchEnd(event) {
  event.preventDefault();
  isLeftPressed = false;
  isRightPressed = false;
  isUpPressed = false;
  isDownPressed = false;
}

function handleTouchEvent(touch) {
  const touchX = touch.clientX - canvas.offsetLeft;
  const touchY = touch.clientY - canvas.offsetTop;

  const angle = Math.atan2(touchY - player.y, touchX - player.x);

  if (angle >= -Math.PI / 4 && angle <= Math.PI / 4) {
    isRightPressed = true;
    isLeftPressed = false;
  } else if (angle > (3 * Math.PI) / 4 || angle < (-3 * Math.PI) / 4) {
    isLeftPressed = true;
    isRightPressed = false;
  } else {
    isLeftPressed = false;
    isRightPressed = false;
  }

  if (angle > (-3 * Math.PI) / 4 && angle < -Math.PI / 4) {
    isUpPressed = true;
    isDownPressed = false;
  } else if (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) {
    isDownPressed = true;
    isUpPressed = false;
  } else {
    isUpPressed = false;
    isDownPressed = false;
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.5;
  player.size = Math.min(canvas.width, canvas.height) / 10;
  player.x = canvas.width / 2;
  player.y = canvas.height - player.size;

  for (let flower of flowers) {
    flower.size = Math.min(canvas.width, canvas.height) / 20;
    flower.x = Math.random() * canvas.width;
    flower.y = Math.random() * (canvas.height / 2);
  }
}
window.addEventListener("resize", resizeCanvas);

flowerBasket.onload = function () {
  animate();
};

function startTimer() {
  const timerInterval = setInterval(() => {
    timer--;
    if (timer <= 0) {
      clearInterval(timerInterval);
      const userChoice = confirm(
        "Time's up! You didn't collect all the flowers in time.\nWould you like to play again?"
      );
      if (userChoice) {
        score = 0;
        flowers.length = 0;
        generateFlowers();
        player.x = canvas.width / 2;
        player.y = canvas.height - 50;
        timer = 10;
        startTimer();
      } else {
        window.location.href = "/index.html";
      }
    }
  }, 1000);
}

startTimer();
