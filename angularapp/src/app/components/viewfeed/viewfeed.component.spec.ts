import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfeedComponent } from './viewfeed.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewfeedComponent', () => {
  let component: ViewfeedComponent;
  let fixture: ComponentFixture<ViewfeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ ViewfeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_ViewfeedComponent', () => {
    expect(component).toBeTruthy();
  });
});
