const { ipcRenderer } = require('electron');

let audioContext;
let micStream;
let micSource;
let micGain;
let soundGain;
let destination;
let sounds = [];

// Initialize Audio Context
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create gain nodes
    micGain = audioContext.createGain();
    soundGain = audioContext.createGain();
    
    // Create destination (this will route to BlackHole if set up)
    destination = audioContext.createMediaStreamDestination();
    
    // Connect gain nodes to destination
    micGain.connect(destination);
    soundGain.connect(destination);
    
    // Also connect to speakers so you can hear
    soundGain.connect(audioContext.destination);
  }
}

// Get available microphones
async function getMicrophones() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter(device => device.kind === 'audioinput');
    
    const micSelect = document.getElementById('micSelect');
    micSelect.innerHTML = '<option value="">Select Microphone</option>';
    
    audioInputs.forEach(device => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label || `Microphone ${micSelect.options.length}`;
      micSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error getting microphones:', err);
  }
}

// Setup microphone
async function setupMicrophone(deviceId) {
  try {
    initAudioContext();
    
    // Stop existing stream
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
    }
    
    // Get new stream
    const constraints = {
      audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      video: false
    };
    
    micStream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Connect microphone to audio graph
    if (micSource) {
      micSource.disconnect();
    }
    
    micSource = audioContext.createMediaStreamSource(micStream);
    micSource.connect(micGain);
    
    console.log('Microphone setup complete');
  } catch (err) {
    console.error('Error setting up microphone:', err);
    alert('Error accessing microphone. Please check permissions.');
  }
}

// Play sound
function playSound(soundPath) {
  initAudioContext();
  
  const audio = new Audio(soundPath);
  const source = audioContext.createMediaElementSource(audio);
  
  source.connect(soundGain);
  
  audio.play().catch(err => {
    console.error('Error playing sound:', err);
  });
  
  // Visual feedback
  const button = event.target;
  button.classList.add('playing');
  
  audio.onended = () => {
    button.classList.remove('playing');
    source.disconnect();
  };
}

// Load sounds from app folder
async function loadSounds() {
  const files = await ipcRenderer.invoke('get-sounds');
  sounds = files;
  displaySounds();
}

// Display sound buttons
function displaySounds() {
  const soundGrid = document.getElementById('soundGrid');
  soundGrid.innerHTML = '';
  
  sounds.forEach((sound, index) => {
    const button = document.createElement('button');
    button.className = 'sound-button';
    button.textContent = sound.name;
    button.dataset.soundIndex = index;
    
    button.onclick = () => {
      // Check if sound is already playing
      if (button.currentAudio) {
        button.currentAudio.pause();
        button.currentAudio.currentTime = 0;
        button.currentAudio = null;
        button.classList.remove('playing');
        return;
      }
      
      const audio = new Audio(sound.path);
      button.currentAudio = audio;
      
      if (audioContext) {
        const source = audioContext.createMediaElementSource(audio);
        source.connect(soundGain);
      }
      
      audio.play().catch(err => console.error('Error playing sound:', err));
      
      button.classList.add('playing');
      audio.onended = () => {
        button.classList.remove('playing');
        button.currentAudio = null;
      };
    };
    
    soundGrid.appendChild(button);
  });
}

// Event Listeners

document.getElementById('openSoundsFolderBtn').addEventListener('click', async () => {
  await ipcRenderer.invoke('open-sounds-folder');
});

document.getElementById('micSelect').addEventListener('change', (e) => {
  if (e.target.value) {
    setupMicrophone(e.target.value);
  }
});

document.getElementById('micVolume').addEventListener('input', (e) => {
  const volume = e.target.value / 100;
  if (micGain) {
    micGain.gain.value = volume;
  }
  document.getElementById('micVolumeLabel').textContent = `${e.target.value}%`;
});

document.getElementById('soundVolume').addEventListener('input', (e) => {
  const volume = e.target.value / 100;
  if (soundGain) {
    soundGain.gain.value = volume;
  }
  document.getElementById('soundVolumeLabel').textContent = `${e.target.value}%`;
});

// Initialize
getMicrophones();
loadSounds();

// Request microphone permission on load
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => getMicrophones())
  .catch(err => console.error('Microphone permission error:', err));
