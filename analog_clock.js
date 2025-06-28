function drawAnalogClock(canvas, date) {
  const ctx = canvas.getContext("2d");
  const radius = canvas.width / 2;
  ctx.translate(radius, radius);
  const now = date;

  // Draw the face
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, now, radius);

  ctx.translate(-radius, -radius);
}

function drawFace(ctx, radius) {
  const grad = ctx.createRadialGradient(
    0,
    0,
    radius * 0.95,
    0,
    0,
    radius * 1.05
  );
  grad.addColorStop(0, "#333");
  grad.addColorStop(0.5, "white");
  grad.addColorStop(1, "#333");
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = "#333";
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  const fontSize = radius * 0.15;
  ctx.font = `${fontSize}px arial`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (let num = 1; num <= 12; num++) {
    const ang = (num * Math.PI) / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, now, radius) {
  const hour = now.getHours() % 12;
  const minute = now.getMinutes();
  const second = now.getSeconds();
  // Hour
  const hourPos = ((hour + minute / 60 + second / 3600) * Math.PI) / 6;
  drawHand(ctx, hourPos, radius * 0.5, radius * 0.07);
  // Minute
  const minutePos = ((minute + second / 60) * Math.PI) / 30;
  drawHand(ctx, minutePos, radius * 0.8, radius * 0.07);
  // Second
  const secondPos = (second * Math.PI) / 30;
  drawHand(ctx, secondPos, radius * 0.9, radius * 0.02);
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}
