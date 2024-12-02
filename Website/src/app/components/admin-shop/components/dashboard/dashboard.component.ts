import { Component } from '@angular/core';

// chart
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  // Chart
  public configMonthlySalesChart: any = {
    type: 'bar',
    data: {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ],
      datasets: [
        {
          label: 'Sales',
          data: ['4','5','6','7.6','8.2','9.5','4.9','2.8','5.7','7.1','10','9'],
          backgroundColor: '#43a047',
        },
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
  monthlySalesChart: any;
  ngOnInit(): void {
    this.monthlySalesChart = new Chart("monthlySalesChartID", this.configMonthlySalesChart);
  }

}
