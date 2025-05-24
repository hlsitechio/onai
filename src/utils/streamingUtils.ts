
// Utilities for handling streaming AI responses
export class StreamingTextRenderer {
  private text: string = '';
  private onUpdate: (text: string) => void;
  private onComplete: () => void;
  private intervalId: NodeJS.Timeout | null = null;
  private currentIndex: number = 0;
  private speed: number;

  constructor(
    fullText: string, 
    onUpdate: (text: string) => void, 
    onComplete: () => void,
    speed: number = 30 // milliseconds between characters
  ) {
    this.text = fullText;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
    this.speed = speed;
  }

  start() {
    this.currentIndex = 0;
    this.intervalId = setInterval(() => {
      if (this.currentIndex < this.text.length) {
        this.onUpdate(this.text.substring(0, this.currentIndex + 1));
        this.currentIndex++;
      } else {
        this.stop();
        this.onComplete();
      }
    }, this.speed);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  skipToEnd() {
    this.stop();
    this.onUpdate(this.text);
    this.onComplete();
  }
}

export const createTypingEffect = (
  text: string,
  callback: (displayText: string) => void,
  onComplete?: () => void,
  speed: number = 30
): (() => void) => {
  let index = 0;
  let intervalId: NodeJS.Timeout;

  const type = () => {
    if (index < text.length) {
      callback(text.substring(0, index + 1));
      index++;
    } else {
      clearInterval(intervalId);
      onComplete?.();
    }
  };

  intervalId = setInterval(type, speed);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    callback(text); // Show full text immediately
    onComplete?.();
  };
};

export const splitTextIntoChunks = (text: string, chunkSize: number = 50): string[] => {
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + ' ' + word).length <= chunkSize) {
      currentChunk += (currentChunk ? ' ' : '') + word;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};
