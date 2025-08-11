# Hajimaku

Simple realtime transcript chrome extension for youtube live stream.

This project is using `SpeechRecognition` WebAPI to recongnize and transcript, which means it's using your operating system's recongition feature.

Hajimaru Hajimaru!!

### Requirements:
- Chrome 139+ (first version supporting `SpeechRecognition` WebAPI)

### How to use:
```
pnpm install
pnpm build
```

In Chrome Extension page, load `dist` directory that generated after we ran `pnpm build`.

### Roadmap:
- Inject switch into youtube's control panel
- Popup window to adjust transcriptor's options
- Translation using Google or OpenAI (by providing API key)
