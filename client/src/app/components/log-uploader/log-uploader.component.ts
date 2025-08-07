import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DiagnosticsService } from '../../services/diagnotics.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-log-uploader',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './log-uploader.component.html',
  styleUrl: './log-uploader.component.scss'
})
export class LogUploaderComponent {
  @Output() uploadComplete = new EventEmitter<void>();
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private diagnosticsService: DiagnosticsService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.errorMessage = null;
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.diagnosticsService.uploadLogFile(this.selectedFile).subscribe({
      next: () => {
        this.isLoading = false;
        this.selectedFile = null;
        this.uploadComplete.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Failed to upload file';
      }
    });
  }
}