import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatefeedComponent } from './createfeed.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('CreatefeedComponent', () => {
  let component: CreatefeedComponent;
  let fixture: ComponentFixture<CreatefeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [ CreatefeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatefeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should create_CreatefeedComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_Create New Feed_heading_in_the_CreatefeedComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Create New Feed');
  });
});
