import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RangeColorContainerComponent } from './components/range-color-container/range-color-container.component';

const routes: Routes = [
  {
    path: '',
    component: RangeColorContainerComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RangeColorRoutingModule { }