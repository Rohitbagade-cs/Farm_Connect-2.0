import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierEditMedicineComponent } from './suppliereditmedicine.component';


describe('SuppliereditmedicineComponent', () => {
  let component: SupplierEditMedicineComponent;
  let fixture: ComponentFixture<SupplierEditMedicineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierEditMedicineComponent]
    });
    fixture = TestBed.createComponent(SupplierEditMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
