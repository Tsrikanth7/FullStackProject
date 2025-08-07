
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DiagnosticEntry {
  _id: string;
  timestamp: Date;
  vehicleId: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  errorCode: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DiagnosticResponse {
  data: DiagnosticEntry[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DiagnosticFilters {
  vehicleId?: string;
  severity?: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug'|'';
  errorCode?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DiagnosticsService {
  private apiUrl = 'http://localhost:3000/api/diagnostics';

  constructor(private http: HttpClient) { }

  uploadLogFile(file: File): Observable<DiagnosticEntry[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<DiagnosticEntry[]>(`${this.apiUrl}/upload`, formData);
  }

  getDiagnostics(filters: DiagnosticFilters): Observable<DiagnosticResponse> {
    let params = new HttpParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.append(key, value.toString());
      }
    });

    return this.http.get<DiagnosticResponse>(this.apiUrl, { params });
  }
}