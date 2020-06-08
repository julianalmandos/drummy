//Data
const keys = [
    {
        name: 'clap',
        key: {
            name: 'A',
            code: 65
        },
        file: 'sounds/clap.wav'
    },
    
]

//Functions
function playSound(e) {
    const audioElement = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    if (!audioElement) return; //Return if element doesn't exist.
    audioElement.currentTime = 0;
    audioElement.play();
    makeAnimation(document.querySelector(`.key[data-key="${e.keyCode}"]`));
    console.log('ejecuta');
}

function makeAnimation(keyElement) {
    keyElement.classList.add('playing');
}

function removeAnimation(e) {
    if (e.propertyName !== 'transform')
    this.classList.remove('playing');
}

function renderKey(sound) {
    //Create parent div
    const keyElement = document.createElement('div');
    keyElement.classList.add('key');
    keyElement.setAttribute('data-key', sound.key.code);
    //Create key name element
    const keyNameElement = document.createElement('kbd');
    keyNameElement.innerText = sound.key.name;
    //Create sound name element
    const keySoundNameElement = document.createElement('span');
    keySoundNameElement.classList.add('sound');
    keySoundNameElement.innerText = sound.name;
    //Append both elements to the parent div
    keyElement.appendChild(keyNameElement);
    keyElement.appendChild(keySoundNameElement);
    //Add event listener to remove animation when pressing a key
    keyElement.addEventListener('transitionend', removeAnimation);
    document.querySelector('.keys').appendChild(keyElement);
}

function renderAudio(sound) {
    //Create audio element
    const soundElement = document.createElement('audio');
    soundElement.setAttribute('data-key', sound.key.code);
    soundElement.src = sound.file;
    document.querySelector('.audios').appendChild(soundElement);
}

async function getData() {
    let response = await fetch('data.json');
    let data = await response.json();
    return data;
}

async function generateKeys() {
    //Get data from a .json file and render everything
    let data = await getData();
    data.forEach(sound => {
        renderKey(sound);
        renderAudio(sound);
    })
}

function openWindow() {
    this.classList.toggle('active');
    const form = document.querySelector('.metronome__menu__form');
    form.style.display = form.style.display == 'flex' ? 'none' : 'flex';
}

function playMetronome() {
    //Should change this and make it dynamic (maybe a select?)
    const tinkAudioElement = document.querySelector('audio[data-key="76"]');
    const bpmInput = document.querySelector('.metronome__menu__form__bpm');
    const bpmValue = bpmInput.value;
    //If the bpm wasn't specified, return
    if (!bpmValue) return;
    //Calculates the miliseconds between beats
    const bpmInterval = 60000 / bpmValue;
    stopMetronome();
    this.classList.add('metronome__menu__form__button--active');
    bpmIntervalId = setInterval(() => {
        tinkAudioElement.currentTime = 0;
        tinkAudioElement.play();
    }, bpmInterval);
}

function stopMetronome() {
    document.querySelector('.metronome__menu__form__play').classList.remove('metronome__menu__form__button--active');
    clearInterval(bpmIntervalId);
}

//Main
let bpmIntervalId;

window.addEventListener('load', generateKeys);
window.addEventListener('keydown', playSound);
document.querySelector('.metronome__menu__button').addEventListener('click', openWindow);
document.querySelector('.metronome__menu__form__play').addEventListener('click', playMetronome);
document.querySelector('.metronome__menu__form__stop').addEventListener('click', stopMetronome);