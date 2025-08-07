import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticsTableComponent } from './diagnostics-table.component';

describe('DiagnosticsTableComponent', () => {
  let component: DiagnosticsTableComponent;
  let fixture: ComponentFixture<DiagnosticsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiagnosticsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
