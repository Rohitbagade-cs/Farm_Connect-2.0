import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnereditlivestockComponent } from './ownereditlivestock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OwnereditlivestockComponent', () => {
  let component: OwnereditlivestockComponent;
  let fixture: ComponentFixture<OwnereditlivestockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ OwnereditlivestockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnereditlivestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_OwnereditlivestockComponent', () => {
    expect(component).toBeTruthy();
  });
});
