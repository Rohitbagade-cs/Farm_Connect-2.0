import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerviewmedicineComponent } from './ownerviewmedicine.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OwnerviewmedicineComponent', () => {
  let component: OwnerviewmedicineComponent;
  let fixture: ComponentFixture<OwnerviewmedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ OwnerviewmedicineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerviewmedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_OwnerviewmedicineComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_Available Medicines_heading_in_the_OwnerviewmedicineComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Available Medicines');
  });
});
