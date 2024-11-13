// Scale Generator Logic
document.getElementById("generate").addEventListener("click", generateExercise);

const scales = {
  major: ["C Major", "G Major", "D Major", "A Major", "E Major"],
  minor: ["A Minor", "E Minor", "B Minor", "D Minor", "G Minor"],
  pentatonic: ["C Pentatonic", "A Pentatonic", "G Pentatonic", "E Pentatonic"],
  diminished: ["C Diminished", "D Diminished", "E Diminished", "F Diminished"]
};

function generateExercise() {
  const scaleType = document.getElementById("scale").value;
  const randomScale = scales[scaleType][Math.floor(Math.random() * scales[scaleType].length)];
  document.getElementById("result").textContent = `Practice: ${randomScale}`;
}

// Metronome Logic
let audioContext = null;
let metronomeInterval = null;

document.getElementById("start-metronome").addEventListener("click", startMetronome);
document.getElementById("stop-metronome").addEventListener("click", stopMetronome);

// Handle Space Bar for Starting/Stopping the Metronome
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (metronomeInterval) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }
});

function startMetronome() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } else if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const tempo = parseInt(document.getElementById("tempo").value);
  const interval = (60 / tempo) * 1000;

  metronomeInterval = setInterval(() => {
    playClick();
  }, interval);
}

function stopMetronome() {
  clearInterval(metronomeInterval);
  metronomeInterval = null;
}

function playClick() {
  const bufferSize = audioContext.sampleRate * 0.02;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.2;
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = buffer;
  noise.connect(audioContext.destination);
  noise.start();
}
