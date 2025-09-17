# Hajimaku

**>> WORK IN PROGESS <<**

For language learning purposes. Simple real-time transcript Chrome extension for YouTube live stream. Hajimaru Hajimaru 🦆🦆🦆 !!

Inspired by [jimakuChan](https://github.com/sayonari/jimakuChan). This project use `SpeechRecognition` WebAPI to recognize and transcribe, which means it's using your operating system's recognition feature.

### Requirements:

- Reroute your audio output to microphone input (I'm using [VB-Cable](https://vb-audio.com/Cable/))

### How to use:

- run `pnpm build`
- In Chrome Extension page, load `dist` directory that was generated after we ran `pnpm build`.

### Roadmap:

- Popup window to adjust transcriptor's options
- Translation using Google or OpenAI (by providing API key)
