import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierrequestsComponent } from './supplierrequests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SupplierrequestsComponent', () => {
  let component: SupplierrequestsComponent;
  let fixture: ComponentFixture<SupplierrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ SupplierrequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_SupplierrequestsComponent', () => {
    expect(component).toBeTruthy();
  });
});
