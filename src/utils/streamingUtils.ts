
export class StreamingTextRenderer {
  private text: string;
  private onUpdate: (text: string) => void;
  private onComplete: () => void;
  private speed: number;
  private currentIndex: number = 0;
  private intervalId: number | null = null;
  private isRunning: boolean = false;

  constructor(
    text: string,
    onUpdate: (text: string) => void,
    onComplete: () => void,
    speed: number = 30
  ) {
    this.text = text;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
    this.speed = speed;
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.currentIndex = 0;
    
    this.intervalId = window.setInterval(() => {
      if (this.currentIndex >= this.text.length) {
        this.stop();
        this.onComplete();
        return;
      }
      
      // Add character(s) - sometimes add multiple for faster streaming
      let charsToAdd = 1;
      if (Math.random() > 0.7) charsToAdd = 2; // 30% chance to add 2 chars
      if (Math.random() > 0.9) charsToAdd = 3; // 10% chance to add 3 chars
      
      this.currentIndex = Math.min(this.currentIndex + charsToAdd, this.text.length);
      this.onUpdate(this.text.substring(0, this.currentIndex));
    }, this.speed);
  }

  stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }
}
