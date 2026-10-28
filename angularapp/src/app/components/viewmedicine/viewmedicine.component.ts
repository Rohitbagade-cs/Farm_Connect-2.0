import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../../services/medicine.service';
import { Medicine } from '../../models/medicine.model';

@Component({
  selector: 'app-viewmedicine',
  templateUrl: './viewmedicine.component.html',
  styleUrls: ['./viewmedicine.component.css']
})
export class ViewmedicineComponent implements OnInit {

  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  searchText: string = '';

  deleteErrorMessage: string = '';

  showImagePopup: boolean = false;
  selectedImage: string = '';

  constructor(private medicineService: MedicineService) {}

  ngOnInit(): void {
    this.getAllMedicines();
  }

  getAllMedicines(): void {
    this.medicineService.getAllMedicine().subscribe({
      next: (data: any[]) => {
        // MAP camelCase → PascalCase
        this.medicines = data.map(x => ({
          MedicineId: x.medicineId,
          MedicineName: x.medicineName,
          Brand: x.brand,
          Category: x.category,
          Description: x.description,
          Quantity: x.quantity,
          Unit: x.unit,
          PricePerUnit: x.pricePerUnit,
          Image: x.image,
          UserId: x.userId
        }));
  
        this.filteredMedicines = this.medicines;
        this.loadRequestCounts();
        this.deleteErrorMessage = '';
      },
      error: (err) => {
        console.error('Error fetching medicines', err);
      }
    });
  }
  

  searchMedicine(): void {
    this.filteredMedicines = this.medicines.filter(med =>
      med.MedicineName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      med.Brand.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Fetch per-medicine request counts so the UI can explain blocked deletes
  private loadRequestCounts(): void {
    this.medicines.forEach(m => {
      if (m.MedicineId == null) return;
      this.medicineService.getMedicineRequestCount(m.MedicineId).subscribe({
        next: (c) => { m.RequestCount = c; },
        error: () => { m.RequestCount = 0; }
      });
    });
  }

  /** Tooltip / disabled reason for the Delete button */
  deleteBlockedReason(medicine: Medicine): string {
    const c = medicine.RequestCount ?? 0;
    return c > 0
      ? `Cannot delete: this medicine is referenced by ${c} request(s). Resolve the requests first.`
      : 'Delete this medicine';
  }

  deleteMedicine(id?: number): void {
    if (!id) {
      this.deleteErrorMessage = 'Invalid medicine id';
      return;
    }
  
    if (!confirm('Are you sure you want to delete?')) return;
  
    this.medicineService.deleteMedicine(id).subscribe({
      next: () => {
        alert('Medicine deleted successfully');
        this.getAllMedicines();
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.deleteErrorMessage =
          err?.error?.message || err?.error ||
          'Medicine cannot be deleted: it is referenced by requests. Resolve the requests first.';
      }
    });
  }

  showImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.showImagePopup = true;
  }

  closeImagePopup(): void {
    this.showImagePopup = false;
    this.selectedImage = '';
  }

  
}
