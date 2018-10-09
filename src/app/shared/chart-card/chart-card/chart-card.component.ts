import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aka-chart-card',
  templateUrl: './chart-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartCardComponent implements OnInit {

  @Input() title: string;

  @Input() subtitle: string;

  @Input() chartType: 'pie' | 'doughnut' | 'line' | 'bar';

  @Input() chartData: any;

  constructor() {
  }

  ngOnInit() {
  }
}
