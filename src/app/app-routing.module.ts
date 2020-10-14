import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TitleComponent } from './title/title.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'title', component: TitleComponent },
  { path: 'main', component: MainComponent },
  { path: '**', redirectTo: 'title' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
