import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeColorContainerComponent } from './range-color-container.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreatingRowComponent } from '../creating-row/creating-row.component';
import { CommonModule } from '@angular/common';
import { RangeColorRoutingModule } from '../../range-color-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

describe('RangeColorContainerComponent', () => {
  let component: RangeColorContainerComponent;
  let fixture: ComponentFixture<RangeColorContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
    .compileComponents();

    fixture = TestBed.createComponent(RangeColorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
