import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LivestockService } from 'src/app/services/livestock.service'; // adjust if needed
 
@Component({
  selector: 'app-ownereditlivestock',
  templateUrl: './ownereditlivestock.component.html',
  styleUrls: ['./ownereditlivestock.component.css']
})
export class OwnereditlivestockComponent implements OnInit {
 
  displayName = 'DemoOwner / Owner';
 
  livestockId = 0;
  loading = false;
 
  livestock: any = {
    livestockId:0,
    name: '',
    species: '',
    age: null,
    breed: '',
    healthCondition: '',
    location: '',
    vaccinationStatus: '',
    userId : 0
  };
 
  duplicateErrorMsg = '';
  generalErrorMsg = '';
 
  showSuccessPopup = false;
 
  showLogoutModal = false;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livestockService: LivestockService
  ) {}
 
  ngOnInit(): void {
    this.livestockId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    if (this.livestockId) {
      this.loadLivestockById(this.livestockId);
    }
  }
 
  loadLivestockById(id: number): void {
    this.loading = true;
    this.generalErrorMsg = '';
 
    this.livestockService.getLivestockByID(id).subscribe({
      next: (res: any) => {
        this.livestock = {
          name: res?.name ?? res?.Name ?? '',
          species: res?.species ?? res?.Species ?? '',
          age: res?.age ?? res?.Age ?? null,
          breed: res?.breed ?? res?.Breed ?? '',
          healthCondition: res?.healthCondition ?? res?.HealthCondition ?? '',
          location: res?.location ?? res?.Location ?? '',
          vaccinationStatus: res?.vaccinationStatus ?? res?.VaccinationStatus ?? ''
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.generalErrorMsg = 'Failed to load livestock details.';
      }
    });
  }
 
  back(): void {
      this.router.navigate(['/owner/viewlivestock']);
  }
 
  update(form: any): void {
    this.duplicateErrorMsg = '';
    this.generalErrorMsg = '';
  
    if (!form.valid) {
      return;
    }
  
    this.loading = true;
  console.log(this.livestock);
  this.livestock.userId = localStorage.getItem('userId');
    this.livestockService.updateLivestock(this.livestockId, this.livestock).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccessPopup = true;
      },
      error: (err) => {
        this.loading = false;
        this.generalErrorMsg = 'Failed to update livestock.';
        console.error(err);
      }
    });
  }
 
  okSuccess(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/owner/viewlivestock']);
  }
 

  goToHome(): void { this.router.navigate(['/ownerhome']); }
  goToMedicines(): void { this.router.navigate(['/viewmedicine']); }
  goToFeeds(): void { this.router.navigate(['/viewfeeds']); }
  goToMyRequests(): void { this.router.navigate(['/ownerviewrequest']); }
 
  goToAddLivestock(): void { this.router.navigate(['/addlivestock']); }
  goToMyLivestock(): void { this.router.navigate(['/viewlivestock']); }
 
  goToPostFeedback(): void { this.router.navigate(['/useraddfeedback']); }
  goToMyFeedbacks(): void { this.router.navigate(['/userviewfeedback']); }
 
  // logout
  openLogoutModal(): void { this.showLogoutModal = true; }
  closeLogoutModal(): void { this.showLogoutModal = false; }
  confirmLogout(): void {
    localStorage.clear();
    this.closeLogoutModal();
    this.router.navigate(['/login']);
  }
}