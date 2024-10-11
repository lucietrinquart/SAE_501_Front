import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateResourceComponent } from './form-create-resource.component';

describe('FormCreateResourceComponent', () => {
  let component: FormCreateResourceComponent;
  let fixture: ComponentFixture<FormCreateResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCreateResourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreateResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
