
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LivestockService } from 'src/app/services/livestock.service'; // adjust path if needed
 
@Component({
  selector: 'app-viewlivestock',
  templateUrl: './viewlivestock.component.html',
  styleUrls: ['./viewlivestock.component.css']
})
export class ViewlivestockComponent implements OnInit {
 
  displayName = 'DemoOwner / Owner';
 
  livestockList: any[] = [];
  filteredList: any[] = [];
 
  searchTerm: string = '';
 
  loading = false;
  errorMsg = '';
 
  // delete modal
  showDeleteModal = false;
  deleteTarget: any = null;
  deleteErrorMsg = '';
 
  // logout modal
  showLogoutModal = false;
 
  constructor(
    private livestockService: LivestockService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
 
  ngOnInit(): void {
    this.loadMyLivestock();
  }
 
  private getUserId(): number {
    const a = localStorage.getItem('userId');
    const b = localStorage.getItem('UserId');
    const c = localStorage.getItem('id');
    const raw = a || b || c;
 
    const id = raw ? Number(raw) : 0;
    return isNaN(id) ? 0 : id;
  }
 
  loadMyLivestock(): void {
    this.loading = true;
    this.errorMsg = '';
 
    const userId = this.getUserId();
    if (userId === 0) {
      this.loading = false;
      this.livestockList = [];
      this.filteredList = [];
      this.errorMsg = 'UserId not found. Please login again.';
      return;
    }
 
    this.livestockService.getLivestockByUserID(userId).subscribe({
      next: (res: any) => {
        this.livestockList = Array.isArray(res) ? res : [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.livestockList = [];
        this.filteredList = [];
        this.errorMsg = 'No records found.';
      }
    });
  }
 
  applyFilter(): void {
    const t = (this.searchTerm || '').trim().toLowerCase();
 
    if (!t) {
      this.filteredList = [...this.livestockList];
      return;
    }
 
    this.filteredList = this.livestockList.filter(l => {
      const name = (l?.name || l?.Name || '').toLowerCase();
      const breed = (l?.breed || l?.Breed || '').toLowerCase();
      const species = (l?.species || l?.Species || '').toLowerCase();
      return name.includes(t) || breed.includes(t) || species.includes(t);
    });
  }
 
  getId(item: any): number {
    return item?.livestockId || item?.LivestockId || item?.id || item?.Id || 0;
  }
  getName(item: any): string { return item?.name || item?.Name || ''; }
  getSpecies(item: any): string { return item?.species || item?.Species || ''; }
  getAge(item: any): any { return item?.age || item?.Age || ''; }
  getBreed(item: any): string { return item?.breed || item?.Breed || ''; }
  getHealth(item: any): string { return item?.healthCondition || item?.HealthCondition || ''; }
  getLocation(item: any): string { return item?.location || item?.Location || ''; }
  getVaccStatus(item: any): string { return item?.vaccinationStatus || item?.VaccinationStatus || ''; }
 
  editLivestock(item: any): void {
    const id = this.getId(item);
    console.log('Edit clicked -> livestock id:', id, item);
  
    if (!id) {
      alert('Invalid Livestock Id (0). Check API response key name.');
      return;
    }
  
    this.router.navigate(['../ownereditlivestock', id], { relativeTo: this.route });
  }
  
 
  openDeleteModal(item: any): void {
    this.deleteTarget = item;
    this.deleteErrorMsg = '';
    this.showDeleteModal = true;
  }
 
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteTarget = null;
    this.deleteErrorMsg = '';
  }
 
  confirmDelete(): void {
    if (!this.deleteTarget) return;
 
    const id = this.getId(this.deleteTarget);
    if (!id) {
      this.closeDeleteModal();
      return;
    }
 
    this.livestockService.deleteLivestock(id).subscribe({
      next: () => {
        this.livestockList = this.livestockList.filter(x => this.getId(x) !== id);
        this.applyFilter();
        this.closeDeleteModal();
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          err?.error ||
          err?.message ||
          '';
 
       
        if ((msg + '').toLowerCase().includes('referenced')) {
          this.deleteErrorMsg = 'Livestock cannot be deleted, it is referenced in requests';
        } else {
          this.deleteErrorMsg = 'Failed to delete livestock.';
        }
      }
    });
  }

  goToAddLivestock(): void { this.router.navigate(['/createlivestock']); }
  goToMyLivestock(): void { this.router.navigate(['/viewlivestocks']); }
 
  goToHome(): void { this.router.navigate(['/ownerhome']); }
  goToMedicines(): void { this.router.navigate(['/viewmedicine']); }
  goToFeeds(): void { this.router.navigate(['/viewfeeds']); }
  goToMyRequests(): void { this.router.navigate(['/ownerviewrequest']); }
  goToPostFeedback(): void { this.router.navigate(['/useraddfeedback']); }
  goToMyFeedbacks(): void { this.router.navigate(['/userviewfeedback']); }
 
  openLogoutModal(): void { this.showLogoutModal = true; }
  closeLogoutModal(): void { this.showLogoutModal = false; }
 
  confirmLogout(): void {
    localStorage.clear();
    this.closeLogoutModal();
    this.router.navigate(['/login']);
  }
}
 