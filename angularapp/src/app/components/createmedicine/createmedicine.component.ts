import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MedicineService } from '../../services/medicine.service';
import { AiService } from '../../services/ai.service';
import { Medicine } from 'src/app/models/medicine.model';

// Backend expects UserId as string
type MedicinePayload = Omit<Medicine, 'UserId'> & { UserId: string };

@Component({
  selector: 'app-createmedicine',
  templateUrl: './createmedicine.component.html',
  styleUrls: ['./createmedicine.component.css']
})
export class CreatemedicineComponent {

  medicine: MedicinePayload = {
    MedicineId: 0,
    MedicineName: '',
    Brand: '',
    Category: '',
    Description: '',
    Quantity: 0,
    Unit: '',
    PricePerUnit: 0,
    Image: '',
    UserId: ''
  };

  showSuccessPopup = false;
  showErrorMessage = false;
  backendErrorMessage = '';

  isSubmitting = false;

  constructor(
    private medicineService: MedicineService,
    private router: Router,
    private ai: AiService
  ) {}

  generatingDescription = false;

  /** Fill the Description field with an AI-written product description. */
  generateDescription(): void {
    if (this.generatingDescription || !this.medicine.MedicineName?.trim()) return;
    this.generatingDescription = true;
    const details = [this.medicine.Brand, this.medicine.Category]
      .filter(x => x && x.trim()).join(', ');
    this.ai.generateDescription(this.medicine.MedicineName.trim(), 'Medicine', details).subscribe({
      next: res => {
        this.medicine.Description = res.description || '';
        this.generatingDescription = false;
      },
      error: () => { this.generatingDescription = false; }
    });
  }

  addMedicine(): void {
    this.backendErrorMessage = '';
    this.showErrorMessage = false;

    const userId =
      localStorage.getItem('userId') ||
      localStorage.getItem('UserId') ||
      localStorage.getItem('id') ||
      localStorage.getItem('Id') ||
      '';

    if (!userId || userId === 'undefined' || userId === 'null' || userId.trim() === '') {
      this.backendErrorMessage = 'User not logged in / UserId not found. Please login again.';
      return;
    }

    this.medicine.UserId = userId;

    if (
      !this.medicine.MedicineName?.trim() ||
      !this.medicine.Brand?.trim() ||
      !this.medicine.Category?.trim() ||
      !this.medicine.Description?.trim() ||
      this.medicine.Quantity <= 0 ||
      !this.medicine.Unit || this.medicine.Unit.trim() === '' ||
      this.medicine.PricePerUnit <= 0
    ) {
      this.showErrorMessage = true;
      return;
    }

    const payload: MedicinePayload = {
      MedicineId: 0,
      MedicineName: this.medicine.MedicineName.trim(),
      Brand: this.medicine.Brand.trim(),
      Category: this.medicine.Category.trim(),
      Description: this.medicine.Description.trim(),
      Quantity: Number(this.medicine.Quantity),
      Unit: this.medicine.Unit.trim(),
      PricePerUnit: Number(this.medicine.PricePerUnit),
      Image: this.medicine.Image ?? '',
      UserId: this.medicine.UserId
    };

    this.isSubmitting = true;

    this.medicineService.addMedicine(payload as any).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.showSuccessPopup = true;

        this.medicine = {
          MedicineId: 0,
          MedicineName: '',
          Brand: '',
          Category: '',
          Description: '',
          Quantity: 0,
          Unit: '',
          PricePerUnit: 0,
          Image: '',
          UserId: userId
        };

        this.showErrorMessage = false;
        this.backendErrorMessage = '';
      },

      error: (err) => {
        this.isSubmitting = false;

        console.error('❌ Error adding medicine:', err);
        console.error('Status:', err.status);
        console.error('Error body:', err.error);

        // ASP.NET validation
        if (err.status === 400 && err.error?.errors) {
          const messages: string[] = [];
          Object.values(err.error.errors).forEach((arr: any) => {
            if (Array.isArray(arr)) messages.push(...arr.map((x: any) => String(x)));
          });
          this.backendErrorMessage = messages.join(' | ');
          return;
        }

        if (err.status === 409) {
          this.backendErrorMessage = 'Medicine with the same name and brand already exists';
        } else if (err.status === 401 || err.status === 403) {
          this.backendErrorMessage = 'Unauthorized. Please login again.';
        } else if (err.status === 415) {
          this.backendErrorMessage = 'Unsupported Media Type: Backend expects JSON, not FormData.';
        } else if (err.status === 500) {
          this.backendErrorMessage = 'Server error while saving. Please check backend logs/DB constraints.';
        } else {
          this.backendErrorMessage = err.error?.title || err.error?.message || 'Error adding medicine';
        }
      }
    });
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/admin/medicine/view']);
  }
}

