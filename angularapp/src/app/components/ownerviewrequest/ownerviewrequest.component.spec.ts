import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerviewrequestComponent } from './ownerviewrequest.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OwnerviewrequestComponent', () => {
  let component: OwnerviewrequestComponent;
  let fixture: ComponentFixture<OwnerviewrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule, FormsModule,ReactiveFormsModule],
      declarations: [ OwnerviewrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerviewrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_OwnerviewrequestComponent', () => {
    expect(component).toBeTruthy();
  });
});
