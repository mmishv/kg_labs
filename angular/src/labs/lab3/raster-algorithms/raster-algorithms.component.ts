import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-raster-algorithms',
  templateUrl: './raster-algorithms.component.html',
  styleUrls: ['./raster-algorithms.component.css'],
})
export class RasterAlgorithmsComponent {
  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef;
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;
  private messages: string[] = [];

  log(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }

  getMessages() {
    return this.messages;
  }

  ngOnInit() {
    this.drawGrid();
  }

  drawGrid() {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let x = 0.5; x < 400; x += 10) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 400);
        ctx.moveTo(0, x);
        ctx.lineTo(400, x);
      }
      ctx.strokeStyle = '#657786';
      ctx.stroke();
    }
  }

  draw(points: any) {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawGrid();
      ctx.transform(1, 0, 0, -1, 0, canvas.height);
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      if (points.length > 0) ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();
      ctx.transform(1, 0, 0, -1, 0, canvas.height);
    }
  }

  stepByStep() {
    this.draw(this.drawLineStepByStep(this.x1, this.y1, this.x2, this.y2));
  }

  Bresenham() {
    this.draw(this.drawBresenhamLine(this.x1, this.y1, this.x2, this.y2));
  }

  drawLineStepByStep(x1: number, y1: number, x2: number, y2: number) {
    const startTime = new Date();
    const points = [];
    if (x1 > x2) {
      [x1, x2] = [x2, x1];
      [y1, y2] = [y2, y1];
    }
    let dx = x2 - x1;
    let dy = y2 - y1;
    this.log("dx = " + dx);
    this.log("dy = " + dy);
    if (dx == 0 && dy == 0) {
      this.log("dx = 0, dy = 0 => (" + x2 + ', ' + y2 + ')');
      points.push([x1, y1]);
    } else {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.log("|dx| > |dy| => x от " + x1 + " до " + x2);
        for (let x = x1; x <= x2; ++x) {
          let temp = y1 + dy * (x - x1) / dx;
          this.log("y (для x = " + x + ") = " + temp.toFixed(3) + " => (" + x + ', ' + temp.toFixed(3) + ')');
          points.push([x, temp]);
        }
      } else {
        if (y1 > y2) {
          [x1, x2] = [x2, x1];
          [y1, y2] = [y2, y1];
        }
        this.log("|dy| >= |dx| => y от " + y1 + " до " + y2);
        for (let y = y1; y <= y2; ++y) {
          let temp = dx / dy * (y - y1) + x1;
          this.log("x (для y = " + y + ") = " + temp.toFixed(3) + " => (" + temp.toFixed(3) + ', ' + y + ')');
          points.push([temp, y]);
        }
      }
    }
    const endTime = new Date();
    const elapsedTime = endTime.getTime() - startTime.getTime();
    this.log('Пошаговый алгоритм отработал за ' + elapsedTime + ' ms');
    return points;
  }

  drawBresenhamLine(x1: number, y1: number, x2: number, y2: number) {
    const startTime = new Date();
    const points = [];
    const dx = Math.abs(x2 - x1);
    const dy = -Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let error = dx + dy;
    let iter = 1;
    while (true) {
      this.log(iter + '. Рисуем точку (' + x1 + ', ' + y1 + '), error = ' + error);
      iter++;
      points.push([x1, y1]);
      if (x1 === x2 && y1 === y2) {
        this.log('(' + x2 + ', ' + y2 + '), выход из цикла');
        break;
      }
      if (2 * error >= dy) {
        if (x1 == x2) {
          this.log('x1');
          break;
        }
        this.log((error - 0.5 * dy) + ' >= 0, сдвигаем x на ' + sx + ', ошибка уменьшается на ' + Math.abs(dy));
        error += dy;
        x1 += sx;
      }
      if (2 * error <= dx) {
        if (y1 == y2) {
          this.log('y1');
          break;
        }
        this.log((error - 0.5 * dx) + ' <= 0, сдвигаем y на ' + sy + ', ошибка увеличивается на ' + dx);
        error += dx;
        y1 += sy;
      }
    }
    const endTime = new Date();
    const elapsedTime = endTime.getTime() - startTime.getTime();
    this.log('Алгоритм Брезенхема отработал за ' + elapsedTime + ' ms');
    return points;
  }
}
