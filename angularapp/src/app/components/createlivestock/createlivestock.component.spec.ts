import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatelivestockComponent } from './createlivestock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreatelivestockComponent', () => {
  let component: CreatelivestockComponent;
  let fixture: ComponentFixture<CreatelivestockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ReactiveFormsModule,HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [ CreatelivestockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatelivestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_CreatelivestockComponent', () => {
    expect(component).toBeTruthy();
  });
});
