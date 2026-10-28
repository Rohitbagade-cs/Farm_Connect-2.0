import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliereditfeedComponent } from './suppliereditfeed.component';

describe('SuppliereditfeedComponent', () => {
  let component: SuppliereditfeedComponent;
  let fixture: ComponentFixture<SuppliereditfeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuppliereditfeedComponent]
    });
    fixture = TestBed.createComponent(SuppliereditfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
