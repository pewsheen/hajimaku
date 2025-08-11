# Hajimaku

**>> WORK IN PROGESS <<**

For language learning purposes. Simple real-time transcript Chrome extension for YouTube live stream. Hajimaru Hajimaru 🦆🦆🦆 !!

`Currently support Japanese only.`

Inspired by [jimakuChan](https://github.com/sayonari/jimakuChan). This project use `SpeechRecognition` WebAPI to recognize and transcribe, which means it's using your operating system's recognition feature.

### Requirements:

- Reroute your audio output to microphone input (I'm using [VB-Cable](https://vb-audio.com/Cable/))
- Chrome 139+ (first version supporting `SpeechRecognition` WebAPI)

### How to use:

In Chrome Extension page, load `public` directory that was generated after we ran `pnpm build`.

### Roadmap:

- Inject switch into YouTube's control panel
- Popup window to adjust transcriptor's options
- Translation using Google or OpenAI (by providing API key)
