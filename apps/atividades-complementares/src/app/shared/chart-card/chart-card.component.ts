import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'aka-chart-card',
  templateUrl: './chart-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartCardComponent {
  @Input() title: string;

  @Input() subtitle: string;

  @Input() chartType: 'pie' | 'doughnut' | 'line' | 'bar';

  @Input() chartData: any;
}
