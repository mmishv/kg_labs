import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RouterOutlet} from "@angular/router";
import { ConverterComponent } from './lab1/converter/converter.component';
import {AppRoutingModule} from "./app-routing.module";
import { MenuComponent } from './menu/menu.component';
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ColorPickerModule} from "@iplab/ngx-color-picker";

@NgModule({
  declarations: [
    AppComponent,
    ConverterComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
