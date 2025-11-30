# MicMixer Soundboard 🎵

**Real-time soundboard with microphone mixing for macOS**

MicMixer lets you play sound effects that mix seamlessly with your microphone input for Discord, Zoom, OBS, and other streaming/communication apps. Perfect for streamers, podcasters, and anyone who wants to add audio flair to their calls.

## Features

- Real-time microphone mixing with sound effects
- Independent volume controls for mic and sounds
- Toggle sounds on/off by clicking (click to play, click again to stop)
- Simple MP3 file management (just drop files in the `sounds/` folder)
- Clean, modern UI with visual feedback
- Low latency audio processing

## 🔧 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Install BlackHole Audio Driver
BlackHole is a virtual audio driver that routes audio between applications.

```bash
brew install blackhole-2ch
```

**Or download manually:** [BlackHole Releases](https://github.com/ExistentialAudio/BlackHole/releases)

⚠️ **Important:** Reboot your Mac after installing BlackHole.

### 3. Configure Audio Routing

#### Create Multi-Output Device
1. Open **Audio MIDI Setup** (Spotlight → "Audio MIDI Setup")
2. Click the **+** button (bottom left) → **Create Multi-Output Device**
3. Check both:
   - Your speakers/headphones
   - **BlackHole 2ch**
4. Right-click the Multi-Output Device → **Use This Device For Sound Output**

#### Configure Your Communication App
In Discord, Zoom, OBS, or your streaming software:
- Set **Input Device** to **BlackHole 2ch**

Now your app will receive both your microphone and soundboard audio!

## Usage

### Start the App
```bash
npm start
```

### Add Your Sounds
1. Place MP3 files in the `sounds/` folder
2. Restart the app or it will auto-load them
3. Sound buttons will appear with the filename (without .mp3)

### Using the Soundboard
1. **Select your microphone** from the dropdown
2. **Adjust volumes** using the sliders
3. **Click a sound** to play it
4. **Click again** to stop it
5. Your communication app will receive the mixed audio!

## Controls

| Control | Description |
|---------|-------------|
| Microphone Select | Choose your physical microphone |
| Mic Volume | Adjust microphone input level (0-100%) |
| Sound Volume | Adjust soundboard output level (0-100%) |
| Sound Buttons | Click to play/stop sounds |

## 🔊 How It Works

```
Your Mic ──┐
           ├──> MicMixer ──> Multi-Output ──┬──> Your Speakers
 Sounds ───┘                                  └──> BlackHole ──> Discord/Zoom/OBS
```

1. **MicMixer** captures your microphone and mixes it with sound effects
2. **Multi-Output Device** sends audio to both your speakers and BlackHole
3. **BlackHole** acts as a virtual input for other applications
4. **Your apps** receive the mixed audio stream

## Development

### Build
```bash
npm run build
```

This creates a distributable `.dmg` file in the `dist/` folder.

### Tech Stack
- **Electron** - Desktop app framework
- **Web Audio API** - Real-time audio processing
- **Node.js** - File system operations

## Adding Custom Sounds

Simply drop `.mp3` files into the `sounds/` folder:

```bash
cp my-sound.mp3 sounds/
```

Restart the app and your sound will appear as a button.

## ⚠️ Troubleshooting

**I don't hear any sound**
- Make sure the Multi-Output Device is set as your system output
- Check that both your speakers and BlackHole are checked in the Multi-Output Device

**I can't see BlackHole in Audio MIDI Setup**
- Reboot your Mac after installing BlackHole
- Reinstall BlackHole: `brew reinstall blackhole-2ch`

**My communication app doesn't receive audio**
- Make sure the app's input is set to **BlackHole 2ch**
- Try restarting the communication app

**I hear myself (echo)**
- This is normal through your speakers
- Enable echo cancellation in your communication app
- Or use headphones

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

---

by [Elioflex](https://github.com/Elioflex)

Perfect for streamers, podcasters, and anyone who wants to spice up their audio. 
