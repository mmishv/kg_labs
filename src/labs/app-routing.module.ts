import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ConverterComponent} from "./lab1/converter/converter.component";
import {MenuComponent} from "./menu/menu.component";


const routes: Routes = [
  { path: '', component: MenuComponent},
  { path: 'lab1', component: ConverterComponent},
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], exports: [RouterModule],
})
export class AppRoutingModule {
}
