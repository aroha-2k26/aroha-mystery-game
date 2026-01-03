const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const knife = new Image();
knife.src = "assets/images/knife.png";
const wheelImg = new Image();
wheelImg.src = "assets/images/log.png";
const knifeWidth = 100;
const knifeHeight = 130;
const wheelRadius = 100;
const visualWheelSize = 300;
let currentAngle = 0;
let rectheight = canvas.height - 120;
let knife_moving = 0;
let knifes_remaining = 11;
let hit = 0;
let level = 1;
let flag = 0;
let hit_knifes = [];
let isGameOver = false;
let isTransitioning = false;
let message = "";
const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

function handleInput(e) {
    if (e.cancelable) e.preventDefault();

    if (isGameOver) {
        location.reload();
        return;
    }

    if (knife_moving === 0 && !isTransitioning) {
        knife_moving = 1;
    }
}

canvas.addEventListener("mousedown", handleInput);
canvas.addEventListener("touchstart", handleInput, { passive: false });
document.getElementById("backButton").onclick = () => {
    window.location.href = "index.html";
};
function drawInCanvasMessage(msg, submsg) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px 'Nanum Gothic'";
    ctx.textAlign = "center";
    ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#ffb300";
    ctx.font = "20px 'Nanum Gothic'";
    ctx.fillText(submsg, canvas.width / 2, canvas.height / 2 + 50);
    if (isGameOver) {
        ctx.fillStyle = "#aaa";
        ctx.font = "16px 'Nanum Gothic'";
        ctx.fillText("TAP TO RESTART", canvas.width / 2, canvas.height / 2 + 100);
    }
}

function startLevelTransition() {
    isTransitioning = true;
    let timer = 0;

    function transitionLoop() {
        if (timer < 90) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawInCanvasMessage("LEVEL COMPLETE!", `Starting Level ${level + 1}...`);
            timer++;
            raf(transitionLoop);
        } else {
            level++;
            isTransitioning = false;
            rectheight = canvas.height - 120;
            knife_moving = 0;
            hit = 0;
            Update();
        }
    }
    transitionLoop();
}

function check_rect_collision(curarc) {
    for (let i in hit_knifes) {
        if (Math.abs(curarc.current_angle - hit_knifes[i].cangle) < 0.07) {
            showPopup("Game Over", "CLINK! Your Blades Collided.");
            return;
        }
    }
}


function check_collision(curarc, currec) {
    if (currec.y <= curarc.centerY + 40) {
        hit = 1;
        check_rect_collision(curarc);
        if (isGameOver) return;
        hit_knifes.push({
            x: currec.x,
            y: curarc.centerY,
            width: knifeWidth,
            height: knifeHeight,
            angle: 0,
            cangle: curarc.current_angle
        });
        knifes_remaining--;
        return true;
    }
    return false;
}

function Update() {
    if (isGameOver) {
        return;
    }
    if (isTransitioning) return;
    if (level === 2 && flag === 0) {
        currentAngle = 0;
        hit_knifes = [];
        knifes_remaining = 16;
        flag++;
    }
    if (level === 3 && flag === 1) {
        hit_knifes = [];
        knifes_remaining = 16;
        currentAngle = 0;
        flag++;
    }
    if (level === 4 && flag === 2) {
        hit_knifes = [];
        knifes_remaining = 16;
        currentAngle = 0;
        flag++;
    }
    if (knifes_remaining > 1) {
        if (rectheight < 0 || hit === 1) {
            rectheight = canvas.height - 120;
            knife_moving = 0;
            hit = 0;
        }
        const current_arc = {
            centerX: canvas.width / 2,
            centerY: 200,
            radius: wheelRadius,
            current_angle: currentAngle
        };
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(0, 0, canvas.width, 60);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px 'Nanum Gothic'";
        ctx.textAlign = "left";
        ctx.fillText("LVL: " + level, 20, 38);
        ctx.textAlign = "right";
        ctx.fillText("KNIVES: " + (knifes_remaining - 1), canvas.width - 20, 38);
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        hit_knifes.forEach(k => {
            ctx.save();
            ctx.translate(canvas.width / 2, 200);
            if (level === 3) ctx.rotate(6.28 - k.angle);
            else if (level === 4 && knifes_remaining % 2 === 0) ctx.rotate(k.angle);
            else if (level === 4) ctx.rotate(6.28 - k.angle);
            else ctx.rotate(k.angle);
            ctx.drawImage(knife, -(knifeWidth / 2), 30, knifeWidth, knifeHeight);
            ctx.restore();
            k.angle += Math.PI / 180;
            k.angle %= Math.PI * 2;
        });
        ctx.save();
        ctx.translate(canvas.width / 2, 200);
        ctx.rotate(currentAngle);
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255, 179, 0, 0.3)";
        ctx.drawImage(wheelImg, -(visualWheelSize / 2), -(visualWheelSize / 2), visualWheelSize, visualWheelSize);
        ctx.restore();
        ctx.shadowBlur = 0;
        ctx.drawImage(knife, canvas.width / 2 - (knifeWidth / 2), rectheight, knifeWidth, knifeHeight);
        currentAngle += Math.PI / 180;
        currentAngle %= Math.PI * 2;
        if (knife_moving === 1) rectheight -= 22;
        check_collision(current_arc, { x: canvas.width / 2, y: rectheight });
        raf(Update);
    } else {
        if (level === 4) {
            showPopup("VICTORY", "You are a knife master!");
            return;
        }
        else {
            startLevelTransition();
        }
    }
}
function showPopup(title, message) {
    gameEnded = true;
    document.getElementById("popupTitle").textContent = title;
    document.getElementById("popupMessage").textContent = message;
    document.getElementById("popupOverlay").style.display = "flex";
}
function restartGame() {
    location.reload();
}

raf(Update);
