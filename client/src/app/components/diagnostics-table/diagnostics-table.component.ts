import { Component, OnInit } from '@angular/core';
import { DiagnosticEntry, DiagnosticFilters, DiagnosticsService } from '../../services/diagnotics.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule],
  selector: 'app-diagnostics-table',
  templateUrl: './diagnostics-table.component.html',
  styleUrls: ['./diagnostics-table.component.scss'],
})
export class DiagnosticsTableComponent implements OnInit {
  data: DiagnosticEntry[] = [];
  total = 0;
  page = 1;
  pageSize = 20;
  isLoading = false;
  logLevelOptions = [
  { value: '', label: 'All' },
  { value: 'error', label: 'Error' },
  { value: 'warn', label: 'Warning' },
  { value: 'info', label: 'Info' },
  { value: 'debug', label: 'Debug' }
];

filters: DiagnosticFilters = {
  vehicleId: '',
  logLevel: '',
  errorCode: '',
  severity: '',
  fromDate: '',
  toDate: ''
};

  severityOptions = [
    { value: '', label: 'All' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
Math: any;

  constructor(private diagnosticsService: DiagnosticsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
   const params: DiagnosticFilters = {
    ...this.filters,
    page: this.page,
    limit: this.pageSize
  };

    this.diagnosticsService.getDiagnostics(params).subscribe({
      next: (response:any) => {
        this.data = response.data;
        this.total = response.total;
        this.isLoading = false;
      },
      error: (err:any) => {
        console.error('Error loading data:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 1; // Reset to first page when filters change
    this.loadData();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadData();
  }
}