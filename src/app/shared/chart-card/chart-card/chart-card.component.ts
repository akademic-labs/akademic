import { Component, Input, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';

import { Chart } from 'chart.js';

export enum ChartType {
  Pie,
  Line,
  Bar,
  Doughnut
}

@Component({
  selector: 'aka-chart-card',
  templateUrl: './chart-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartCardComponent implements OnInit, AfterViewInit {
  static currentId = 1;

  @Input()
  public title: string;

  @Input()
  public subtitle: string;

  @Input()
  public canvasClass: string;

  @Input()
  public chartType: ChartType;

  @Input()
  public chartData: any;

  @Input()
  public chartOptions: any;

  @Input()
  public footerIconClass: string;

  @Input()
  public footerText: string;

  @Input()
  public withHr: boolean;

  public chartId: string;

  public chart: Chart;

  private type: string;

  constructor() {
  }

  ngOnInit() {
    this.chartId = `canvas-${ChartCardComponent.currentId++}`;
  }

  ngAfterViewInit() {

    switch (this.chartType) {

      case ChartType.Pie: this.type = 'pie'; break
      case ChartType.Doughnut: this.type = 'doughnut'; break
      case ChartType.Line: this.type = 'line'; break
      case ChartType.Bar: this.type = 'bar'; break

    }

    this.chart = new Chart(this.chartId, {
      type: this.type,
      data: this.chartData,
      options: this.chartOptions
    });

  }
}
