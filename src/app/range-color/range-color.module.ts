import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeColorContainerComponent } from './components/range-color-container/range-color-container.component';
import { CreatingRowComponent } from './components/creating-row/creating-row.component';
import { RangeColorRoutingModule } from './range-color-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule}  from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RangeColorContainerComponent,
    CreatingRowComponent
  ],
  imports: [
    CommonModule,
    RangeColorRoutingModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ]
})
export class RangeColorModule { }
