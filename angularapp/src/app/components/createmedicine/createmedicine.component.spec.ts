import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemedicineComponent } from './createmedicine.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreatemedicineComponent', () => {
  let component: CreatemedicineComponent;
  let fixture: ComponentFixture<CreatemedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ReactiveFormsModule,HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [ CreatemedicineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatemedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_CreatemedicineComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_Create New Medicine_heading_in_the_CreatemedicineComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Create New Medicine');
  });
});
