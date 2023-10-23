import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ConverterComponent} from "./lab1/converter/converter.component";
import {MenuComponent} from "./menu/menu.component";
import {ImageProcessingComponent} from "./lab2/image-processing/image-processing.component";


const routes: Routes = [
  { path: '', component: MenuComponent},
  { path: 'lab1', component: ConverterComponent},
  { path: 'lab2', component: ImageProcessingComponent},
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], exports: [RouterModule],
})
export class AppRoutingModule {
}
