import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateSemesterComponent } from './form-create-semester.component';

describe('FormCreateSemesterComponent', () => {
  let component: FormCreateSemesterComponent;
  let fixture: ComponentFixture<FormCreateSemesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCreateSemesterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreateSemesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
