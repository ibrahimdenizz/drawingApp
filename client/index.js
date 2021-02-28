window.addEventListener("load", () => {
  const socket = io();

  const plus = document.querySelector("#plus");
  const minus = document.querySelector("#minus");
  const size = document.querySelector("#size");
  const colors = document.querySelectorAll(".color");
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let painting = false;
  let paintColor = "black";
  let prevClientX = 0,
    prevClientY = 0;
  let lineWidth = 5;
  size.innerHTML = lineWidth;

  function startPositioning(e) {
    painting = true;
    socket.emit("finishedPosition", "finish");
    prevClientX = e.clientX;
    prevClientY = e.clientY;
    draw(e);
  }

  function finishedPosition() {
    painting = false;
    socket.emit("finishedPosition", "finish");
  }

  function draw(e) {
    if (painting) {
      socket.emit("draw", {
        x: e.clientX,
        y: e.clientY,
        color: paintColor,
        prevX: prevClientX,
        prevY: prevClientY,
        lineWidth,
      });
      prevClientX = e.clientX;
      prevClientY = e.clientY;
    }
  }

  function changeColor(e) {
    paintColor = e.target.id;
  }

  socket.on("finishedPosition", () => {
    ctx.beginPath();
  });

  socket.on("draw", ({ x, y, color, prevX, prevY, lineWidth }) => {
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
  });

  plus.addEventListener("click", () => {
    lineWidth = lineWidth + 5 > 50 ? 50 : lineWidth + 5;
    size.innerHTML = lineWidth;
  });

  minus.addEventListener("click", () => {
    lineWidth = lineWidth - 5 >= 5 ? lineWidth - 5 : 5;
    size.innerHTML = lineWidth;
  });

  colors.forEach(function (color) {
    color.addEventListener("click", changeColor);
  });
  canvas.addEventListener("mousedown", startPositioning);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", draw);
});
