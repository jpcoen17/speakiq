interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: ISpeechRecognitionConstructor;
  webkitSpeechRecognition?: ISpeechRecognitionConstructor;
}

function getSpeechRecognitionConstructor(): ISpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as WindowWithSpeech;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type SpeechResultCallback = (text: string, isFinal: boolean) => void;
export type SpeechErrorCallback = (error: string) => void;

export class SpeechProcessor {
  private recognition: ISpeechRecognition | null = null;
  private isListening = false;
  private startTime: number = 0;

  constructor() {
    this.initRecognition();
  }

  private initRecognition(): void {
    const Constructor = getSpeechRecognitionConstructor();
    if (!Constructor) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }
    this.recognition = new Constructor();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";
    this.recognition.maxAlternatives = 1;
  }

  isSupported(): boolean {
    return getSpeechRecognitionConstructor() !== null;
  }

  start(
    onResult: SpeechResultCallback,
    onError: SpeechErrorCallback,
    onEnd: () => void
  ): void {
    if (!this.recognition) {
      onError("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    if (this.isListening) {
      this.stop();
    }

    this.startTime = Date.now();

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.isListening = false;
      switch (event.error) {
        case "no-speech":
          onError("No speech detected. Please try speaking again.");
          break;
        case "audio-capture":
          onError("Microphone not accessible. Please check your device settings.");
          break;
        case "not-allowed":
          onError("Microphone permission denied. Please allow microphone access and refresh.");
          break;
        case "network":
          onError("Network error during speech recognition. Please check your connection.");
          break;
        default:
          onError(`Speech recognition error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    try {
      this.recognition.start();
    } catch {
      onError("Failed to start speech recognition. Please try again.");
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  getDuration(): number {
    return (Date.now() - this.startTime) / 1000;
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export function createAudioVisualizer(
  canvas: HTMLCanvasElement,
  stream: MediaStream
): () => void {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);

  analyser.fftSize = 256;
  source.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const ctx = canvas.getContext("2d")!;

  let animationId: number;

  const draw = () => {
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
      gradient.addColorStop(0, "#00d4ff");
      gradient.addColorStop(1, "#00ff88");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  draw();

  return () => {
    cancelAnimationFrame(animationId);
    audioContext.close();
  };
}
