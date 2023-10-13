import {
  Component, ElementRef, Input, OnInit, Renderer2
} from '@angular/core';
import {Color, ColorPickerControl} from "@iplab/ngx-color-picker";
import {distinctUntilChanged, Subscription} from "rxjs";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

@Component({
  selector: 'app-converter', templateUrl: './converter.component.html', styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit {
  public colorControl = new ColorPickerControl();
  private _color: Color = Color.from(`#FFFFFF`);
  protected RGB: RGB = {r: 0, g: 0, b: 0};
  protected CMYK: CMYK = {c: 0, m: 0, y: 0, k: 0};
  protected HSV: HSV = {h: 0, s: 0, v: 0};
  protected HSL: HSL = {h: 0, s: 0, l: 0};
  private colorControlSubscription: Subscription | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    this.colorControlSubscription = this.colorControl.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      this.onColorControlValueChange();
    });
  }

  ngOnDestroy() {
    if (this.colorControlSubscription) this.colorControlSubscription.unsubscribe();
  }

  onColorControlValueChange() {
    const hsla = this.colorControl.value.getHsla();
    this.HSL = {h: hsla.hue, s: hsla.saturation, l: hsla.lightness};
    this.convertHSLtoHSV();
    const rgba = this.colorControl.value.getRgba();
    this.RGB = {r: Math.round(rgba.red), g: Math.round(rgba.green), b: Math.round(rgba.blue)};
    const cmyk = this.colorControl.value.getCmyk();
    this.CMYK = {
      c: Math.round(cmyk.cyan), m: Math.round(cmyk.magenta), y: Math.round(cmyk.yellow), k: Math.round(cmyk.black)
    };
  }

  @Input()
  public set color(color: string) {
    this.colorControl.setValueFrom(color);
    this._color = this.colorControl.value;
  }

  onRGBChange() {
    const knownProperties: Array<keyof RGB> = ['r', 'g', 'b'];
    for (const prop of knownProperties) {
      this.RGB[prop] = this.sanitizeValue(this.RGB[prop], 255);
    }
    this.color = `rgb(${this.RGB.r}, ${this.RGB.g}, ${this.RGB.b})`;
  }

  onCMYKChange() {
    const knownProperties: Array<keyof CMYK> = ['c', 'm', 'y', 'k'];
    for (const prop of knownProperties) {
      this.CMYK[prop] = this.sanitizeValue(this.CMYK[prop], 100);
    }
    this.color = `cmyk(${this.CMYK.c}, ${this.CMYK.m}, ${this.CMYK.y}, ${this.CMYK.k})`;
  }

  onHSVChange() {
    const knownProperties: Array<keyof HSV> = ['s', 'v'];
    for (const prop of knownProperties) {
      this.HSV[prop] = this.sanitizeValue(this.HSV[prop], 100);
    }
    this.HSV.h = this.sanitizeValue(this.HSV.h, 360);
    this.convertHSVtoHSL()
    this.color = `hsl(${this.HSL.h}, ${this.HSL.s}, ${this.HSL.l})`;
  }

  sanitizeValue(value: number, maxValue: number): number {
    if (value < 0) return 0;
    if (value > maxValue) return maxValue;
    return value;
  }

  convertHSVtoHSL() {
    const hsvToHsl = (h: number, s: number, v: number, l: number = v * (1 - (s / 2))) => [h, l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l), l];
    let hsl = hsvToHsl(this.HSV.h, this.HSV.s / 100, this.HSV.v / 100);
    this.HSL.h = hsl[0];
    this.HSL.s = hsl[1] * 100;
    this.HSL.l = hsl[2] * 100;
  }

  convertHSLtoHSV() {
    const hslToHsv = (h: number, s: number, l: number, v: number = l + s * Math.min(l, 1 - l)) => [h, v === 0 ? 0 : 2 * (1 - (l / v)), v];
    let hsv = hslToHsv(this.HSL.h, this.HSL.s / 100, this.HSL.l / 100);
    this.HSV.h = hsv[0];
    this.HSV.s = hsv[1] * 100;
    this.HSV.v = hsv[2] * 100;
  }
}
