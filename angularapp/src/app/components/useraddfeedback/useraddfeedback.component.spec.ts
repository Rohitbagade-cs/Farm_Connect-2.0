import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseraddfeedbackComponent } from './useraddfeedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UseraddfeedbackComponent', () => {
  let component: UseraddfeedbackComponent;
  let fixture: ComponentFixture<UseraddfeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UseraddfeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseraddfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_UseraddfeedbackComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_Add_Feedback_heading_in_the_UseraddfeedbackComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Add Feedback');
  });
});
