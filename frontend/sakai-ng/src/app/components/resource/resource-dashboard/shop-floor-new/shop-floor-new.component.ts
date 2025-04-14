import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-shop-floor-new',
  standalone: true,
  imports: [CommonModule, ChartModule, CarouselModule,],
  templateUrl: './shop-floor-new.component.html',
  styleUrl: './shop-floor-new.component.scss'
})
export class ShopFloorNewComponent implements AfterViewInit{

  @ViewChild('carouselContainer', { static: true }) carouselContainer!: ElementRef;

  currentDate: string = '';
  currentTime: string = '';
  timeInterval: any;

  sections: any[] = [];
  paginatedSections: any[] = []; 
  numVisibleItems: number ;
  responsiveOptions: any[] = [];
  screenWidth: number;
  chartOptions: any;
  pieChartOptions: any;
  plugins = [ChartDataLabels];
  bargraphCategory = ['Production Performance  - Sub assembly','Sales Trade Analysis','Production performance OTD','Customers Complaints as per MIS']

  private resizeObserver!: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef) {}
  
  
  initializeSections() {
    this.sections = [
      
      { category: 'Material Transactions', departmentName: 'GRN', pendingStatusText: 'Lots Completed / No. of Lots pending in Grn for more then 48 Hrs ', type: 'box', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Material Transactions', departmentName: 'Inward', pendingStatusText: 'Lots Completed / No. of Lots pending in inward  for more then 48 Hrs ',type: 'box', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Material Transactions', departmentName: 'Inventory 1', pendingStatusText: 'Lots Pending / No. of Lots pending for issue in report for more then 48 hrs ',type: 'box', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Material Transactions', departmentName: 'Inventory 2', pendingStatusText: 'Lots issued / No. of Lots pending for issue in report for more then 48 hrs ', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Material Transactions', departmentName: 'FG Store', pendingStatusText: 'Qty Completed / No. of Lots pending in Final  for more then 72 Hrs ', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Material Transactions', departmentName: 'Final', pendingStatusText: 'lots Completed/No. of dispatches pending to be completed with FG stock report for more then 72 Hrs', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Material Transactions', departmentName: 'Dispatch', pendingStatusText: 'Lots  Completed / No. of items  pending for invocing for more then 72 Hrs ', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Material Transactions', departmentName: 'NC Inward', pendingStatusText: 'Lots completed / No of lots pending in NC for more then 96 Hrs ', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Material Transactions', departmentName: 'NC Final', pendingStatusText: 'Lots completed / No of lots pending in NC for more then 96 Hrs ', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      
      { category: 'Production Performance', departmentName: 'Purchase', pendingStatusText: 'Lots in during the month / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'Sub contract - others', pendingStatusText: 'Lots in During the month / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'Diecating', pendingStatusText: 'Qty produced during the month  / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'Rubber molding', pendingStatusText: 'Qty produced during the month  / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'CNC - Inhouse', pendingStatusText: 'Qty produced during the month  / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'CNC - Sub contract', pendingStatusText: 'Qty in during the month / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'Shell -Plating', pendingStatusText: 'Qty plated during the month / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'Contact - plating', pendingStatusText: 'Qty plated during the month / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'Assembly - 1', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'Assembly - 2', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'Back shell Assemly', pendingStatusText: 'Qty produced during the month No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Production Performance', departmentName: 'Small Qty Assembly', pendingStatusText: 'Qty produced during the month No. of red lines in MRP report', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Purchase', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Sub contract - others', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Diecating ', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Rubber molding', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'CNC - Inhouse', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'CNC - Sub contract', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Shell -Plating', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Contact - plating', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Assembly - 1', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Assembly - 2', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Back shell Assemly', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inward or Final Quality', departmentName: 'Small Qty Assembly', pendingStatusText: 'No. of lots under NC, Rework, Reject during the month  / Quality rating (Lot consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      
      // { category: 'Sales Trade Analysis', departmentName: 'Sale order release ', pendingStatusText: 'Qty of Orders released during the last 6 Months', ordersRecieved: [104, 110, 108, 114, 115, 110]},
      // { category: 'Sales Trade Analysis', departmentName: 'order executed', pendingStatusText: 'Qty of dispatchs during the last 6 months', ordersExecuted: [102, 104, 106, 108, 110, 108] },
      
      { category: 'Quality Performance - Inprocesses or Line Quality', departmentName: 'Diecating', pendingStatusText: 'No. of components under NC, Rework, Reject during the month  / Quality rating (Rej Qty consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inprocesses or Line Quality', departmentName: 'Rubber molding', pendingStatusText: 'No. of components under NC, Rework, Reject during the month  / Quality rating (Rej Qty consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inprocesses or Line Quality', departmentName: 'CNC - Inhouse', pendingStatusText: 'No. of components under NC, Rework, Reject during the month  / Quality rating (Rej Qty consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inprocesses or Line Quality', departmentName: 'Shell -Plating', pendingStatusText: 'No. of components under NC, Rework, Reject during the month  / Quality rating (Rej Qty consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inprocesses or Line Quality', departmentName: 'Contact - plating', pendingStatusText: 'No. of components under NC, Rework, Reject during the month  / Quality rating (Rej Qty consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inprocesses or Line Quality', departmentName: 'Assembly - 1', pendingStatusText: 'No. of components under NC, Rework, Reject during the month  / Quality rating (Rej Qty consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inprocesses or Line Quality', departmentName: 'Assembly - 2', pendingStatusText: 'No. of components under NC, Rework, Reject during the month  / Quality rating (Rej Qty consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inprocesses or Line Quality', departmentName: 'Back shell Assemly', pendingStatusText: 'No. of components under NC, Rework, Reject during the month  / Quality rating (Rej Qty consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Quality Performance - Inprocesses or Line Quality', departmentName: 'Small Qty Assembly', pendingStatusText: 'No. of components under NC, Rework, Reject during the month  / Quality rating (Rej Qty consideration)', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S1 - Riveting', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [100, 120, 110, 130, 140, 150, 160], achieved: [90, 125, 105, 135, 130, 145, 155]},
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S1 - Pad printing', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [200, 180, 190, 210, 220, 230, 240], achieved: [190, 175, 185, 205, 215, 225, 235]},
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S1 - Contact prepration', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [150, 160, 170, 180, 190, 200, 210], achieved: [140, 155, 165, 175, 185, 195, 205]},
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S1 - Insert & contact assembly', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [300, 320, 310, 330, 340, 350, 360], achieved: [290, 315, 305, 335, 330, 345, 355]},
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S1 - Back shell assembly', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [400, 420, 430, 440, 450, 460, 470], achieved: [390, 415, 425, 435, 445, 455, 465]},
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S3 - Riveting', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [50, 60, 70, 80, 90, 100, 110], achieved: [45, 55, 65, 75, 85, 95, 105]},
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S3 - Pad printing', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [30, 40, 50, 60, 70, 80, 90], achieved: [28, 38, 48, 58, 68, 78, 88]},
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S3 - Contact prepration', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [22, 32, 42, 52, 62, 72, 82], achieved: [21, 31, 41, 51, 61, 71, 81]},
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S3 - Insert Prepration', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [50, 60, 70, 80, 90, 100, 110], achieved: [45, 55, 65, 75, 85, 95, 105]},
      { category: 'Production Performance  - Sub assembly', departmentName: 'Sub assembly S3 - Shell painting', pendingStatusText: 'Qty produced during the month / No. of red lines in MRP report', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [250, 270, 290, 310, 330, 350, 370], achieved: [245, 265, 285, 305, 325, 345, 365]},
      
      { category: 'Engineering as per MIS', departmentName: 'No CRM For MRP report items', pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Engineering as per MIS', departmentName: 'No Drawing for MRP Report items', pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Engineering as per MIS', departmentName: 'ECN open beyond 7  days', pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Engineering as per MIS', departmentName: 'SAP change req open beyond 2 days(CP/QP/SRM/BOM)', pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Engineering as per MIS', departmentName: 'Minor development pending beyond 7 days', pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Engineering as per MIS', departmentName: 'Part number update pending from engg beyond 2 days', pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Engineering as per MIS', departmentName: 'More information  required from sales-above 2 days', pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Engineering as per MIS', departmentName: 'Enquiry Review pending from Engg beyond 2 days', pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Engineering as per MIS', departmentName: "NPD's Pending beyond 30 days", pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Engineering as per MIS', departmentName: 'AUTO WORK ORDER RELEASING ISSUE ITEMCOUNT', pendingStatusText: '', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      
      { category: 'Production performance OTD', departmentName: 'Purchase OTD(Pur+sub contract)', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [100, 120, 110, 130, 140, 150, 160], achieved: [90, 125, 105, 135, 130, 145, 155]},
      { category: 'Production performance OTD', departmentName: 'Diecast OTD', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [200, 180, 190, 210, 220, 230, 240], achieved: [190, 175, 185, 205, 215, 225, 235]},
      { category: 'Production performance OTD', departmentName: 'CNC OTD(InHouse + Sub contract)', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [150, 160, 170, 180, 190, 200, 210], achieved: [140, 155, 165, 175, 185, 195, 205]},
      { category: 'Production performance OTD', departmentName: 'Plating-shellPlating OTD', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [90, 100, 110, 120, 130, 140, 150], achieved: [85, 95, 105, 115, 125, 135, 145]},
      { category: 'Production performance OTD', departmentName: 'Plating-Goldplating OTD', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [300, 320, 310, 330, 340, 350, 360], achieved: [290, 315, 305, 335, 330, 345, 355]},
      { category: 'Production performance OTD', departmentName: 'Rubber moudling OTD', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [400, 420, 430, 440, 450, 460, 470], achieved: [390, 415, 425, 435, 445, 455, 465]},
      { category: 'Production performance OTD', departmentName: 'Brazing', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [50, 60, 70, 80, 90, 100, 110], achieved: [45, 55, 65, 75, 85, 95, 105]},
      { category: 'Production performance OTD', departmentName: 'Assembly s1 OTD', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [500, 520, 530, 540, 550, 560, 570], achieved: [490, 515, 525, 535, 545, 555, 565]},
      { category: 'Production performance OTD', departmentName: 'Assembly S2 OTD', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [120, 140, 160, 180, 200, 220, 240], achieved: [115, 135, 155, 175, 195, 215, 235]},
      { category: 'Production performance OTD', departmentName: 'Backsheel OTD', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [30, 40, 50, 60, 70, 80, 90], achieved: [28, 38, 48, 58, 68, 78, 88]},
      { category: 'Production performance OTD', departmentName: 'QPL Backshell OTD', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [600, 620, 630, 640, 650, 660, 670], achieved: [590, 615, 625, 635, 645, 655, 665]},
      { category: 'Production performance OTD', departmentName: 'SubAssembly OTD', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [250, 270, 290, 310, 330, 350, 370], achieved: [245, 265, 285, 305, 325, 345, 365]},
      { category: 'Production performance OTD', departmentName: 'CNC OEE',dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [30, 40, 50, 60, 70, 80, 90], achieved: [28, 38, 48, 58, 68, 78, 88] },
      
      { category: 'Customers Complaints as per MIS', departmentName: 'Final FG rejection', pendingStatusText: 'Final FG rejection %', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [10, 20, 30, 40, 50, 60, 70], achieved: [9, 18, 28, 38, 48, 58, 68]},
      { category: 'Customers Complaints as per MIS', departmentName: 'Inprocess assembly FG rejection ', pendingStatusText: 'Inprocess assembly FG rejection %', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [15, 25, 35, 45, 55, 65, 75], achieved: [14, 24, 34, 44, 54, 64, 74]},
      { category: 'Customers Complaints as per MIS', departmentName: 'Inhouse Machining rejection ', pendingStatusText: 'Inhouse Machining rejection %', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [12, 22, 32, 42, 52, 62, 72], achieved: [11, 21, 31, 41, 51, 61, 71]},
      { category: 'Customers Complaints as per MIS', departmentName: 'Purchase-regular+sub contract rejection', pendingStatusText: 'Purchase-regular+sub contract rejection', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [18, 28, 38, 48, 58, 68, 78], achieved: [17, 27, 37, 47, 57, 67, 77]},
      { category: 'Customers Complaints as per MIS', departmentName: 'purchase-contract', pendingStatusText: 'purchase-contract', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [22, 32, 42, 52, 62, 72, 82], achieved: [21, 31, 41, 51, 61, 71, 81]},
      { category: 'Customers Complaints as per MIS', departmentName: 'Inhouse Rubeer moulding rejection', pendingStatusText: 'Inhouse Rubeer moulding rejection', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [25, 35, 45, 55, 65, 75, 85], achieved: [24, 34, 44, 54, 64, 74, 84]},
      { category: 'Customers Complaints as per MIS', departmentName: 'inhouse gold pllating rejection', pendingStatusText: 'inhouse gold pllating rejection', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [30, 40, 50, 60, 70, 80, 90], achieved: [29, 39, 49, 59, 69, 79, 89]},
      { category: 'Customers Complaints as per MIS', departmentName: 'inhouse subassembly rejection', pendingStatusText: 'inhouse subassembly rejection %', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [35, 45, 55, 65, 75, 85, 95], achieved: [34, 44, 54, 64, 74, 84, 94]},
      { category: 'Customers Complaints as per MIS', departmentName: 'Final Fg rework', pendingStatusText: 'Final Fg rework %', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [40, 50, 60, 70, 80, 90, 100], achieved: [39, 49, 59, 69, 79, 89, 99]},
      { category: 'Customers Complaints as per MIS', departmentName: 'Inprocess assembly FG rework', pendingStatusText: 'Inprocess assembly FG rework%', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [45, 55, 65, 75, 85, 95, 105], achieved: [44, 54, 64, 74, 84, 94, 104]},
      { category: 'Customers Complaints as per MIS', departmentName: 'Inhouse Machining rework', pendingStatusText: 'Inhouse Machining rework %', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [50, 60, 70, 80, 90, 100, 110], achieved: [49, 59, 69, 79, 89, 99, 109]},
      { category: 'Customers Complaints as per MIS', departmentName: 'Sub contract rework %', pendingStatusText: 'Sub contract rework %', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [50, 60, 70, 80, 90, 100, 110], achieved: [49, 59, 69, 79, 89, 99, 109]},
      { category: 'Customers Complaints as per MIS', departmentName: 'Inhouse plating rework', pendingStatusText: 'Inhouse plating rework %', dailyDetails: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], target: [60, 70, 80, 90, 100, 110, 120], achieved: [59, 69, 79, 89, 99, 109, 119]},
      
      { category: 'Purchase as per MIS', departmentName: 'PO(purchase order)', pendingStatusText: 'Open Indent for PO beyond 2 days', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Purchase as per MIS', departmentName: 'GRN', pendingStatusText: 'GRN pending beyond 2 days', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Purchase as per MIS', departmentName: 'JO(job order)', pendingStatusText: 'Open indent for JO beyond 2 days', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Purchase as per MIS', departmentName: 'DC closer', pendingStatusText: 'DC Closer pending beyond 30 days', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Purchase as per MIS', departmentName: 'JO(job order)  closer', pendingStatusText: 'JO Closer pending beyond 30 days', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
      { category: 'Purchase as per MIS', departmentName: 'po(purchase order) closer', pendingStatusText: 'PO closer pending beyond 30 days', pendingStatusCount: 2, completedStatusText: '', completedStatusCount: 2, issued: 43 },
  

    ];
  }

  paginateSections() {
    this.paginatedSections = [];
    const groupedSections = this.groupSectionsByCategory();
  
    Object.keys(groupedSections).forEach((category) => {
      const categorySections = groupedSections[category];
      const paginatedCategory = [];
  
      for (let i = 0; i < categorySections.length; i += this.numVisibleItems) {
        paginatedCategory.push({ category, sections: categorySections.slice(i, i + this.numVisibleItems) });
      }
  
      this.paginatedSections.push(...paginatedCategory);
    });
  }
  
  groupSectionsByCategory() {
    return this.sections.reduce((acc, section) => {
      (acc[section.category] = acc[section.category] || []).push(section);
      return acc;
    }, {});
  }
  

  initializeCarouselSettings() {
    this.responsiveOptions = [
      { breakpoint: '1600px', numVisible: 1, numScroll: 1 },
      { breakpoint: '1200px', numVisible: 1, numScroll: 1 },
      { breakpoint: '768px', numVisible: 1, numScroll: 1 },
      { breakpoint: '480px', numVisible: 1, numScroll: 1 }
    ];
  }

  ngOnInit(): void {
    this.initializeSections();
    this.paginateSections(); 
    this.initializeCarouselSettings();
    this.updateTime();
    this.initializeChartOptions();
    Chart.register(...registerables, ChartDataLabels);
    
    this.cdr.detectChanges();  
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);

    window.addEventListener('resize', () => {
      this.initializeCarouselSettings();
      this.paginateSections();
    });
  }
  
  ngAfterViewInit() {
    this.initializeChartOptions();

    this.updateVisibleItems();  

    this.resizeObserver = new ResizeObserver(() => {
      this.updateVisibleItems();
    });

    if (this.carouselContainer) {
      this.resizeObserver.observe(this.carouselContainer.nativeElement);
    }

    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.contentRect.width > 768) {
          this.cdr.detectChanges();
        }
      });
    });
    
    this.initializeChartOptions();

    const chartContainer = document.querySelector('.chart-box');
    if (chartContainer) {
      this.resizeObserver.observe(chartContainer);
    }
  }

  updateVisibleItems() {
    if (!this.carouselContainer) return;

    const width = this.carouselContainer.nativeElement.offsetWidth;
    const height = this.carouselContainer.nativeElement.offsetHeight;
    this.screenWidth = window.innerWidth;

    if (this.screenWidth >= 1600 ) {
      if(width >= 1000){
        this.numVisibleItems = 12 ;
      }else{
        this.numVisibleItems = height >= 900 ? 12 : 6;
      }
    
    }else if (this.screenWidth >= 1401 ) {
      if(width >= 1000){
        this.numVisibleItems = 10 ;
      }else{
        this.numVisibleItems = height >= 900 ? 10 : 4;
      }
    }  else if (this.screenWidth >= 1025) {
      if(width >= 1000){
        this.numVisibleItems = height >= 400 ? 4 : 4;
      }else{
        this.numVisibleItems = height >= 700 ? 4 : 4;
      }
    } else if (this.screenWidth >= 769) {
      if(width >= 650){
        this.numVisibleItems = height >= 400 ? 8 : 4;  
      }else{
        this.numVisibleItems = height >= 400 ? 8 : 4;  
      }
    } else if (this.screenWidth >= 425) {
      this.numVisibleItems = height >= 350 ? 2 : 1;
    } else if (this.screenWidth >= 300) {
      this.numVisibleItems = height >= 300 ? 2 : 1;
    } else {
      this.numVisibleItems = 1;
    }

    this.paginateSections();
  }

  getSlideClass(category: string): string {
    switch (category) {
      case 'Material Transactions':
        return 'material-transactions';
      case 'Production Performance':
        return 'production-performance';
      case 'Quality Performance - Inward or Final Quality':
        return 'quality-performance';
      default:
        return 'default-slide'; // Fallback color
    }
  }

  updateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-GB').split('/').join('-'); 
    this.currentTime = now.toLocaleTimeString('en-GB', { hour12: false });   
  }

  isBarChartCategory(category: string): boolean {
    return this.bargraphCategory.includes(category);
  }

  getBarChartData(targetData: number[], achievedData: number[]) {
    return {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      datasets: [
        {
          label: 'Target',
          data: targetData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Achieved',
          data: achievedData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  // getBarChartData(barDataIn: number[], barDataOut: number[]) {
  //   return {
  //     labels: ['Shift A', 'Shift B', 'Shift C,','Shift A', 'Shift B', 'Shift C', 'Shift d'],
  //     datasets: [
  //       { backgroundColor: '#FF7043', data: barDataIn },
  //       { backgroundColor: '#26A69A', data: barDataOut }
  //     ]
  //   };
  // }

  // getBarChartData(section: any) {
  //   if (!section.dailyDetails || !section.target || !section.achieved) {
  //     // Fallback data if the expected properties don't exist
  //     return {
  //       labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
  //       datasets: [
  //         {
  //           label: 'Target',
  //           data: [0, 0, 0, 0, 0, 0, 0],
  //           backgroundColor: 'rgba(54, 162, 235, 0.5)',
  //           borderColor: 'rgba(54, 162, 235, 1)',
  //           borderWidth: 1
  //         },
  //         {
  //           label: 'Achieved',
  //           data: [0, 0, 0, 0, 0, 0, 0],
  //           backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //           borderColor: 'rgba(255, 99, 132, 1)',
  //           borderWidth: 1
  //         }
  //       ]
  //     };
  //   }
  
  //   return {
  //     labels: section.dailyDetails,
  //     datasets: [
  //       {
  //         label: 'Target',
  //         data: section.target,
  //         backgroundColor: 'rgba(54, 162, 235, 0.5)',
  //         borderColor: 'rgba(54, 162, 235, 1)',
  //         borderWidth: 1
  //       },
  //       {
  //         label: 'Achieved',
  //         data: section.achieved,
  //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //         borderColor: 'rgba(255, 99, 132, 1)',
  //         borderWidth: 1
  //       }
  //     ]
  //   };
  // }

  
initializeChartOptions() {
  this.chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    scales: {
      x: {
        stacked: false,
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: { 
        display: true,
        position: 'top'
      },
      datalabels: {
        anchor: 'end', 
        align: 'top', 
        font: { weight: 'bold', size: 8 },
        formatter: (value: number) => value 
      }
    }
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


