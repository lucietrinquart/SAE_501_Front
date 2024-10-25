import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFormComponentComponent } from './pdf-form-component.component';

describe('PdfFormComponentComponent', () => {
  let component: PdfFormComponentComponent;
  let fixture: ComponentFixture<PdfFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdfFormComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
