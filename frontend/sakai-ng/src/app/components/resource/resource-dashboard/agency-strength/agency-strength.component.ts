import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agency-strength',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, ButtonModule, CarouselModule],
  templateUrl: './agency-strength.component.html',
  styleUrl: './agency-strength.component.scss'
})
export class AgencyStrengthComponent implements OnInit, OnDestroy {

  @ViewChild('carouselContainer', { static: true }) carouselContainer!: ElementRef;
  
  sections: any[] = [];
  paginatedSections: any[] = []; // Array of pages (each containing up to 10 sections)
  numVisibleItems: number = 18;
  responsiveOptions: any[] = [];
  chartOptions: any;
  pieChartOptions: any;
  plugins = [ChartDataLabels];
  currentDate: string = '';
  currentTime: string = '';
  timeInterval: any;

  screenWidth: number;
  resizeObserver!: ResizeObserver;
  timeSubscription: Subscription;

  initializeSections() {
    this.sections = [
  { name: 'Agency 1', pieData: [50, 30, 20], barDataIn: [80, 60, 40], barDataOut: [60, 40, 20] },
  { name: 'Agency 2', pieData: [40, 35, 25], barDataIn: [70, 55, 45], barDataOut: [25, 15, 20] },
  { name: 'Agency 3', pieData: [45, 30, 25], barDataIn: [65, 50, 40], barDataOut: [55, 45, 50] },
  { name: 'Agency 4', pieData: [30, 50, 20], barDataIn: [75, 60, 50], barDataOut: [45, 50, 45] },
  { name: 'Agency 5', pieData: [55, 25, 20], barDataIn: [85, 70, 60], barDataOut: [80, 55, 65] },
  { name: 'Agency 6', pieData: [60, 20, 20], barDataIn: [90, 75, 65], barDataOut: [50, 65, 30] },
  { name: 'Agency 7', pieData: [35, 40, 25], barDataIn: [80, 65, 55], barDataOut: [80, 55, 65] },
  { name: 'Agency 9', pieData: [30, 45, 25], barDataIn: [85, 70, 60], barDataOut: [70, 85, 60] },
  { name: 'Agency 8', pieData: [25, 50, 25], barDataIn: [70, 55, 45], barDataOut: [70, 45, 55] },
  { name: 'Agency 10', pieData: [40, 35, 25], barDataIn: [75, 60, 50], barDataOut: [60, 75, 50] },
  { name: 'Agency 11', pieData: [50, 30, 20], barDataIn: [80, 65, 55], barDataOut: [65, 55, 30] },
  { name: 'Agency 12', pieData: [45, 35, 20], barDataIn: [85, 70, 60], barDataOut: [75, 50, 55] },
  { name: 'Agency 13', pieData: [30, 50, 20], barDataIn: [80, 65, 55], barDataOut: [60, 45, 40] },
  { name: 'Agency 14', pieData: [55, 30, 15], barDataIn: [90, 75, 65], barDataOut: [85, 70, 60] },
  { name: 'Agency 15', pieData: [35, 40, 25], barDataIn: [70, 55, 45], barDataOut: [55, 40, 35] },
  { name: 'Agency 16', pieData: [25, 50, 25], barDataIn: [65, 50, 40], barDataOut: [45, 35, 30] },
  { name: 'Agency 17', pieData: [50, 25, 25], barDataIn: [95, 80, 70], barDataOut: [85, 75, 65] },
  { name: 'Agency 18', pieData: [40, 35, 25], barDataIn: [75, 60, 50], barDataOut: [55, 45, 40] },
  { name: 'Agency 19', pieData: [30, 45, 25], barDataIn: [85, 70, 55], barDataOut: [75, 60, 50] },
  { name: 'Agency 20', pieData: [45, 30, 25], barDataIn: [80, 65, 55], barDataOut: [70, 50, 45] },
  { name: 'Agency 21', pieData: [50, 25, 25], barDataIn: [90, 75, 60], barDataOut: [65, 55, 45] },
  { name: 'Agency 22', pieData: [55, 30, 15], barDataIn: [85, 70, 60], barDataOut: [75, 65, 55] },
  { name: 'Agency 23', pieData: [40, 35, 25], barDataIn: [75, 60, 50], barDataOut: [55, 40, 35] },
  { name: 'Agency 24', pieData: [35, 45, 20], barDataIn: [70, 55, 45], barDataOut: [60, 50, 40] },
  { name: 'Agency 25', pieData: [45, 35, 20], barDataIn: [85, 70, 60], barDataOut: [75, 55, 50] }
];
  }

  initializeCarouselSettings() {
    this.responsiveOptions = [
      { breakpoint: '1600px', numVisible: 1, numScroll: 1 },
      { breakpoint: '1200px', numVisible: 1, numScroll: 1 },
      { breakpoint: '768px', numVisible: 1, numScroll: 1 },
      { breakpoint: '480px', numVisible: 1, numScroll: 1 }
    ];
  }
  
  constructor(private cdr: ChangeDetectorRef) {
    this.initializeSections();
    this.paginateSections(); 
    this.initializeCarouselSettings();
    this.initializeChartOptions();
    this.updateTime();
  }

  ngAfterViewInit() {
    this.updateVisibleItems();  

    this.resizeObserver = new ResizeObserver(() => {
      this.updateVisibleItems();
    });

    if (this.carouselContainer) {
      this.resizeObserver.observe(this.carouselContainer.nativeElement);
    }
  }

  updateVisibleItems() {
    if (!this.carouselContainer) return;

    const width = this.carouselContainer.nativeElement.offsetWidth;
    const height = this.carouselContainer.nativeElement.offsetHeight;
    this.screenWidth = window.innerWidth;

    if (this.screenWidth >= 1600 ) {
      if(width >= 1000){
        this.numVisibleItems = 24 ;
      }else{
        this.numVisibleItems = height >= 900 ? 18 : 12;
      }
    
    }else if (this.screenWidth >= 1401 ) {
      if(width >= 1000){
        this.numVisibleItems = 16 ;
      }else{
        this.numVisibleItems = height >= 900 ? 18 : 12;
      }
    }  else if (this.screenWidth >= 1025) {
      if(width >= 1000){
        this.numVisibleItems = height >= 700 ? 24 : 15;
      }else{
        this.numVisibleItems = height >= 700 ? 15 : 9;
      }
    } else if (this.screenWidth >= 769) {
      if(width >= 650){
        this.numVisibleItems = height >= 400 ? 10 : 5;  
      }else{
        this.numVisibleItems = height >= 400 ? 6 : 3;  
      }
    } else if (this.screenWidth >= 425) {
      this.numVisibleItems = height >= 350 ? 8 : 4;
    } else if (this.screenWidth >= 300) {
      this.numVisibleItems = height >= 300 ? 2 : 1;
    } else {
      this.numVisibleItems = 1;
    }

    this.paginateSections();
  }

  ngOnInit(): void {

    this.updateVisibleItems()

    window.addEventListener('resize', () => {
      this.initializeCarouselSettings();
      this.paginateSections();
    });

  }

  updateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-GB').split('/').join('-'); 
    this.currentTime = now.toLocaleTimeString('en-GB', { hour12: false });   

    setTimeout(() => {
      this.updateTime();
    }, 1000);
  }  

  paginateSections() {

    this.paginatedSections = [];
    for (let i = 0; i < this.sections.length; i += this.numVisibleItems) {
      this.paginatedSections.push({ sections: this.sections.slice(i, i + this.numVisibleItems) });
    }
  }

  

  initializeChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2.5,
      scales: {
        x: {
          ticks: {
            font: {
              size: 8 
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: 10 
            }
          }
        }
      },
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'top', 
          align: 'top', 
          font: { weight: 'bold', size: 8 },
          color: '#333',
          formatter: (value: number) => value 
        }
      },
      
    };

    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        datalabels: {
          color: '#fff',
          font: { weight: 'bold', size: 12 },
          formatter: (value: number) => value
        }
      }
    };
  }

  getPieChartData(pieData: number[]) {
    return {
      datasets: [
        {
          data: pieData,
          backgroundColor: ['#FFD54F', '#FF7043', '#26A69A']
        }
      ]
    };
  }

  getBarChartData(barDataIn: number[], barDataOut: number[]) {
    return {
      labels: ['Shift A', 'Shift B', 'Shift C'],
      datasets: [
        { backgroundColor: '#FF7043', data: barDataIn },
        { backgroundColor: '#26A69A', data: barDataOut }
      ]
    };
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

  }

}


