import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVacataireComponent } from './page-vacataire.component';

describe('PageVacataireComponent', () => {
  let component: PageVacataireComponent;
  let fixture: ComponentFixture<PageVacataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageVacataireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageVacataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
