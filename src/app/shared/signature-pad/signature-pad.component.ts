import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-signature-pad',
  template: `
    <div class="signature-container">
      <canvas #signatureCanvas
              class="signature-pad"
              (mousedown)="startDrawing($event)"
              (mousemove)="draw($event)"
              (mouseup)="stopDrawing()"
              (touchstart)="startDrawing($event)"
              (touchmove)="draw($event)"
              (touchend)="stopDrawing()"
              (mouseleave)="stopDrawing()">
      </canvas>
      <div class="signature-actions mt-2">
        <button class="btn btn-secondary" (click)="clear()">Effacer</button>
        <button class="btn btn-primary" (click)="save()">Valider</button>
      </div>
    </div>
  `,
  styles: [`
    .signature-container {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin: 10px 0;
    }
    .signature-pad {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: crosshair;
      background-color: white;
    }
    .signature-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
  `]
})
export class SignaturePadComponent {
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  @Output() signatureSaved = new EventEmitter<string>();
  
  private context!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  ngAfterViewInit() {
    const canvas = this.signatureCanvas.nativeElement;
    canvas.width = 400;
    canvas.height = 200;
    this.context = canvas.getContext('2d')!;
    this.initializeCanvas();
  }

  private initializeCanvas() {
    this.context.lineWidth = 2;
    this.context.strokeStyle = '#000000';
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    // Set white background
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, this.signatureCanvas.nativeElement.width, this.signatureCanvas.nativeElement.height);
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isDrawing = true;
    const coords = this.getCoordinates(event);
    this.lastX = coords.x;
    this.lastY = coords.y;
  }

  draw(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    if (!this.isDrawing) return;

    const coords = this.getCoordinates(event);
    this.context.beginPath();
    this.context.moveTo(this.lastX, this.lastY);
    this.context.lineTo(coords.x, coords.y);
    this.context.stroke();
    this.lastX = coords.x;
    this.lastY = coords.y;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clear() {
    const canvas = this.signatureCanvas.nativeElement;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.initializeCanvas();
  }

  save() {
    const canvas = this.signatureCanvas.nativeElement;
    // Convert to JPEG format instead of PNG
    const signature = canvas.toDataURL('image/jpeg', 0.8);
    this.signatureSaved.emit(signature);
  }

  private getCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.signatureCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();

    if (event instanceof MouseEvent) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    } else {
      const touch = event.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
  }
}