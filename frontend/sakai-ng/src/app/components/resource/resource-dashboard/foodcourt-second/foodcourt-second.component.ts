import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from 'docx';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileType, OrderData } from 'src/assets/interfaces/foodcourtsecond';

@Component({
  selector: 'app-foodcourt-second',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule, DropdownModule, ButtonModule, ],
  templateUrl: './foodcourt-second.component.html',
  styleUrl: './foodcourt-second.component.scss'
})
export class FoodcourtSecondComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  currentDate: string = '';
  currentTime: string = '';
  chart!: Chart;
  chartDataGroups: any[] = [];
  currentChartIndex: number = 0;
  pageSize: number = 5;
  autoSlideInterval: any;

  orders: OrderData[] =[
    { name: 'M-1', order: 86, utilized: 56, missing: 30 },
    { name: 'M-2', order: 55, utilized: 37, missing: 18 },
    { name: 'M-3', order: 40, utilized: 35, missing: 5 },
    { name: 'M-4', order: 65, utilized: 55, missing: 10 },
    { name: 'M-5', order: 59, utilized: 45, missing: 14 },
    { name: 'M-6', order: 70, utilized: 60, missing: 10 },
    { name: 'M-7', order: 50, utilized: 40, missing: 10 },
    { name: 'M-8', order: 80, utilized: 70, missing: 10 },
    { name: 'M-9', order: 95, utilized: 80, missing: 15 },
    { name: 'M-10', order: 45, utilized: 35, missing: 10 }
  ];

  fileTypes: FileType[] = [];
  formGroup: FormGroup;

  constructor(private cdr: ChangeDetectorRef) {
    Chart.register(...registerables, ChartDataLabels);
    this.formGroup = new FormGroup({
      selectedFileType: new FormControl<FileType | null>(null)
    });
  }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
    this.prepareChartData();

    this.fileTypes = [
      { name: 'Word', code: 'word' },
      { name: 'PDF', code: 'pdf' }
    ];
  }
  ngAfterViewInit(): void {
    this.createChart();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-GB').split('/').join('-'); 
    this.currentTime = now.toLocaleTimeString('en-GB', { hour12: false });
  }

  prepareChartData(): void {
    this.chartDataGroups = [];
    for (let i = 0; i < this.orders.length; i += this.pageSize) {
      this.chartDataGroups.push(this.orders.slice(i, i + this.pageSize));
    }
  }

  createChart(): void {
    if (!this.chartCanvas?.nativeElement) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const chartData: OrderData[] = this.chartDataGroups[this.currentChartIndex] || [];

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar' as ChartType,
      data: {
        labels: chartData.map((d: OrderData) => d.name),
        datasets: [
          {
            label: 'Order',
            backgroundColor: '#0000FF',
            data: chartData.map((d: OrderData) => d.order),
          },
          {
            label: 'Utilisation',
            backgroundColor: '#FFC857',
            data: chartData.map((d: OrderData) => d.utilized),
          },
          {
            label: 'Missing',
            backgroundColor: '#FF0000',
            data: chartData.map((d: OrderData) => d.missing),
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          datalabels: {
            display: true,
            anchor: 'center',
            align: 'center',
            font: { weight: 'bold', size: 14 },
            color: '#fff',
            formatter: (value: number) => value > 0 ? value : ''
          }
        },
        scales: {
          x: { ticks: { color: '#000' } },
          y: { ticks: { color: '#000' } }
        }
      }
    });
  }

  nextSlide(): void {
    this.currentChartIndex = (this.currentChartIndex + 1) % this.chartDataGroups.length;
    this.createChart();
  }

  previousSlide(): void {
    this.currentChartIndex = (this.currentChartIndex - 1 + this.chartDataGroups.length) % this.chartDataGroups.length;
    this.createChart();
  }

  downloadFile() {
    if (!this.formGroup?.value.selectedFileType) return;
    
    const selectedFile = this.formGroup.value.selectedFileType.code;
    if (selectedFile === 'word') {
        this.downloadWord();
    } else if (selectedFile === 'pdf') {
        this.downloadPDF();
    }
}

// downloadWord() {
//   const doc = new Document({
//       sections: [{
//           children: [
//               new Paragraph('Download Example'),
//               new Table({
//                   rows: [
//                       new TableRow({
//                           children: [
//                               new TableCell({ children: [new Paragraph('File Type')] }),
//                               new TableCell({ children: [new Paragraph('Description')] })
//                           ]
//                       }),
//                       new TableRow({
//                           children: [
//                               new TableCell({ children: [new Paragraph('Word')] }),
//                               new TableCell({ children: [new Paragraph('Download as .docx file')] })
//                           ]
//                       }),
//                       new TableRow({
//                           children: [
//                               new TableCell({ children: [new Paragraph('PDF')] }),
//                               new TableCell({ children: [new Paragraph('Download as .pdf file')] })
//                           ]
//                       })
//                   ]
//               })
//           ]
//       }]
//   });

//   Packer.toBlob(doc).then(blob => {
//       saveAs(blob, 'DownloadExample.docx');
//   });
// }

// downloadPDF() {
//   const doc = new jsPDF();
//   doc.text('Download Example', 10, 10);
//   doc.text('File Type: Word - Download as .docx file', 10, 20);
//   doc.text('File Type: PDF - Download as .pdf file', 10, 30);
//   doc.save('DownloadExample.pdf');
// }
  downloadChartData(format: string) {
    if (format === 'word') {
      this.downloadWord();
    } else if (format === 'pdf') {
      this.downloadPDF();
    }
  }

  downloadWord() {
    const tableRows = this.orders.map(order => new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(order.name)] }),
        new TableCell({ children: [new Paragraph(order.order.toString())] }),
        new TableCell({ children: [new Paragraph(order.utilized.toString())] }),
        new TableCell({ children: [new Paragraph(order.missing.toString())] })
      ]
    }));

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: 'Food Court Order Data', heading: 'Heading1' }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Name')] }),
                  new TableCell({ children: [new Paragraph('Order')] }),
                  new TableCell({ children: [new Paragraph('Utilized')] }),
                  new TableCell({ children: [new Paragraph('Missing')] })
                ]
              }),
              ...tableRows
            ]
          })
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'ChartData.docx');
    });
  }

  downloadPDF() {
    const doc = new jsPDF();
    doc.text('Food Court Order Data', 10, 10);

    let yPos = 20;
    doc.text('Name   |  Order  |  Utilized  |  Missing', 10, yPos);
    yPos += 10;

    this.orders.forEach(order => {
      doc.text(`${order.name}   |   ${order.order}   |   ${order.utilized}   |   ${order.missing}`, 10, yPos);
      yPos += 10;
    });

    doc.save('ChartData.pdf');
  }


  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
  }
}

