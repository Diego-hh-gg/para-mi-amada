
    const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

resize();

window.addEventListener("resize", resize);

const stars = document.getElementById("stars");

for(let i=0;i<350;i++){

    const star=document.createElement("div");

    star.className="star";

    star.style.left=Math.random()*100+"%";
    star.style.top=Math.random()*100+"%";

    const size=Math.random()*3+1;

    star.style.width=size+"px";
    star.style.height=size+"px";

    star.style.animationDelay=Math.random()*5+"s";

    stars.appendChild(star);

}

const question = document.getElementById("question");
const yes = document.getElementById("yes");
const no = document.getElementById("no");

yes.addEventListener("click",()=>{

    question.style.transition=".8s";

    setTimeout(()=>{

        question.style.display="none";

        // Aquí iniciaremos los fuegos artificiales
        startFireworks();

    },800);

});

no.addEventListener("click",()=>{

    document.body.classList.add("sad");

});

function hideQuestion(){

    const buttons=document.querySelector(".buttons");

    buttons.classList.add("hide");

    setTimeout(()=>{

        question.classList.add("hide");

    },250);

}

yes.addEventListener("click",()=>{

    hideQuestion();

    setTimeout(()=>{

        question.remove();

        startFireworks();

    },1600);

});

no.addEventListener("click",()=>{

    hideQuestion();

    setTimeout(()=>{

        question.remove();

        document.body.classList.add("sad");

    },1600);

});






// ========================================
// FIREWORKS ENGINE v2.0
// Para Amarena ❤️
// ========================================


// Tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// ========================================
// CONFIGURACIÓN
// ========================================

const CONFIG = {

    // Lanzamiento
    launchMinDelay: 1700,
    launchMaxDelay: 3200,

    // Viento
    wind: 0.015,

    // Gravedad
    gravity: 0.05,

    // Brillo
    glow: 25,

    // Fondo
    backgroundAlpha: 0.16,

    flashDarkness:.45,

    // Mini explosiones
    miniExplosionParticles: 35


};

// ========================================
// PALETA DE COLORES
// ========================================

const COLORS = [

    "#FFD166", // dorado
    "#FF8FAB", // rosa
    "#7BDFF2", // azul
    "#BDB2FF", // violeta
    "#A8E6CF", // verde pastel
    "#FFFFFF", // blanco
    "#FFC6FF", // rosa claro
    "#F4A261", // naranja
    "#00F5D4"  // turquesa

];

// ========================================
// TAMAÑOS DE EXPLOSIÓN
// ========================================

const EXPLOSION_SIZES = [

    {
        name: "small",
        particles: 70,
        radius: 90
    },

    {
        name: "medium",
        particles: 140,
        radius: 150
    },

    {
        name: "large",
        particles: 230,
        radius: 220
    },

    {
        name: "giant",
        particles: 420,
        radius: 320
    }

];

// ========================================
// PATRONES
// ========================================

const PATTERNS = [

    "sphere",
    "ring",
    "palm"

];

// ========================================
// ARRAYS DEL MOTOR
// ========================================

const fireworks = [];
const particles = [];
const flashes = [];
const smoke = [];
const sparks = [];
const trails = [];
const starParticles = [];
const miniExplosions = [];

// ========================================
// VARIABLES GLOBALES
// ========================================

let animationRunning = false;

let showFireworks = true;

let globalDarkness = 0;

let windOffset = 0;

let skyFlash = 0;

let specialEventPlaying = false;

let guideStar = null;

let textParticles = [];
// =======================
// EVENTOS ESPECIALES
// =======================

let rapidClicks = [];
let superEventRunning = false;

// ========================================
// UTILIDADES
// ========================================

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ========================================
// FIREWORK
// ========================================

class Firework {

    constructor() {

        // Posición inicial
        this.x = random(canvas.width * 0.15, canvas.width * 0.85);
        this.y = canvas.height + 20;

        // Destino
        this.targetY = random(80, canvas.height * 0.45);

        // Movimiento
        this.vx = random(-0.4, 0.4);
        this.vy = random(-12, -9);

        // Apariencia
        this.color = randomItem(COLORS);

        this.size = randomItem(EXPLOSION_SIZES);

        this.pattern = randomItem(PATTERNS);

        this.radius = 3;

        // Física
        this.gravity = 0.02;

        this.exploded = false;

        // Estela
        this.trail = [];

    }

    update(){

        if(this.exploded) return;

        this.vy += this.gravity;

        this.x += this.vx;

        this.y += this.vy;

        this.trail.push({

            x:this.x,

            y:this.y

        });

        if(this.trail.length>18){

            this.trail.shift();

        }

        if(this.y<=this.targetY){

            this.explode();

        }

    }

    draw(){

        // Estela

        for(let i=0;i<this.trail.length;i++){

            const p=this.trail[i];

            ctx.beginPath();

            ctx.arc(

                p.x,

                p.y,

                (i/this.trail.length)*2.5,

                0,

                Math.PI*2

            );

            ctx.fillStyle=this.color;

            ctx.globalAlpha=i/this.trail.length;

            ctx.shadowBlur=18;

            ctx.shadowColor=this.color;

            ctx.fill();

        }

        ctx.globalAlpha=1;

        // Cohete

        ctx.beginPath();

        ctx.arc(

            this.x,

            this.y,

            this.radius,

            0,

            Math.PI*2

        );

        ctx.fillStyle=this.color;

        ctx.shadowBlur=35;

        ctx.shadowColor=this.color;

        ctx.fill();

    }

    explode(){

    createExplosion(this);

    this.exploded = true;

}
}

// ========================================
// PARTICLE
// ========================================

class Particle{

    constructor(x,y,vx,vy,color){

        this.x=x;
        this.y=y;

        this.vx=vx;
        this.vy=vy;

        this.color=color;

        this.life=80+Math.random()*40;

        this.maxLife=this.life;

        this.radius=random(1.8,3.8);

        this.gravity=.05;

        this.friction=.985;

    }

    update(){

        this.vx*=this.friction;

        this.vy*=this.friction;

        this.vy+=this.gravity;

        this.vx+=CONFIG.wind;

        this.x+=this.vx;

        this.y+=this.vy;

        if(this.life===5){

    for(let i=0;i<3;i++){

        sparks.push(

            new Spark(

                this.x,

                this.y,

                this.color

            )

        );

    }

}

        this.life--;

    }

    draw(){

        const alpha=this.life/this.maxLife;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI*2
        );

        ctx.fillStyle=this.color;

        ctx.globalAlpha=alpha;

        ctx.shadowBlur=10;
ctx.shadowColor=this.color;

        ctx.fill();

        ctx.globalAlpha=1;

    }

}
// ========================================
// FLASH (Iluminación)
// ========================================
class TextParticle{

    constructor(x,y,targetX,targetY,color){

        this.x = x;
        this.y = y;

        this.targetX = targetX;
        this.targetY = targetY;

        this.vx = (Math.random()-0.5)*20;
        this.vy = (Math.random()-0.5)*20;

        this.color = color;

        this.size = 2;

    }

    update(){

        this.vx += (this.targetX - this.x)*0.02;
        this.vy += (this.targetY - this.y)*0.02;

        this.vx *= 0.88;
        this.vy *= 0.88;

        this.x += this.vx;
        this.y += this.vy;

    }

    draw(){

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI*2
        );

        ctx.fillStyle=this.color;

        ctx.fill();

    }

}
class Flash{

    constructor(x,y,color,size){

        this.x=x;
        this.y=y;

        this.color=color;

        this.radius=size;

        this.life=26;

        this.maxLife=26;

    }

    update(){

        this.life--;

    }

    draw(){

        const alpha=this.life/this.maxLife;

        ctx.save();

        ctx.globalCompositeOperation="lighter";

        const gradient=ctx.createRadialGradient(

            this.x,
            this.y,
            0,

            this.x,
            this.y,
            this.radius

        );

        gradient.addColorStop(0,this.color);

        gradient.addColorStop(.25,this.color);

        gradient.addColorStop(1,"transparent");

        ctx.fillStyle=gradient;

        ctx.globalAlpha=.55*alpha;

        ctx.beginPath();

        ctx.arc(

            this.x,

            this.y,

            this.radius,

            0,

            Math.PI*2

        );

        ctx.fill();

        ctx.restore();

    }

}

// ========================================
// SMOKE
// ========================================

class Smoke{

    constructor(x,y,color){

        this.x = x;
        this.y = y;

        this.vx = random(-0.4,0.4);
        this.vy = random(-0.8,-0.2);

        this.radius = random(8,18);

        this.life = 70;
        this.maxLife = 70;

        this.color = color;

    }

    update(){
        this.vx += CONFIG.wind * 0.03;

        this.x += this.vx;

        this.y += this.vy;

        this.radius += 0.35;

        this.life--;

    }

    draw(){

        const alpha = (this.life / this.maxLife) * 0.18;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(180,180,180,${alpha})`;

        ctx.fill();

    }

}

class Spark{

    constructor(x,y,color){

        this.x=x;
        this.y=y;

        this.vx=random(-1.5,1.5);

        this.vy=random(-1.5,1.5);

        this.life=25;

        this.maxLife=25;

        this.color=color;

    }

    update(){
        this.vx += CONFIG.wind * 0.08;

        this.x+=this.vx;

        this.y+=this.vy;

        this.life--;

    }

    draw(){

        ctx.beginPath();

        ctx.arc(this.x,this.y,1.5,0,Math.PI*2);

        ctx.fillStyle=this.color;

        ctx.globalAlpha=this.life/this.maxLife;

        ctx.fill();

        ctx.globalAlpha=1;

    }

}

// ========================================
// MINI EXPLOSION
// ========================================

class MiniExplosion{

    constructor(x,y){

        this.x=x;
        this.y=y;

        this.life=35;
        this.maxLife=35;

        this.color=randomItem(COLORS);

        this.particles=[];

        for(let i=0;i<CONFIG.miniExplosionParticles;i++){

            const angle=Math.random()*Math.PI*2;

            const speed=random(1.5,4);

            this.particles.push({

                x:x,
                y:y,

                vx:Math.cos(angle)*speed,

                vy:Math.sin(angle)*speed,

                radius:random(1,3),

                life:35

            });

        }

    }

    update(){

        this.life--;

        for(const p of this.particles){

            p.vx*=0.985;

            p.vy*=0.985;

            p.vy+=0.04;

            p.vx+=CONFIG.wind;

            p.x+=p.vx;

            p.y+=p.vy;

            p.life--;

        }

    }

    draw(){

        ctx.save();

        ctx.globalCompositeOperation="lighter";

        for(const p of this.particles){

            if(p.life<=0) continue;

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.radius,
                0,
                Math.PI*2
            );

            ctx.fillStyle=this.color;

            ctx.globalAlpha=p.life/35;

            ctx.shadowBlur=12;

            ctx.shadowColor=this.color;

            ctx.fill();

        }

        ctx.restore();

        ctx.globalAlpha=1;

    }

}

class Shockwave{

    constructor(x,y){

        this.x=x;
        this.y=y;

        this.radius=10;

        this.life=25;

    }

    update(){

        this.radius+=7;

        this.life--;

    }

    draw(){

        ctx.beginPath();

        ctx.arc(

            this.x,

            this.y,

            this.radius,

            0,

            Math.PI*2

        );

        ctx.strokeStyle=`rgba(255,255,255,${
            this.life/25
        })`;

        ctx.lineWidth=2;

        ctx.stroke();

    }

}

const shockwaves=[];

function registerClick(){

    const now = Date.now();

    rapidClicks.push(now);

    // Conserva solo los clics de los últimos 3 segundos
    rapidClicks = rapidClicks.filter(
        time => now - time < 3000
    );

    if(rapidClicks.length >= 5 && !superEventRunning){

        rapidClicks = [];

        startSecretEvent();

    }

}


function startSecretEvent(){

    if(superEventRunning) return;

    superEventRunning = true;
    specialEventPlaying = true;

    // Después de 2 segundos comienza el evento
    setTimeout(()=>{

        fireworks.length = 0;

        particles.forEach(p => p.life *= 0.25);
        smoke.forEach(s => s.life *= 0.25);
        sparks.forEach(s => s.life *= 0.25);

        miniExplosions.length = 0;
        shockwaves.length = 0;
        flashes.length = 0;

        createGuideStar();

        // 2.5 segundos después aparece el mensaje
        
    },2000);

    // 8 segundos después termina el evento
    setTimeout(()=>{

        specialEventPlaying = false;
        superEventRunning = false;

        guideStar = null;
        textParticles = [];

        launchFirework();

    },13000);

}

function createLoveMessage(){
for(let i=0;i<10;i++){

    const fw = new Firework();

    fw.x = canvas.width*0.25;

    fireworks.push(fw);

}
for(let i=0;i<10;i++){

    const fw = new Firework();

    fw.x = canvas.width*0.75;

    fireworks.push(fw);

}
    textParticles = [];

    const offCanvas = document.createElement("canvas");
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;

    const offCtx = offCanvas.getContext("2d");

    offCtx.fillStyle = "white";

    offCtx.textAlign = "center";

    offCtx.font = "bold 80px Arial";

    offCtx.fillText(
        "TE AMO",
        offCanvas.width/2,
        offCanvas.height/2 - 30
    );

    offCtx.font = "bold 70px Arial";

    offCtx.fillText(
        "XIMENA",
        offCanvas.width/2,
        offCanvas.height/2 + 70
    );

    const image = offCtx.getImageData(
        0,
        0,
        offCanvas.width,
        offCanvas.height
    );

    for(let y=0; y<image.height; y+=4){

        for(let x=0; x<image.width; x+=4){

            const index = (y*image.width + x)*4;

            if(image.data[index+3] > 150){

                textParticles.push(

                    new TextParticle(

                        canvas.width/2,
                        canvas.height/2,

                        x,
                        y,

                        "white"

                    )

                );

            }

        }

    }

}
// ========================================
// EXPLOSIONES
// ========================================

function createExplosion(firework){

    const amount=firework.size.particles;

    const power=firework.size.radius;
flashes.push(

    new Flash(

    firework.x,

    firework.y,

    firework.color,

    firework.size.radius * 1.8

)
);

skyFlash=1;

for(let i=0;i<15;i++){

    smoke.push(

        new Smoke(

            firework.x,

            firework.y,

            firework.color

        )

    );

}
    switch(firework.pattern){

        case "ring":
            createRing(
                firework,
                amount,
                power
            );
            break;

        case "palm":
            createPalm(
                firework,
                amount,
                power
            );
            break;

        default:
            createSphere(
                firework,
                amount,
                power
            );

    }

}

function createSphere(fw,count,power){

    for(let i=0;i<count;i++){

        const angle=random(0,Math.PI*2);

        const speed=random(
            power*.02,
            power*.045
        );

        particles.push(

            new Particle(

                fw.x,
                fw.y,

                Math.cos(angle)*speed,

                Math.sin(angle)*speed,

                fw.color

            )

        );

    }

}


function createRing(fw,count,power){

    for(let i=0;i<count;i++){

        const angle=(Math.PI*2/count)*i;

        const speed=power*.03;

        particles.push(

            new Particle(

                fw.x,
                fw.y,

                Math.cos(angle)*speed,

                Math.sin(angle)*speed,

                fw.color

            )

        );

    }

}


function createPalm(fw,count,power){

    for(let i=0;i<count;i++){

        const angle=random(
            -Math.PI*.35,
            Math.PI*.35
        );

        const speed=random(
            power*.02,
            power*.05
        );

        particles.push(

            new Particle(

                fw.x,
                fw.y,

                Math.sin(angle)*speed,

                -Math.cos(angle)*speed,

                fw.color

            )

        );

    }

}


function animate(){
    
for(let i=flashes.length-1;i>=0;i--){

    flashes[i].update();

    flashes[i].draw();

    if(flashes[i].life<=0){

        flashes.splice(i,1);

    }

}
    requestAnimationFrame(animate);

    skyFlash*=.90;
for(let i=smoke.length-1;i>=0;i--){

    smoke[i].update();

    smoke[i].draw();

    if(smoke[i].life<=0){

        smoke.splice(i,1);

    }

}
const darkness=

CONFIG.backgroundAlpha+

skyFlash*

CONFIG.flashDarkness;

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "rgba(0,0,0,0.02)";
ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let i=fireworks.length-1;i>=0;i--){

        const fw=fireworks[i];

        fw.update();

        fw.draw();

        if(fw.exploded){

            fireworks.splice(i,1);

        }

    }
    for(let i=particles.length-1;i>=0;i--){

    const p=particles[i];

    p.update();

    p.draw();

    if(p.life<=0){

        particles.splice(i,1);

    }

}
for(let i=sparks.length-1;i>=0;i--){

    sparks[i].update();

    sparks[i].draw();

    if(sparks[i].life<=0){

        sparks.splice(i,1);

    }

}
for(let i = shockwaves.length - 1; i >= 0; i--){

    shockwaves[i].update();

    shockwaves[i].draw();

    if(shockwaves[i].life <= 0){

        shockwaves.splice(i,1);

    }

}
for(let i=miniExplosions.length-1;i>=0;i--){

    const mini=miniExplosions[i];

    mini.update();

    mini.draw();

    if(mini.life<=0){

        miniExplosions.splice(i,1);

    }

}

if(guideStar){

    guideStar.alpha = Math.min(
        guideStar.alpha + 0.02,
        1
    );

    guideStar.radius +=
        (guideStar.targetRadius - guideStar.radius) * 0.04;
        guideStar.pulse += 0.15;

guideStar.radius += Math.sin(guideStar.pulse) * 0.3;

    ctx.save();

    ctx.globalAlpha = guideStar.alpha;

    ctx.beginPath();

    ctx.arc(
        guideStar.x,
        guideStar.y,
        guideStar.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "white";

    ctx.shadowBlur = 40;

    ctx.shadowColor = "white";

    ctx.fill();

    ctx.restore();
    if(guideStar.explode){

    guideStar = null;

    createLoveMessage();

}

}
textParticles.forEach(tp=>{

    tp.update();

    tp.draw();

});
}
function createTestParticles(){

    textParticles=[];

    for(let i=0;i<300;i++){

        textParticles.push(

            new TextParticle(

                canvas.width/2,
                canvas.height/2,

                Math.random()*canvas.width,

                Math.random()*canvas.height,

                "white"

            )

        );

    }

}
function createGuideStar(){

    guideStar = {

        x: canvas.width / 2,
        y: canvas.height * 0.35,

        radius: 2,
        targetRadius: 18,

        alpha: 0,

        pulse: 0,

        explode: false

    };

    // Después de 2 segundos, explota
    setTimeout(()=>{

        guideStar.explode = true;

    },2000);

}
function launchFirework(){

    // Si hay un evento especial, esperar y volver a comprobar
    if(specialEventPlaying){

        setTimeout(launchFirework,500);
        return;

    }

    fireworks.push(new Firework());

    const next = random(
        CONFIG.launchMinDelay,
        CONFIG.launchMaxDelay
    );

    setTimeout(
        launchFirework,
        next
    );

}

function startFireworks(){

    if(animationRunning) return;

    animationRunning=true;

    animate();

    launchFirework();

}
canvas.addEventListener("pointerdown",e=>{

    const rect=canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    registerClick();

    shockwaves.push(
    new Shockwave(x,y)
);

const chance = Math.random();

if(chance < 0.55){

    miniExplosions.push(
        new MiniExplosion(x,y)
    );

}
else if(chance < 0.75){

    createHeartExplosion(x,y);

}
else if(chance < 0.90){

    createStarExplosion(x,y);

}
else if(chance < 0.98){

    createMoonExplosion(x,y);

}
else{

    createSupernova(x,y);

}

});

const starColors = [
    "#FFD700",
    "#FFF176",
    "#FFFFFF",
    "#FFE082"
];

const color = randomItem(starColors);

function createHeartExplosion(x, y){
for(let i=0;i<9;i++){

    setTimeout(()=>{

        fireworks.push(new Firework());

    },i*250);

}
    const color = "#FF5C8A";
    const scale = 8;

    for(let t = 0; t < Math.PI * 2; t += 0.05){

        const hx = 16 * Math.pow(Math.sin(t),3);

        const hy =
            13 * Math.cos(t)
            -5 * Math.cos(2*t)
            -2 * Math.cos(3*t)
            -Math.cos(4*t);

        particles.push(

            new Particle(

                x,
                y,

                (hx * scale) / 25,
                (-hy * scale) / 25,

                color

            )

        );

    }

}

function createStarExplosion(x, y){
for(let i=0;i<5;i++){

    setTimeout(()=>{

        fireworks.push(new Firework());

    },i*250);

}
    const color = "#FFD700"; // Dorado

    const outerRadius = 90;
    const innerRadius = 40;

    const points = [];

    // Construir los 10 vértices de la estrella
    for(let i = 0; i < 10; i++){

        const angle = -Math.PI / 2 + i * Math.PI / 5;

        const r = (i % 2 === 0) ? outerRadius : innerRadius;

        points.push({
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r
        });
    }

    // Dibujar cada lado de la estrella
    for(let i = 0; i < points.length; i++){

        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        for(let t = 0; t <= 1; t += 0.03){

            const px = p1.x + (p2.x - p1.x) * t;
            const py = p1.y + (p2.y - p1.y) * t;

            particles.push(

                new Particle(

                    x,
                    y,

                    px / 18,
                    py / 18,

                    color

                )

            );

        }

    }

}

function createMoonExplosion(x, y){
for(let i=0;i<5;i++){

    setTimeout(()=>{

        fireworks.push(new Firework());

    },i*250);

}
    const moonColors = [
        "#FFFFFF",
        "#E6E6FA",
        "#CFE8FF",
        "#DDEEFF"
    ];

    const color = randomItem(moonColors);

    const radius = 70;
    const offset = 28;

    for(let angle = 0; angle < Math.PI * 2; angle += 0.03){

        for(let r = radius * 0.55; r <= radius; r += 3){

            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;

            // Segundo círculo desplazado para crear la media luna
            const dx = px - offset;
            const dy = py;

            if(dx * dx + dy * dy > radius * radius){

                particles.push(

                    new Particle(

                        x,
                        y,

                        px / 18,
                        py / 18,

                        color

                    )

                );

            }

        }

    }

}
function createSupernova(x, y){
for(let i=0;i<12;i++){

    setTimeout(()=>{

        fireworks.push(new Firework());

    },i*250);

}
    // ===== FASE 1 =====
    // Gran destello en el cielo
    skyFlash = 3;

    // ===== FASE 2 =====
    // Ondas de choque
    shockwaves.push(new Shockwave(x,y));

    setTimeout(()=>{
        shockwaves.push(new Shockwave(x,y));
    },120);

    setTimeout(()=>{
        shockwaves.push(new Shockwave(x,y));
    },240);

    // ===== FASE 3 =====
    // Explosión gigante

    const colors = [
        "#FFFFFF",
        "#7BDFF2",
        "#BDB2FF",
        "#FF8FAB",
        "#FFD166"
    ];

    for(let i = 0; i < 1200; i++){

        const angle = Math.random() * Math.PI * 2;
        const speed = random(2,10);

        particles.push(

            new Particle(

                x,
                y,

                Math.cos(angle) * speed,

                Math.sin(angle) * speed,

                randomItem(colors)

            )

        );

    }

}