import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingRowComponent } from './creating-row.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RangeColorContainerComponent } from '../range-color-container/range-color-container.component';
import { CommonModule } from '@angular/common';
import { RangeColorRoutingModule } from '../../range-color-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

describe('CreatingRowComponent', () => {
  let component: CreatingRowComponent;
  let fixture: ComponentFixture<CreatingRowComponent>;

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

    fixture = TestBed.createComponent(CreatingRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
