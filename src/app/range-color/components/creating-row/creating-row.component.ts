import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, catchError, map, of, take } from 'rxjs';
import { RangeColorService } from '../../services/range-color.service';
import { UtilityService } from '../../services/utility.service';

interface FormControlErrorMapper {
  [key: string]: ErrorMessageMapper;
};

interface ErrorMessageMapper {
  required: string;
  min: string;
  max: string;
  timeRangeConflict: string;
  fromGreaterThanTo: string;
};

@Component({
  selector: 'app-creating-row',
  templateUrl: './creating-row.component.html',
  styleUrl: './creating-row.component.scss'
})
export class CreatingRowComponent {
  addRangeColorItemForm: FormGroup;

  @Output() rangeColorItemAdded = new EventEmitter<void>();

  constructor(
    private rangeColorService: RangeColorService,
    private utilityServices: UtilityService
  ) {
    this.addRangeColorItemForm = new FormGroup({
      fromSecond: new FormControl(
        '',
        [Validators.required, Validators.min(0), Validators.max(58)]
      ),
      toSecond: new FormControl(
        '',
        [Validators.required, Validators.min(1), Validators.max(59)]
      ),
      color: new FormControl(
        '#000000',
        [Validators.required]
      )
    }, {
      validators: this.fromLessThanToValidator(),
      asyncValidators: [
        this.timeRangeConflictValidator(),
        this.uniqueColorValidator()
      ],
    });
  }

  get fromSecond(): FormControl { 
    return this.addRangeColorItemForm.get('fromSecond') as FormControl; 
  }

  get toSecond(): FormControl { 
    return this.addRangeColorItemForm.get('toSecond') as FormControl; 
  }

  get color(): FormControl { 
    return this.addRangeColorItemForm.get('color') as FormControl; 
  }

  checkForErrorsInRange(formControl: AbstractControl, formControlName: string): string {
    const errorMapper: FormControlErrorMapper = {
      fromSecond: {
        required: '"From" value is required',
        min: 'Value must be more than 0',
        max: 'Value must be less than 58',
        timeRangeConflict: 'Selected time range overlaps with an existing configuration.',
        fromGreaterThanTo: '"From" value must be less than "To" value.'
      },
      toSecond: {
        required: '"To" value is required',
        min: 'Value must be more than 1',
        max: 'Value must be less than 59',
        timeRangeConflict: 'Selected time range overlaps with an existing configuration.',
        fromGreaterThanTo: '"From" value must be less than "To" value.'
      }
    }
    if (formControl.hasError('required')) {
      return errorMapper[formControlName].required;
    }
    if (formControl.hasError('min')) {
      return errorMapper[formControlName].min;
    }
    if (formControl.hasError('max')) {
      return errorMapper[formControlName].max;
    }
    if (formControl.hasError('timeRangeConflict')) {
      return errorMapper[formControlName].timeRangeConflict;
    }
    if (formControl.hasError('fromGreaterThanTo')) {
      return errorMapper[formControlName].fromGreaterThanTo;
    }
    return ''
  }

  checkForErrorsInColor(formControl: AbstractControl): string {
    if (formControl.hasError('required')) {
      return 'Value is required';
    }
    if (formControl.hasError('colorConflict')) {
      return 'Selected color already exists.'
    }
    return ''
  }

  hasFormError(error: string): boolean {
    return this.addRangeColorItemForm.hasError(error);
  }

  uniqueColorValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const color = control.value.color;

      if (color === null) {
        return of(null);
      }

      return this.rangeColorService.rangeColor$.pipe(
        take(1),
        map(rangeColor => {
          const rangeColorSortedByColor = [...rangeColor].sort((a,b) => (a.color > b.color) ? 1 : ((b.color > a.color) ? -1 : 0));
          const colorConflictIndex = this.utilityServices.binaryColorSearch(rangeColorSortedByColor, color);
          return colorConflictIndex >= 0 ? { 'colorConflict': true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  timeRangeConflictValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const fromSecond = control.value.fromSecond;
      const toSecond = control.value.toSecond;

      if (fromSecond === null || toSecond === null) {
        return of(null);
      }

      return this.rangeColorService.rangeColor$.pipe(
        take(1),
        map(rangeColor => {
          const timeRangeConflictIndex = this.utilityServices.binaryTimeRangeSearch(rangeColor, fromSecond, toSecond);
          return timeRangeConflictIndex >= 0 ? { 'timeRangeConflict': true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  fromLessThanToValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fromSecond = control.get('fromSecond')?.value;
      const toSecond = control.get('toSecond')?.value;

      if (fromSecond !== null && toSecond !== null && fromSecond >= toSecond) {
        return { 'fromGreaterThanTo': true };
      }

      return null;
    };
  }

  addRangeColorItem() {
    if (this.addRangeColorItemForm.valid) {
      this.rangeColorService.addRangeColorItem(this.addRangeColorItemForm.value);
      this.addRangeColorItemForm.reset();
    }
  }
}
