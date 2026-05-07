export interface SpeechConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
}

export type SpeechResultCallback = (text: string, isFinal: boolean) => void;
export type SpeechErrorCallback = (error: string) => void;

export class SpeechProcessor {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private startTime: number = 0;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || (window as never as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";
    this.recognition.maxAlternatives = 1;
  }

  isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(
      window.SpeechRecognition ||
      (window as never as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition
    );
  }

  start(
    onResult: SpeechResultCallback,
    onError: SpeechErrorCallback,
    onEnd: () => void
  ): void {
    if (!this.recognition) {
      onError("Speech recognition is not supported in your browser.");
      return;
    }

    if (this.isListening) {
      this.stop();
    }

    this.startTime = Date.now();

    this.recognition.onresult = (event) => {
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

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (event.error === "no-speech") {
        onError("No speech detected. Please try again.");
      } else if (event.error === "audio-capture") {
        onError("Microphone not accessible. Please check permissions.");
      } else if (event.error === "not-allowed") {
        onError("Microphone permission denied. Please allow microphone access.");
      } else {
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
    let barHeight: number;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height;

      const gradient = ctx.createLinearGradient(
        0,
        canvas.height - barHeight,
        0,
        canvas.height
      );
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
