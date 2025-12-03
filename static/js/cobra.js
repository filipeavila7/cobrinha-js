const canvas = document.getElementById("game") //pegar o canvas do html
const ctx = canvas.getContext("2d") // permite desenhar formas 2d no canvas
let gameOver = false;
const btnReset = document.querySelector("#btn-reset")
const btnPlay = document.querySelector("#btn-play")
const fruitImg = document.getElementById("fruitImg")
const down = new Audio("static/audio/baixo.aac")
const right = new Audio("static/audio/direita.aac")
const left = new Audio("static/audio/esquerda.aac")
const up = new Audio("static/audio/cima.aac")
const somFruta = new Audio("static/audio/fruta-s.aac")
const somMorte = new Audio("static/audio/morte.aac")

let contador = document.querySelector("#contador")
let valor = 0


// definir o canvas de acordo com a largura da tela
function ajustarCanvas() {
    const menor = Math.min(window.innerWidth, window.innerHeight);
}
ajustarCanvas();
window.addEventListener("resize", ajustarCanvas);





let audioUnlocked = false;

document.addEventListener("keydown" , () => {
    if (!audioUnlocked) {
        const testSound = new Audio();
        testSound.play().catch(()=>{}); // tentativa “vazia” só para liberar
        audioUnlocked = true;
        console.log("Áudio desbloqueado");
    }
});

document.addEventListener("click" , () => {
    if (!audioUnlocked) {
        const testSound = new Audio();
        testSound.play().catch(()=>{}); // tentativa “vazia” só para liberar
        audioUnlocked = true;
        console.log("Áudio desbloqueado");
    }
});

btnPlay.style.display = "block"

// Inicialmente, esconder o botão de reset
btnReset.style.display = "none";

btnReset.addEventListener("click",resetarJogo)

btnPlay.addEventListener("click", iniciar)

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && btnReset.style.display === "block") {
        btnReset.click(); // simula clique no botão
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && btnPlay.style.display === "block") {
        btnPlay.click(); // simula clique no botão
    }
});







// criar o tamanho da arena

let tamanho = 50 // tamanho dos blocos
let linhas = 11
let colunas = 11


function ajustarTamanhoBloco() {
    if (window.innerWidth <= 480) {
        // celular
        tamanho = 30;
        canvas.width = 330;
        canvas.height = 330;
    } else {
        // desktop
        tamanho = 50; 
        canvas.width = 550;
        canvas.height = 550;
    }
}

ajustarTamanhoBloco();
window.addEventListener("resize", ajustarTamanhoBloco);

// criando a cobra, contendo cabeça e 2 pixels de corpo


let cobra = [
    {x: 2, y: 5}, // cabeça
    {x: 1,  y: 5}, // corpo
    {x: 0,  y: 5}
]


function desenharFantasminha(px, py) {
    const r = tamanho / 2;

    // cabeça (semicírculo)
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(px + r, py + r, r, Math.PI, 0);
    ctx.fill();

    // barriga
    ctx.fillRect(px, py + r, tamanho, r);

    // olhinhos
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(px + r - 5, py + r - 6, 3, 0, Math.PI * 2);
    ctx.arc(px + r + 5, py + r - 6, 3, 0, Math.PI * 2);
    ctx.fill();

    // língua 👅
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(px + r, py + r + 4, 4, 0, Math.PI);
    ctx.fill();
}



function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,     x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,     y + h, r);
    ctx.arcTo(x,     y + h, x,     y,     r);
    ctx.arcTo(x,     y,     x + w, y,     r);
    ctx.closePath();
    ctx.fill();
}

function desenharCobra() {
    cobra.forEach((parte, index) => {
        const isHead = index === 0;

        // COR
        ctx.fillStyle = isHead ? "#66ff66" : "#33dd33";

        // DESENHA BLOCO ARREDONDADO
        roundedRect(
            parte.x * tamanho,
            parte.y * tamanho,
            tamanho,
            tamanho,
            6
        );

        // ➤ DESENHAR OLHOS SOMENTE NA CABEÇA
        if (isHead) {
            const cx = parte.x * tamanho;
            const cy = parte.y * tamanho;

            // Olho esquerdo
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(
                cx + tamanho * 0.35,
                cy + tamanho * 0.35,
                tamanho * 0.12,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Olho direito
            ctx.beginPath();
            ctx.arc(
                cx + tamanho * 0.65,
                cy + tamanho * 0.35,
                tamanho * 0.12,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    });
}


function desenharXadrez(cor1 = "#13508f", cor2 = "#0e3b63") {
    for (let x = 0; x < colunas; x++) {
        for (let y = 0; y < linhas; y++) {
            // alterna cor com base em x+y
            ctx.fillStyle = ( (x + y) % 2 === 0 ) ? cor1 : cor2;
            ctx.fillRect(x * tamanho, y * tamanho, tamanho, tamanho);
        }
    }
}

let ultimoSomFruta = 0;
const intervaloFruta = 40; 

function tocarSomFruta() {
    const agora = performance.now();

    // evita tocar duas vezes no mesmo frame
    if (agora - ultimoSomFruta < intervaloFruta) return;

    // cria nova instância do áudio para permitir sobreposição REAL
    const instancia = somFruta.cloneNode(true);
    instancia.play();

    ultimoSomFruta = agora;
}

let ultimoSomMorte = 0;
const intervaloMorte = 120;

function tocarSomMorte() {
    const agora = performance.now();

    // evita tocar duas vezes no mesmo frame
    if (agora - ultimoSomMorte < intervaloMorte) return;

    // cria nova instância do áudio para permitir sobreposição REAL
    const instancia = somMorte.cloneNode(true);
    instancia.play();

    ultimoSomMorte = agora;
}




// criando o movimento para a cobra:

// se andar pra direita: aumenta o x

// se andar pra esquerda: diminui o x

// se andar pra cima: diminui o y

// se andar pra baixo: aumenta o y

// definir a direção inicial

let dx = 1 // mover para a direita inicialmente
let dy = 0

function attContador(){
    valor+=1
    contador.textContent = valor
}

function moverCobra() {
    const cabeca = { ...cobra[0] } // pegando a cabeca da cobra que esta non primeiro indice do array [0]

    //mover
    cabeca.x += dx // mover horizontalmente eixo x, adciona a direcao que no caso é 1, ent ela andara um bloco para a direita
    cabeca.y += dy // mover verticalmente eixo y


    //logicas para perder

    //bater nas paredes

    // X < 0 → saiu pela esquerda

    // X ≥ colunas → saiu pela direita

    // Y < 0 → saiu por cima

    // Y ≥ linhas → saiu por baixo

    if (cabeca.x < 0 || cabeca.x >= colunas || cabeca.y < 0 || cabeca.y >= linhas) {
        gameOver = true;
        tocarSomMorte() 
        valor = "Game Over!"
        contador.textContent = valor
        return;
    }

    //bater no proprio corpo

    for (let i = 0; i < cobra.length; i++) { // percorrer o tamanho da cobra
        if (cabeca.x === cobra[i].x && cabeca.y === cobra[i].y) { // se a posicao da cabeca for o corpo da cobra/indice = cobra[i]
            gameOver = true;
            tocarSomMorte() 
            valor = "Game Over!"
            contador.textContent = valor
            return;
        }
    }

    //add nova cabeça no array
    cobra.unshift(cabeca)

    if (cabeca.x === fruta.x && cabeca.y === fruta.y) {
        gerarFruta(); //gera nova fruta
        tocarSomFruta()// não remove o rabo, fazendo ela crescer
        attContador()
    } else {
        //remover o rabo
        cobra.pop()
    }



    // crescer um bloco na cabeça e diminuir 1 no rabo para criar o efeito de movimento
}

// controle de repetição
let ultimaDirecao = null;
let ultimoSom = 0;
const intervaloMin = 40;   // ms — ajuste se quiser mais rápido ou lento


function tocarSomDirecao(dx, dy) {
    if (!audioUnlocked) return;

    const agora = performance.now();
    const direcao = `${dx},${dy}`;

    // evita repetir som da mesma direção
    if (direcao === ultimaDirecao) return;

    // evita tocar som rápido demais e sobrepor
    if (agora - ultimoSom < intervaloMin) return;

    let audio;

    if (dx === 0 && dy === -1) audio = up;
    else if (dx === 0 && dy === 1) audio = down;
    else if (dx === -1 && dy === 0) audio = left;
    else if (dx === 1 && dy === 0) audio = right;

    if (!audio) return;

    audio.currentTime = 0;
    audio.play();

    ultimaDirecao = direcao;
    ultimoSom = agora;
}





// adcionando eventos nas teclas do teclado

// mover com a seta pra cima ou a tecla w
document.addEventListener("keydown", (evt) => {
    // impede repetição quando tecla está segurada
    if (evt.repeat) return;

    if (evt.key === "ArrowUp" || evt.key === "w") {
        if (dy !== 1) { // impede de virar ao contrário, so move caso a direcao n seja a contraria
            dx = 0
            dy = -1  // -1 para subir
            tocarSomDirecao(dx, dy)
        }
    }
    // baixo
    else if (evt.key === "ArrowDown" || evt.key === "s") {
        if (dy !== -1) {
            dx = 0
            dy = 1
            tocarSomDirecao(dx, dy)
        }
    }
    // direita
    else if (evt.key === "ArrowRight" || evt.key === "d") {
        if (dx !== -1) {
            dx = 1
            dy = 0
            tocarSomDirecao(dx, dy)
        }
    }
    // essquerda
    else if (evt.key === "ArrowLeft" || evt.key === "a") {
        if (dx !== 1) {
            dx = -1
            dy = 0
            tocarSomDirecao(dx, dy)
        }
    }

})


let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
    if (e.target.id === "btn-play") return; // permite o click do botão
    e.preventDefault(); // impede scroll/zoom no restante da tela
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
    e.preventDefault(); // impede scroll/zoom
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) return;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && dx !== -1) { dx = 1; dy = 0; }
        else if (deltaX < 0 && dx !== 1) { dx = -1; dy = 0; }
    } else {
        if (deltaY > 0 && dy !== -1) { dx = 0; dy = 1; }
        else if (deltaY < 0 && dy !== 1) { dx = 0; dy = -1; }
    }

    tocarSomDirecao(dx, dy);
}, { passive: false });



// criar uma função para gerar frutas em lugares aleatorios da arena
// 25 colunas = x de 0 a 24
// 25 linhas = y de 0 a 24

//definir a posição inicial da primeira fruta

let fruta = { x: 7, y: 5 }

function gerarFruta() {
    // total da arena
    const arenaTotal = colunas * linhas
    // caso a cobra ocupe toda a arena
    if (cobra.length >= arenaTotal) {
        gameOver = true;
        alert("Parabéns — você preencheu a arena! Vitória!");
        return;
        btnReset.style.display = "block"
    }

    // set para saber qual posições a cobra ocupa

    const ocupados = new Set(cobra.map(p => `${p.x},${p.y}`))

    // criar lista de posições livres na arena

    const livres = []
    for (let x = 0; x < colunas; x++) {
        for (let y = 0; y < linhas; y++) {
            const key = `${x},${y}`;
            if (!ocupados.has(key)) {
                livres.push({ x, y });
            }
        }
    }

    const idx = Math.floor(Math.random() * livres.length);
    fruta = livres[idx];
    
}

// função para denhar a fruta

function desenharFruta() {
    ctx.drawImage(
        fruitImg,
        fruta.x * tamanho,
        fruta.y * tamanho,
        tamanho,
        tamanho
    );
}


function loop() {
    if (gameOver){
        btnReset.style.display = "block"
        return;
    } 
    // para o jogo sem travar a tela
    desenharXadrez(); 
    moverCobra()
    desenharCobra()
    desenharFruta()
}

let intervalo = null

function iniciar(){
    btnPlay.style.display = "none"
    btnReset.style.display = "none"
    if (intervalo){
        clearInterval(intervalo)
    }
   intervalo = setInterval(loop, 100)
}


function resetarJogo() {
    cobra = [
        {x: 2, y: 5},
        {x: 1,  y: 5},
        {x: 0,  y: 5}
    ];

    dx = 1;
    dy = 0;

    fruta = { x: 7, y: 5 };

    gameOver = false;
    valor = 0
    contador.textContent = valor
    btnReset.style.display = "none";
    btnPlay.style.display = "none";
}


desenharXadrez()
desenharCobra()
desenharFruta()




