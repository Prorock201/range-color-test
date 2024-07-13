import { Component } from '@angular/core';
import { RangeColorService } from '../../services/range-color.service';
import { Observable } from 'rxjs';
import { RangeColor } from '../../models/range-color.model';

@Component({
  selector: 'app-range-color-container',
  templateUrl: './range-color-container.component.html',
  styleUrl: './range-color-container.component.scss'
})
export class RangeColorContainerComponent {
  public displayedColumns: string[] = ['fromSeconds', 'toSeconds', 'color', 'actions'];
  public currentTimer$: Observable<number>;
  public rangeColor$: Observable<RangeColor[]>;
  public currentColor$: Observable<string>;

  constructor(
    public rangeColorService: RangeColorService
  ) {
    this.currentTimer$ = this.rangeColorService.currentTimer$;
    this.rangeColor$ = this.rangeColorService.rangeColor$;
    this.currentColor$ = this.rangeColorService.currentColor$;
  }

  addCreateForm() {
    this.rangeColorService.hasCreateRow  = true;
  }

  removeRangeColorItem(color: string) {
    this.rangeColorService.removeRangeColorItem(color);
  }
}
