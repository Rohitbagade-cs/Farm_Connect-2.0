import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmedicineComponent } from './viewmedicine.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewmedicineComponent', () => {
  let component: ViewmedicineComponent;
  let fixture: ComponentFixture<ViewmedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ ViewmedicineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewmedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_ViewmedicineComponent', () => {
    expect(component).toBeTruthy();
  });
});
