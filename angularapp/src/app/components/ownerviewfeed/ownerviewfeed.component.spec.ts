import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerviewfeedComponent } from './ownerviewfeed.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OwnerviewfeedComponent', () => {
  let component: OwnerviewfeedComponent;
  let fixture: ComponentFixture<OwnerviewfeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ OwnerviewfeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerviewfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_OwnerviewfeedComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_Available Feeds_heading_in_the_OwnerviewfeedComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Available Feeds');
  });
});
