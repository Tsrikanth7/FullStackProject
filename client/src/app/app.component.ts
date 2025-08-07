import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogUploaderComponent } from './components/log-uploader/log-uploader.component';
import { DiagnosticsTableComponent } from './components/diagnostics-table/diagnostics-table.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LogUploaderComponent,DiagnosticsTableComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Vehicle Diagnostics Dashboard';
}
