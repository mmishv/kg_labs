import {
  Component, ElementRef, Input, OnInit, Renderer2
} from '@angular/core';
import {ColorPickerControl} from "@iplab/ngx-color-picker";
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

@Component({
  selector: 'app-converter', templateUrl: './converter.component.html', styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit {
  public colorControl = new ColorPickerControl();
  protected RGB: RGB = {r: 0, g: 0, b: 0};
  protected CMYK: CMYK = {c: 0, m: 0, y: 0, k: 0};
  protected HSV: HSV = {h: 0, s: 0, v: 0};
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
    const hsv = this.colorControl.value.getHsva();
    this.HSV = {h: Math.round(hsv.hue), s: Math.round(hsv.saturation), v: Math.round(hsv.value)};
    const rgba = this.colorControl.value.getRgba();
    this.RGB = {r: Math.round(rgba.red), g: Math.round(rgba.green), b: Math.round(rgba.blue)};
    // const cmyk = this.colorControl.value.getCmyk();
    // this.CMYK = {
    //   c: Math.round(cmyk.cyan), m: Math.round(cmyk.magenta), y: Math.round(cmyk.yellow), k: Math.round(cmyk.black)
    // };
    this.rgbToCmyk();
  }

  @Input()
  public set color(color: string) {
    this.colorControl.setValueFrom(color);
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
    this.cmykToRgb();
    this.color = `rgb(${this.RGB.r}, ${this.RGB.g}, ${this.RGB.b})`;
    // this.color = `cmyk(${this.CMYK.c}, ${this.CMYK.m}, ${this.CMYK.y}, ${this.CMYK.k})`;
  }

  onHSVChange() {
    const knownProperties: Array<keyof HSV> = ['s', 'v'];
    for (const prop of knownProperties) {
      this.HSV[prop] = this.sanitizeValue(this.HSV[prop], 100);
    }
    this.HSV.h = this.sanitizeValue(this.HSV.h, 360);
    this.hsvToRgb()
    this.color = `rgb(${this.RGB.r}, ${this.RGB.g}, ${this.RGB.b})`;
  }

  RGBChange(prop: keyof RGB) {
    this.RGB[prop] = this.sanitizeValue(this.RGB[prop], 255);
    this.onRGBChange()
  }

  CMYKChange(prop: keyof CMYK) {
    this.CMYK[prop] = this.sanitizeValue(this.CMYK[prop], 100);
    this.onCMYKChange()
  }

  HSVChange(prop: keyof HSV) {
    if (prop == 'h') this.HSV[prop] = this.sanitizeValue(this.HSV[prop], 360); else this.HSV[prop] = this.sanitizeValue(this.HSV[prop], 100);
    this.onHSVChange();
  }

  sanitizeValue(value: number, maxValue: number): number {
    if (value < 0) return 0;
    if (value > maxValue) return maxValue;
    return value;
  }

  private hsvToRgb() {
    let red = 1;
    let green = 0;
    let blue = 0;
    const saturation = this.HSV.s / 100;
    const brightness = this.HSV.v / 100;
    const hex = this.HSV.h / 60;

    const primary = Math.floor(hex);
    const secondary = hex - primary;
    const a = (1 - saturation) * brightness;
    const b = (1 - (saturation * secondary)) * brightness;
    const c = (1 - (saturation * (1 - secondary))) * brightness;

    switch (primary) {
      case 6:
      case 0:
        red = brightness;
        green = c;
        blue = a;
        break;
      case 1:
        red = b;
        green = brightness;
        blue = a;
        break;
      case 2:
        red = a;
        green = brightness;
        blue = c;
        break;
      case 3:
        red = a;
        green = b;
        blue = brightness;
        break;
      case 4:
        red = c;
        green = a;
        blue = brightness;
        break;
      case 5:
        red = brightness;
        green = a;
        blue = b;
        break;
    }
    this.RGB.r = red * 255;
    this.RGB.g = green * 255;
    this.RGB.b = blue * 255;
  }

  private cmykToRgb() {
    const black = this.CMYK.k / 100;
    const cyan = this.CMYK.c / 100;
    const magenta = this.CMYK.m / 100;
    const yellow = this.CMYK.y / 100;
    let red = (1 - cyan) * (1 - black);
    let green = (1 - magenta) * (1 - black);
    let blue = (1 - yellow) * (1 - black);
    this.RGB.r = Math.round(red * 255);
    this.RGB.g = Math.round(green * 255);
    this.RGB.b = Math.round(blue * 255);
  }

  private rgbToCmyk() {
    const red = this.RGB.r / 255;
    const green = this.RGB.g / 255;
    const blue = this.RGB.b / 255;
    let black = 1 - Math.max(red, green, blue);
    if (black === 1) {
      this.CMYK.k = 0;
      this.CMYK.m = 0;
      this.CMYK.y = 0;
      this.CMYK.k = 100;
      return;
    }
    this.CMYK.c = Math.round((1 - red - black)/(1-black) * 100);
    this.CMYK.m = Math.round((1 - green - black)/(1-black) * 100);
    this.CMYK.y = Math.round((1 - blue - black)/(1-black) * 100);
    this.CMYK.k = Math.round(black * 100);
  }
}
