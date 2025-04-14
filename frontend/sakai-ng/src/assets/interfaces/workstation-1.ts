export interface ProcessScan {
    scan_rasin_can: string;
    scan_machine: string;
    scan_resin_tank: string;
    resin_tank_status: string;
    verified: boolean;
    timerActive?: boolean;
  }
  
  export interface Process {
    id: string;
    scans: ProcessScan;
    status: 'pending' | 'in-progress' | 'completed';
  }