import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Feed } from 'src/app/models/feed.model';
import { FeedService } from 'src/app/services/feed.service';
import { LivestockService } from 'src/app/services/livestock.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-requestform',
  templateUrl: './requestform.component.html',
  styleUrls: ['./requestform.component.css']
})
export class RequestformComponent implements OnInit {

  requestType: string = '';
  medicineName: string = '';
  medicineQuantity: number = 0;

  livestocks: any[] = [];
  selectedLivestockId: any = '';

  quantity: number = 1;

  selectedMedicine: any = null;

  userId!: number;
  feedId: number = 0;

  feed: Feed = {
    FeedName: '',
    Type: '',
    Description: '',
    Quantity: 0,
    Unit: '',
    PricePerUnit: 0,
    Image: '',
    UserId: 0
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private feedService: FeedService,
    private livestockService: LivestockService,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? Number(storedUserId) : 0;

    this.feedId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.selectedMedicine = history.state?.selectedMedicine ?? null;

    if (this.feedId > 0) {
      this.requestType = 'Feed';        
      this.loadFeedRequest();
    } else if (this.selectedMedicine) {
      this.requestType = 'Medicine';
      console.log(this.selectedMedicine);    
      this.loadMedicineRequest();
    }

    this.loadLivestocks();
  }
  loadFeedRequest(): void {
    console.log(this.feedId);
    this.feedService.getFeedById(this.feedId.toString()).subscribe(data => {
      console.log(data);
      this.feed = data;
      this.requestType = 'Feed';
      this.medicineName = data.FeedName;
    });
  }

  loadMedicineRequest(): void {
    this.requestType = 'Medicine';
    this.medicineName =
      this.selectedMedicine.medicineName ||
      this.selectedMedicine.MedicineName ||
      '';

  }

  loadLivestocks(): void {
    if (!this.userId) {
      this.livestocks = [];
      return;
    }

    this.livestockService.getLivestockByUserID(this.userId).subscribe({
      next: data => {
        this.livestocks = Array.isArray(data) ? data : [];
      },
      error: () => {
        this.livestocks = [];
      }
    });
  }

  submitRequest(): void {
    if (!this.selectedLivestockId || !this.quantity || this.quantity <= 0) {
      alert('Invalid input');
      return;
    }

    const requestPayload = {
      RequestType: this.requestType,
      MedicineName: this.medicineName,
      FeedId: this.requestType === 'Feed' ? this.feedId : null,
      MedicineId: this.requestType == 'Medicine' ? this.selectedMedicine.medicineId:null,
      LivestockId: Number(this.selectedLivestockId),
      Quantity: this.quantity,
      UserId: this.userId,
      Status: 'Pending'
    };

    this.requestService.addRequest(requestPayload as any).subscribe({
      next: () => {
        alert('Request submitted successfully');
        this.router.navigate(['/viewmedicine']);
      },
      error: () => {
        alert('Failed to submit request');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/viewmedicine']);
  }
}