import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { ChartType } from 'app/shared/chart-card/chart-card/chart-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  private lastSemester = [];
  public emailChartType: ChartType;
  public emailChartData: any;
  public emailChartOptions: any;

  public hoursChartType: ChartType;
  public hoursChartData: any;

  public activityChartType: ChartType;
  public activityChartData: any;
  public activityChartOptions: any;

  constructor() { }

  ngOnInit() {
    // calc of the last 6 months
    for (let i = 6; i > 0; i -= 1) {
      const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      this.lastSemester.push(this.monthNames[d.getMonth()]);
    }

    this.emailChartType = ChartType.Pie;
    this.emailChartData = {
      labels: ['Pesquisa', 'Cultura', 'Extracurriculares'],
      datasets: [
        {
          data: [32, 6, 62],
          backgroundColor: [
            'rgba(255,99,132, 0.4)',
            'rgba(54, 162, 235, 0.4)',
            'rgba(255, 206, 86, 0.4)'
          ],
          borderColor: [
            'rgba(255,99,132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1,
          hoverBorderWidth: 2
        }
      ]
    };
    this.emailChartOptions = {
      maintainAspectRatio: false
    }

    this.hoursChartType = ChartType.Line;
    this.hoursChartData = {
      labels: this.lastSemester,
      datasets: [{
        label: 'Último semestre',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        data: [0, 10, 5, 2, 20, 30, 45],
      }]
    };

    this.activityChartType = ChartType.Bar;
    this.activityChartData = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.4)',
          'rgba(54, 162, 235, 0.4)',
          'rgba(255, 206, 86, 0.4)',
          'rgba(75, 192, 192, 0.4)',
          'rgba(153, 102, 255, 0.4)',
          'rgba(255, 159, 64, 0.4)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };
    this.activityChartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
  }
}
