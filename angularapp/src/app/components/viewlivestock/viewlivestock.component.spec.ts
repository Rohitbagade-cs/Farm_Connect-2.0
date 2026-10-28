import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlivestockComponent } from './viewlivestock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewlivestockComponent', () => {
  let component: ViewlivestockComponent;
  let fixture: ComponentFixture<ViewlivestockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ ViewlivestockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewlivestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_ViewlivestockComponent', () => {
    expect(component).toBeTruthy();
  });
});
