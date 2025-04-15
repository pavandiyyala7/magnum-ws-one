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

interface ProductionProcess {
  id: string;
  scans: ProcessScans;
  status: 'pending' | 'active' | 'completed';
}

interface Tank {
  id: string;
  name: string;
  status: string;
  level: number;
  lotCode: string;
  statusColor: string;
  resinCanId?: string;
  machineId?: string;
  remainingTime?: string;
  fillPercentage?: number;
}

interface InventoryItem {
  id: string;
  name: string;
  type: 'resin-can' | 'machine' | 'resin-tank';
}

interface Machine {
  id: string;
  name: string;
  tanks: Tank[];
}

interface ResinCan {
  id: string;
  name: string;
  machines: Machine[];
}

@Component({
  selector: 'app-work-station',
  standalone: true,
  imports: [CommonModule,DropdownModule, FormsModule, QRCodeModule,  InputTextModule, FloatLabelModule, ToastModule, MessageModule],
  templateUrl: './work-station.component.html',
  styleUrl: './work-station.component.scss'
})
export class WorkStationComponent implements OnInit, OnDestroy{

  currentDate: string = '';
  currentTime: string = '';
  timeInterval: any;

  completedProcesses: ProductionProcess[] = [];
  
  tanks: Tank[] = [
    {
      id: 'TANK001',
      name: 'A Resin Tank',
      status: 'Ready for Fill',
      level: 0,
      lotCode: '',
      statusColor: '#2ecc71'
    },
    {
      id: 'TANK002',
      name: 'B Resin Tank',
      status: 'Ready for Fill',
      lotCode: '',
      level: 0,
      statusColor: '#2ecc71'
    }
  ];

  // resinCans: ResinCan[] = [];
  allMachines: Machine[] = [];
  allTanks: Tank[] = [];
  filteredTanks: Tank[] = [];
  displayedTanks: Tank[] = [];
  currentTankBeingFilled: Tank | null = null;

  lotNumbers: any[] = [];
  currentLotNumberId: string = '';
  currentLotNumber: any;
  
  resinCans: ResinCan[] = [
    {
      id: 'C1',
      name: 'Resin Can 1',
      machines: [
        {
          id: 'M1-1',
          name: 'Machine 1',
          tanks: [
            {
              id: 'T1-1-1',
              name: 'Tank 1',
              status: 'Empty',
              level: 0,
              lotCode: '',
              statusColor: 'gray',
              resinCanId: '',
              machineId: '',
              remainingTime: '',
              fillPercentage: 0
            },
            {
              id: 'T1-1-2',
              name: 'Tank 2',
              status: 'Empty',
              level: 0,
              lotCode: '',
              statusColor: 'gray',
              resinCanId: '',
              machineId: '',
              remainingTime: '',
              fillPercentage: 0
            }
          ]
        },
        {
          id: 'M1-2',
          name: 'Machine 2',
          tanks: [
            {
              id: 'T1-2-1',
              name: 'Tank 1',
              status: 'Empty',
              level: 0,
              lotCode: '',
              statusColor: 'gray',
              resinCanId: '',
              machineId: '',
              remainingTime: '',
              fillPercentage: 0
            },
            {
              id: 'T1-2-2',
              name: 'Tank 2',
              status: 'Empty',
              level: 0,
              lotCode: '',
              statusColor: 'gray',
              resinCanId: '',
              machineId: '',
              remainingTime: '',
              fillPercentage: 0
            }
          ]
        }
      ]
    },
    {
      id: 'CAN002',
      name: 'Resin Can 2',
      machines: [
        {
          id: 'M2-1',
          name: 'Machine 1',
          tanks: [
            {
              id: 'T2-1-1',
              name: 'Tank 1',
              status: 'Empty',
              level: 0,
              lotCode: '',
              statusColor: 'gray',
              resinCanId: '',
              machineId: '',
              remainingTime: '',
              fillPercentage: 0
            },
            {
              id: 'T2-1-2',
              name: 'Tank 2',
              status: 'Empty',
              level: 0,
              lotCode: '',
              statusColor: 'gray',
              resinCanId: '',
              machineId: '',
              remainingTime: '',
              fillPercentage: 0
            }
          ]
        }
      ]
    }
  ];

  
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

  sampleLotNumbers = [
    { id: 'LOT-01', name: 'Production Batch 1', status: 'Active' },
    { id: 'LOT-02', name: 'Production Batch 2', status: 'Active' },
    { id: 'LOT-03', name: 'Quality Control', status: 'Hold' },
    { id: 'LOT-04', name: 'Shipping Batch', status: 'Completed' }
  ];

  unlockSequence = [
    { 
      id: 'scan_rasin_can', 
      validIds: this.resinCans.map(can => can.id),
      nextField: 'scan_machine',
      errorMessage: 'Invalid Resin Can ID'
    },
    { 
      id: 'scan_machine', 
      validIds: this.allMachines.map(machine => machine.id),
      nextField: 'scan_resin_tank',
      errorMessage: 'Invalid Machine ID'
    },
    { 
      id: 'scan_resin_tank', 
      validIds: this.allTanks.map(tank => tank.id),
      nextField: 'resin_tank_status',
      errorMessage: 'Invalid Resin Tank ID'
    },
    { 
      id: 'resin_tank_status', 
      code: 'STATUS012' 
    }
  ];

  ngOnInit(): void {
    this.initializeInventory();
    this.initializeLotNumbers();
    this.updateFilteredTanks(['T1-1-1', 'T1-1-2']);
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

  updateFilteredTanks(ids: string | string[]): void {
    const searchIds = Array.isArray(ids) ? ids : [ids];
   
    const newMatches = this.tanks.filter(tank => 
      searchIds.some(id => tank.id.includes(id))
    );
    this.filteredTanks = [
      ...this.filteredTanks,
      ...newMatches
    ].slice(-2); 
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


  onProcessChange() {
    this.currentActiveField = 'scan_rasin_can';
    this.successMessage = null;
    this.errorMessage = null;
  }

  updateTanks(newTanks: Tank[]) {
    const tankA = this.tanks.find(t => t.name === 'A Resin Tank');
    if (tankA) {
      const newTankA = newTanks.find(t => t.name === 'A Resin Tank');
      if (newTankA) {
        Object.assign(tankA, newTankA);
      }
    }
    
    const tankB = this.tanks.find(t => t.name === 'B Resin Tank');
    if (tankB) {
      const newTankB = newTanks.find(t => t.name === 'B Resin Tank');
      if (newTankB) {
        Object.assign(tankB, newTankB);
      }
    }
  }

  initializeInventory(): void {
      for (let i = 1; i <= 5; i++) {
        const canId = `C${i}`;  // Simplified to C1, C2,...C5
        const can: ResinCan = {
          id: canId,
          name: `Can ${i}`,
          machines: []
        };
    
        for (let j = 1; j <= 12; j++) {
          const machineId = `M${i}-${j}`;  // Simplified to M1-1, M1-2,...M5-12
          const machine: Machine = {
            id: machineId,
            name: `M${i}-${j}`,
            tanks: []
          };
    
          for (let k = 1; k <= 2; k++) {
            const tankId = `T${i}-${j}-${k}`;  // Simplified to T1-1-1, T1-1-2,...T5-12-2
            const tank: Tank = {
              id: tankId,
              name: `${String.fromCharCode(64 + k)} Resin Tank`, 
              status: 'Ready for Fill',
              level: 0,
              lotCode: '',
              statusColor: '#2ecc71',
              machineId: machineId,
              resinCanId: ''
            };
    
            machine.tanks.push(tank);
            this.allTanks.push(tank);
          }
    
          can.machines.push(machine);
          this.allMachines.push(machine);
        }
    
        this.resinCans.push(can);
      }
    
      this.tanks = [...this.allTanks];
    }
  
  checkCode(fieldId: string, enteredValue: string | undefined) {
    if (!enteredValue || !this.currentProcess) {
        this.errorMessage = 'Please enter a valid code';
        setTimeout(() => this.errorMessage = null, 3000);
        return;
    }

    const currentStep = this.unlockSequence.find(step => step.id === fieldId);
    
    if (!currentStep) {
        this.errorMessage = 'Invalid operation';
        setTimeout(() => this.errorMessage = null, 3000);
        return;
    }

    
    let isValid = false;
    let matchedItem: any = null;
    let errorMsg = '';

    switch(fieldId) {
        case 'scan_rasin_can':
            matchedItem = this.resinCans.find(can => can.id === enteredValue);
            isValid = !!matchedItem;
            errorMsg = 'Invalid Resin Can ID. Please scan a valid Resin Can.';
            break;

        case 'scan_machine':
            if (!this.currentProcess.scans.scan_rasin_can) {
                errorMsg = 'Please scan Resin Can first';
                break;
            }
            
            const currentCan = this.resinCans.find(c => c.id === this.currentProcess.scans.scan_rasin_can);
            if (!currentCan) {
                errorMsg = 'Invalid Resin Can reference';
                break;
            }
            
            matchedItem = currentCan.machines.find(m => m.id === enteredValue);
            isValid = !!matchedItem;
            errorMsg = 'Invalid Machine ID for this Resin Can. Please scan a valid Machine.';
            break;

        case 'scan_resin_tank':
            if (!this.currentProcess.scans.scan_machine) {
                errorMsg = 'Please scan Machine first';
                break;
            }
            
            const currentMachine = this.allMachines.find(m => m.id === this.currentProcess.scans.scan_machine);
            if (!currentMachine) {
                errorMsg = 'Invalid Machine reference';
                break;
            }
            
            matchedItem = currentMachine.tanks.find(t => t.id === enteredValue);
            isValid = !!matchedItem;
            
            if (matchedItem) {
              if (matchedItem.status === 'Filling') {
                isValid = false;
                errorMsg = 'This tank is currently being filled. Please wait.';
              } 
              else if (matchedItem.status === 'Filled') {
                    isValid = false;
                    errorMsg = 'This tank is already filled. Please select another tank.';
                } else {
                    this.currentTankBeingFilled = matchedItem;
                }
            } else {
                errorMsg = 'Invalid Tank ID for this Machine. Please scan a valid Tank.';
            }
            break;

        default:
            isValid = enteredValue === currentStep.code;
            errorMsg = `Invalid ${this.getFieldLabel(fieldId)} code`;
    }

    if (isValid) {
        let successMsg = '';
        let timer = false;
        
        switch(fieldId) {
            case 'scan_rasin_can':
                successMsg = 'Resin Can verified. Please scan Machine.';
                setTimeout(() => {
                    const nextField = document.getElementById('scan_machine');
                    if (nextField) nextField.focus();
                }, 100);
                break;

            case 'scan_machine':
                successMsg = 'Machine verified. Please scan Resin Tank.';
                setTimeout(() => {
                    const nextField = document.getElementById('scan_resin_tank');
                    if (nextField) nextField.focus();
                }, 100);
                break;

            case 'scan_resin_tank':
                if (this.currentTankBeingFilled) {
                    this.currentTankBeingFilled.resinCanId = this.currentProcess.scans.scan_rasin_can;
                    this.currentTankBeingFilled.lotCode = this.currentLotNumberId;
                    this.updateFilteredTanks(enteredValue)
                    successMsg = `Tank ${this.currentTankBeingFilled.name} verified. Filling process started...`;
                    timer = true;
                    this.startTankFilling(this.currentTankBeingFilled);
                }
                break;

                case 'resin_tank_status':
                  successMsg = `Resin Tank filled and status updated successfully!`;
                  if (this.currentProcess) {
                    this.currentProcess.scans.verified = true;
                    this.currentProcess.status = 'completed';
                
                    this.completedProcesses.push(this.currentProcess);
                
                    this.processes = this.processes.filter(p => p.id !== this.currentProcess!.id);
                  }
                  break;
                

            default:
                successMsg = `Operation successful: ${this.getFieldLabel(fieldId)}`;
        }

        this.successMessage = successMsg;
        this.errorMessage = null;
        
        if (!timer) {
            setTimeout(() => this.successMessage = null, 3000);
        }
        
    } else {
        this.errorMessage = errorMsg;
        this.successMessage = null;
        setTimeout(() => this.errorMessage = null, 3000);
        
        switch(fieldId) {
            case 'scan_rasin_can':
                this.currentProcess.scans.scan_rasin_can = '';
                break;
            case 'scan_machine':
                this.currentProcess.scans.scan_machine = '';
                break;
            case 'scan_resin_tank':
                this.currentProcess.scans.scan_resin_tank = '';
                break;
        }
        
        setTimeout(() => {
            const currentField = document.getElementById(fieldId);
            if (currentField) currentField.focus();
        }, 100);
    }
}
 
startTankFilling(tank: Tank) {
  tank.status = 'Filling';
  tank.statusColor = '#fcd031';
  
  const fillDuration = 45; 
  let remaining = fillDuration;
  
  tank.remainingTime = this.formatTime(remaining);
  tank.fillPercentage = 0;

  const interval = setInterval(() => {
    remaining--;
    const progress = Math.round(((fillDuration - remaining) / fillDuration) * 100);
    
    tank.level = progress;
    tank.fillPercentage = progress;
    tank.remainingTime = this.formatTime(remaining);
    
    this.successMessage = `Filling Is Going On`;
    

    if (remaining <= 0) {
      clearInterval(interval);
      tank.status = 'Filled';
      tank.statusColor = '#e74c3c';
      tank.remainingTime = 'Completed';
      tank.fillPercentage = 100;
      
      this.successMessage = `${tank.name} filled successfully!`;
      this.currentTankBeingFilled = null;
      
      setTimeout(() => {
        this.successMessage = null;
        const nextField = document.getElementById('resin_tank_status');
        if (nextField) nextField.focus();
        
        if (this.currentProcess) {
          this.currentProcess.scans.resin_tank_status = `${tank.name} is Filled`;
        }
      }, 3000);
    }
  }, 1000);
}
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
