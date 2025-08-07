import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogUploaderComponent } from './log-uploader.component';

describe('LogUploaderComponent', () => {
  let component: LogUploaderComponent;
  let fixture: ComponentFixture<LogUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogUploaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
