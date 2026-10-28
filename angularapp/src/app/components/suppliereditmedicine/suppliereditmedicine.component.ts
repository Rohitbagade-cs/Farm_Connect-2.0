

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService } from '../../services/medicine.service';
import { Medicine } from '../../models/medicine.model';

@Component({
  selector: 'app-suppliereditmedicine',
  templateUrl: './suppliereditmedicine.component.html',
  styleUrls: ['./suppliereditmedicine.component.css']
})
export class SupplierEditMedicineComponent implements OnInit {

  medicineId!: number;
  medicine: Medicine = {
    MedicineId: 0,
    MedicineName: '',
    Brand: '',
    Category: '',
    Description: '',
    Quantity: 0,
    Unit: '',
    PricePerUnit: 0,
    Image: '',
    UserId: 0 as any
  };

  showValidationError = false;
  backendErrorMessage = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicineService: MedicineService
  ) {}

  ngOnInit(): void {
    //  Support both param names, medicineId OR id (to avoid routing mismatch errors)
    const param = this.route.snapshot.paramMap.get('medicineId') || this.route.snapshot.paramMap.get('id');

    this.medicineId = Number(param);

    if (!this.medicineId || isNaN(this.medicineId)) {
      this.backendErrorMessage = 'Invalid medicine id';
      return;
    }

    this.getMedicineById();
  }

  getMedicineById(): void {
    this.loading = true;
    this.backendErrorMessage = '';

    this.medicineService.getMedicineById(this.medicineId).subscribe({
      next: (data: any) => {
        //  Map camelCase/PascalCase response safely
        this.medicine = {
          MedicineId: data.medicineId ?? data.MedicineId ?? this.medicineId,
          MedicineName: data.medicineName ?? data.MedicineName ?? '',
          Brand: data.brand ?? data.Brand ?? '',
          Category: data.category ?? data.Category ?? '',
          Description: data.description ?? data.Description ?? '',
          Quantity: data.quantity ?? data.Quantity ?? 0,
          Unit: data.unit ?? data.Unit ?? '',
          PricePerUnit: data.pricePerUnit ?? data.PricePerUnit ?? 0,
          Image: data.image ?? data.Image ?? '',
          UserId: data.userId ?? data.UserId ?? (this.medicine.UserId as any)
        };

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching medicine', err);
        this.backendErrorMessage = 'Failed to load medicine details';
        this.loading = false;
      }
    });
  }

  updateMedicine(): void {
    this.backendErrorMessage = '';
    this.showValidationError = false;


    if (
      !this.medicine.MedicineName?.trim() ||
      !this.medicine.Brand?.trim() ||
      !this.medicine.Category?.trim() ||
      !this.medicine.Description?.trim() ||
      this.medicine.Quantity <= 0 ||
      !this.medicine.Unit?.trim() ||
      this.medicine.PricePerUnit <= 0
    ) {
      this.showValidationError = true;
      return;
    }

    //  Send clean payload (PascalCase) - works even if backend returns camelCase
    const payload: any = {
      MedicineId: this.medicineId,
      MedicineName: this.medicine.MedicineName.trim(),
      Brand: this.medicine.Brand.trim(),
      Category: this.medicine.Category.trim(),
      Description: this.medicine.Description.trim(),
      Quantity: this.medicine.Quantity,
      Unit: this.medicine.Unit.trim(),
      PricePerUnit: this.medicine.PricePerUnit,
      Image: this.medicine.Image ?? '',
      UserId: this.medicine.UserId ?? ''
    };

    this.loading = true;

    this.medicineService.updateMedicine(this.medicineId, payload).subscribe({
      next: () => {
        alert('Updated successfully');
        this.router.navigate(['/admin/medicine/view']);
      },
      error: (err: any) => {
        console.error('Update failed', err);
        this.loading = false;

        if (err.status === 409) {
          this.backendErrorMessage = 'Medicine with the same name and brand already exists';
        } else if (err.status === 400 && err.error?.errors) {
          const messages: string[] = [];
          Object.values(err.error.errors).forEach((arr: any) => {
            if (Array.isArray(arr)) messages.push(...arr);
          });
          this.backendErrorMessage = messages.length ? messages.join(' | ') : 'Validation error';
        } else {
          this.backendErrorMessage = err.error?.title || err.error?.message || 'Update failed';
        }
      }
    });
  }

  back(): void {
    this.router.navigate(['/admin/medicine/view']);
  }
}