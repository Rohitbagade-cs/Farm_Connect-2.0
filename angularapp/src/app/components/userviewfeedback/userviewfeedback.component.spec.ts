import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserviewfeedbackComponent } from './userviewfeedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserviewfeedbackComponent', () => {
  let component: UserviewfeedbackComponent;
  let fixture: ComponentFixture<UserviewfeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UserviewfeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserviewfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_UserviewfeedbackComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_my_feedback_heading_in_the_UserviewfeedbackComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('My Feedback');
  });
});
