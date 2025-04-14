import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

interface ProcessScans {
  scan_rasin_can: string;
  scan_machine: string;
  scan_resin_tank: string;
  resin_tank_status: string;
  verified: boolean;
  timerActive?: boolean;
}

interface Process {
  id: string;
  scans: ProcessScans;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ProductionProcess {
  id: string;
  scans: ProcessScans;
  status: 'pending' | 'active' | 'completed';
}

@Component({
  selector: 'app-work-station',
  standalone: true,
  imports: [CommonModule,DropdownModule, FormsModule, QRCodeModule,  InputTextModule, FloatLabelModule, ToastModule, MessageModule],
  templateUrl: './work-station.component.html',
  styleUrl: './work-station.component.scss'
})
export class WorkStationComponent implements OnInit, OnDestroy {

  qrValue = 'https://example.com';
  currentDate: string = '';
  currentTime: string = '';
  timeInterval: any;

  tank = {
    level: 60,
  };
  
  lotNumbers: any[] = [];
  currentLotNumberId: string = '';
  currentLotNumber: any;
  
  gradient = 'linear-gradient(to top, #00ff88, #66ffcc)';
  fillTransition = 'clip-path 1s ease-in-out';
  
  processes: ProductionProcess[] = [
    {
      id: 'PROC-001',
      scans: {
        scan_rasin_can: '',
        scan_machine: '',
        scan_resin_tank: '',
        resin_tank_status: '',
        verified: false
      },
      status: 'pending'
    },
    {
      id: 'PROC-002',
      scans: {
        scan_rasin_can: '',
        scan_machine: '',
        scan_resin_tank: '',
        resin_tank_status: '',
        verified: false
      },
      status: 'pending'
    }
  ];

  currentProcessId: string = 'PROC-001';
  currentActiveField: string = 'scan_rasin_can';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  tanks = [
    {
      name: 'A Resin Tank',
      status: 'Ready for Fill',
      level: 0,
      lotCode: '',
      statusColor: '#2ecc71'
    },
    {
      name: 'B Resin Tank',
      status: 'Ready for Fill',
      lotCode: '',
      level: 0,
      statusColor: '#2ecc71'
    }
  ];

  sampleLotNumbers = [
    { id: 'LOT-00001', name: 'Production Batch 1', status: 'Active' },
    { id: 'LOT-00002', name: 'Production Batch 2', status: 'Active' },
    { id: 'LOT-00003', name: 'Quality Control', status: 'Hold' },
    { id: 'LOT-00004', name: 'Shipping Batch', status: 'Completed' }
  ];

  unlockSequence = [
    { id: 'scan_rasin_can', code: 'CAN123', nextField: 'scan_machine' },
    { id: 'scan_machine', code: 'MACH456', nextField: 'scan_resin_tank' },
    { id: 'scan_resin_tank', code: 'TANK789', nextField: 'resin_tank_status' },
    { id: 'resin_tank_status', code: 'STATUS012' }
  ];

  // Removed unlockedFields array since all fields are now unlocked

  ngOnInit(): void {
    this.initializeLotNumbers();
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval); 
    }
  }

  get currentProcess(): ProductionProcess {
    return this.processes.find(p => p.id === this.currentProcessId)!;
  }

  get currentScans(): ProcessScans | undefined {
    return this.currentProcess?.scans;
  }

  getClipPath(level: number): string {
    const top = 100 - level;
    return `polygon(0 ${top}%, 100% ${top}%, 100% 100%, 0 100%)`;
  }
  
  updateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-GB').split('/').join('-'); 
    this.currentTime = now.toLocaleTimeString('en-GB', { hour12: false });   
  }

  initializeLotNumbers(): void {
    this.lotNumbers = this.sampleLotNumbers;
    if (this.lotNumbers.length > 0) {
      this.currentLotNumberId = this.lotNumbers[0].id;
      this.currentLotNumber = this.lotNumbers[0];
    }
  }

  onLotNumberChange(): void {
    this.currentLotNumber = this.lotNumbers.find(
      lot => lot.id === this.currentLotNumberId
    );
    console.log('Selected Lot Number:', this.currentLotNumber);
    this.addNewProcess();
  }

  onProcessChange() {
    this.currentActiveField = 'scan_rasin_can';
    this.successMessage = null;
    this.errorMessage = null;
  }

  checkCode(fieldId: string, enteredValue: string | undefined) {
    if (!enteredValue || !this.currentProcess) return;

    const currentStep = this.unlockSequence.find(step => step.id === fieldId);
    
    if (currentStep && enteredValue === currentStep.code) {
      let successMsg = '';
      let timer = false;
      
      switch(fieldId) {
        case 'scan_rasin_can':
          successMsg = 'Verified Resin CAN, Please Scan Machine';
          break;
        case 'scan_machine':
          successMsg = 'Verified M/C, Please Scan \'B\' Resin Tank';
          break;
        case 'scan_resin_tank':
          successMsg = 'Verified Resin Tank, Filling in progress...';
          timer = true;
          this.updateTankStatus('B Resin Tank', 'Filling', '#fcd031', 50, '1234');
          this.startCountdown(45);
          break;
        default:
          successMsg = `Verified ${this.getFieldLabel(fieldId)}`;
      }

      this.successMessage = successMsg;
      
      if (currentStep.nextField) {
        this.currentActiveField = currentStep.nextField;
        
        if (!timer) {
          setTimeout(() => {
            const nextField = document.getElementById(currentStep.nextField!);
            if (nextField) nextField.focus();
          }, 100);
        }
      }
      
      if (!timer) {
        setTimeout(() => this.successMessage = null, 3000);
      }
      
      if (fieldId === 'resin_tank_status') {
        this.currentProcess.scans.verified = true;
        this.currentProcess.status = 'completed';
      }
    } else {
      this.errorMessage = `Invalid code for ${this.getFieldLabel(fieldId)}`;
      setTimeout(() => this.errorMessage = null, 3000);
    }
  }

  // Removed isFieldDisabled() method since all fields are now enabled

  getFieldLabel(fieldId: string): string {
    const labels: {[key: string]: string} = {
      'scan_rasin_can': 'Scan Rasin Can',
      'scan_machine': 'Scan Machine',
      'scan_resin_tank': 'Scan Resin Tank',
      'resin_tank_status': 'Resin Tank Status'
    };
    return labels[fieldId] || '';
  }

  startCountdown(seconds: number) {
    const tankB = this.tanks.find(tank => tank.name === 'B Resin Tank');
    if (!tankB) return;

    this.updateTankStatus(
      'B Resin Tank', 
      'Filling', 
      '#fcd031', 
      0,
      this.currentProcess?.scans.scan_resin_tank || ''
    );

    let remaining = seconds;
    const interval = setInterval(() => {
      remaining--;
      const progress = Math.round(((seconds - remaining) / seconds) * 100);
      
      this.updateTankStatus(
        'B Resin Tank',
        'Filling',
        '#fcd031',
        progress
      );
      
      this.successMessage = `Filling in progress... ${this.formatTime(remaining)} remaining (${progress}%)`;
      
      if (remaining <= 0) {
        clearInterval(interval);
        this.updateTankStatus(
          'B Resin Tank', 
          'Filled', 
          '#e74c3c',  
          100,  
          tankB.lotCode  
        );
        
        this.successMessage = 'Resin Tank B filled successfully!';
        
        setTimeout(() => {
          this.successMessage = null;
          const nextField = document.getElementById('resin_tank_status');
          if (nextField) nextField.focus();
          
          if (this.currentProcess) {
            this.currentProcess.scans.resin_tank_status = `B Resin Tank is Filled`;
          }
        }, 3000);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  updateTankStatus(tankName: string, status: string, color: string, level?: number, lotCode?: string) {
    const tank = this.tanks.find(t => t.name === tankName);
    if (tank) {
      tank.status = status;
      tank.statusColor = color;
      
      if (level !== undefined) {
        tank.level = level;
      }
      
      if (lotCode !== undefined) {
        tank.lotCode = lotCode;
      }
      
      if (this.currentProcess) {
        this.currentProcess.scans.resin_tank_status = `${tankName}: ${status}`;
      }
    }
  }

  addNewProcess() {
    const newId = `PROC-${(this.processes.length + 1).toString().padStart(3, '0')}`;
    this.processes.push({
      id: newId,
      scans: {
        scan_rasin_can: '',
        scan_machine: '',
        scan_resin_tank: '',
        resin_tank_status: '',
        verified: false
      },
      status: 'pending'
    });
    this.currentProcessId = newId;
    this.onProcessChange();
  }

  generateNewLotNumber(): string {
    const nextNumber = this.lotNumbers.length + 1;
    return `LOT-${nextNumber.toString().padStart(5, '0')}`;
  }

  resetFieldValue(fieldId: string) {
    const fieldIndex = this.unlockSequence.findIndex(step => step.id === fieldId);
    if (fieldIndex >= 0) {
      this[`value${fieldIndex + 1}`] = '';
    }
  }
}
