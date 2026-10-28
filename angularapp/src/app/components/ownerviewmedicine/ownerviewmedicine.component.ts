// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MedicineService } from 'src/app/services/medicine.service';
 
// @Component({
//   selector: 'app-ownerviewmedicine',
//   templateUrl: './ownerviewmedicine.component.html',
//   styleUrls: ['./ownerviewmedicine.component.css']
// })
// export class OwnerviewmedicineComponent implements OnInit {
 
//   medicines: any[] = [];
//   filteredMedicines: any[] = [];
 
//   searchText: string = '';
//   userId?: number;
 
//   constructor(
//     private medicineService: MedicineService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}
 
//   ngOnInit(): void {
//     this.loadMedicines();
//   }
 
//   loadMedicines(): void {
//     this.medicineService.getAllMedicine().subscribe({
//       next: (data: any) => {
//         this.medicines = Array.isArray(data) ? data : [];
//         this.applyFilter();
//       },
//       error: () => {
//         this.medicines = [];
//         this.filteredMedicines = [];
//       }
//     });
//   }
 
//   onSearchChange(): void {
//     this.applyFilter();
//   }
 
//   applyFilter(): void {
//     const term = (this.searchText || '').toLowerCase().trim();
 
//     if (!term) {
//       this.filteredMedicines = [...this.medicines];
//       return;
//     }
 
//     this.filteredMedicines = this.medicines.filter(m => {
//       const name = (m.medicineName ?? m.MedicineName ?? '').toString().toLowerCase();
//       const brand = (m.brand ?? m.Brand ?? '').toString().toLowerCase();
//       const category = (m.category ?? m.Category ?? '').toString().toLowerCase();
//       const desc = (m.description ?? m.Description ?? '').toString().toLowerCase();
//       return (
//         name.includes(term) ||
//         brand.includes(term) ||
//         category.includes(term) ||
//         desc.includes(term)
//       );
//     });
//   }

  
// goToRequestForm(medicine: any): void {
//   this.router.navigate(['../requestform'], {
//     relativeTo: this.route,                 // you're inside /owner/medicines
//     state: { selectedMedicine: medicine }  
//   });
// }

// }






import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService } from 'src/app/services/medicine.service';

@Component({
  selector: 'app-ownerviewmedicine',
  templateUrl: './ownerviewmedicine.component.html',
  styleUrls: ['./ownerviewmedicine.component.css']
})
export class OwnerviewmedicineComponent implements OnInit {

  medicines: any[] = [];
  filteredMedicines: any[] = [];

  searchText: string = '';
  userId?: number;

  // ✅ NEW: loading flag
  loading: boolean = false;

  constructor(
    private medicineService: MedicineService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.loading = true; // ✅ start loading

    this.medicineService.getAllMedicine().subscribe({
      next: (data: any) => {
        this.medicines = Array.isArray(data) ? data : [];
        this.applyFilter();
        this.loading = false; // ✅ stop loading
      },
      error: () => {
        this.medicines = [];
        this.filteredMedicines = [];
        this.loading = false; // ✅ stop loading even on error
      }
    });
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    const term = (this.searchText || '').toLowerCase().trim();

    if (!term) {
      this.filteredMedicines = [...this.medicines];
      return;
    }

    this.filteredMedicines = this.medicines.filter(m => {
      const name = (m.medicineName ?? m.MedicineName ?? '').toString().toLowerCase();
      const brand = (m.brand ?? m.Brand ?? '').toString().toLowerCase();
      const category = (m.category ?? m.Category ?? '').toString().toLowerCase();
      const desc = (m.description ?? m.Description ?? '').toString().toLowerCase();
      return name.startsWith(term) ;
    });
  }

  goToRequestForm(medicine: any): void {
    this.router.navigate(['../requestform'], {
      relativeTo: this.route,
      state: { selectedMedicine: medicine }
    });
  }
}

