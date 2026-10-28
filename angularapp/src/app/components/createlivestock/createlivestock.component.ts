
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Livestock } from 'src/app/models/livestock.model';
import { LivestockService } from 'src/app/services/livestock.service';
 
@Component({
  selector: 'app-createlivestock',
  templateUrl: './createlivestock.component.html',
  styleUrls: ['./createlivestock.component.css']
})
export class CreatelivestockComponent {
 
  livestock: Livestock = {
    livestockId: 0,
    name: '',
    species: '',
    age: 0,
    breed: '',
    location: '',
    userId: 0
  };

  showSuccessPopup = false;

 
  globalError: string = '';
  duplicateError: string = '';
  isSubmitting: boolean = false;

  constructor(
    private livestockService: LivestockService,
    private router: Router
  ) {}
 
  private getUserId(): number {
    const userIdStr = localStorage.getItem('userId');
    const userId = userIdStr ? Number(userIdStr) : 0;
    return Number.isFinite(userId) ? userId : 0;
  }
 
  submit(form: NgForm): void {
    this.globalError = '';
    this.duplicateError = '';
 
    // show "All fields are required" if invalid 
    if (!form.valid) {
      this.globalError = 'All fields are required';
 
      // mark all controls touched so individual messages show
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
      return;
    }
 
    // extra age validation safety
    if (!this.livestock.age || this.livestock.age < 1) {
      this.globalError = 'All fields are required';
      return;
    }
 
    this.isSubmitting = true;
 
    // attach logged-in user
    this.livestock.userId = this.getUserId();
 
    // trim strings
    this.livestock.name = this.livestock.name?.trim();
    this.livestock.species = this.livestock.species?.trim();
    this.livestock.breed = this.livestock.breed?.trim();
    this.livestock.healthCondition = this.livestock.healthCondition?.trim();
    this.livestock.location = this.livestock.location?.trim();
    this.livestock.vaccinationStatus = this.livestock.vaccinationStatus?.trim();

 
    this.livestockService.addLivestock(this.livestock).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showSuccessPopup = true;
 
        // reset form + model
        form.resetForm();
        this.livestock = {
         livestockId: 0,
          name: '',
          species: '',
          age: 0,
          breed: '',
          healthCondition: '',
          location: '',
          vaccinationStatus: '',
          userId: this.getUserId()
        };
      },
      error: (err) => {
        this.isSubmitting = false;
 
        const apiMsg: string =
          err?.error?.message ||
          err?.error ||
          err?.message ||
          '';

        if (
          err?.status === 409 ||
          apiMsg.toLowerCase().includes('already exists') ||
          apiMsg.toLowerCase().includes('same name') ||
          apiMsg.toLowerCase().includes('duplicate')
        ) {
          this.duplicateError = 'Livestock with the same name, breed, and species already exists';
          return;
        }
 
        this.globalError = apiMsg ? apiMsg : 'Something went wrong. Please try again.';
      }
    });
  }
  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }
  
}