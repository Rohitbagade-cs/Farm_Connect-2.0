import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { FeedService } from 'src/app/services/feed.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ownerviewrequest',
  templateUrl: './ownerviewrequest.component.html',
  styleUrls: ['./ownerviewrequest.component.css']
})
export class OwnerviewrequestComponent implements OnInit {

  requests: any[] = [];
  filteredRequests: any[] = [];
  searchTerm = '';
  loading = false;

  showConfirm = false;
  requestToDelete: any = null;

  constructor(
    private requestService: RequestService,
    private feedService: FeedService,
    private medicineService: MedicineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;

    this.requestService.getAllRequests().subscribe({
      next: (data: any[]) => {
        this.requests = data.map(r => this.normalizeRequest(r));

        this.requests.forEach(req => {
          if (req.requestType === 'Feed' && req.feedId) {
            this.feedService.getFeedById(req.feedId).subscribe(feed => {
              req.feed = feed;
            });
          }

          if (req.requestType === 'Medicine' && req.medicineId) {
            this.medicineService.getMedicineById(req.medicineId).subscribe(med => {
              req.medicine = med;
            });
          }
        });

        this.filteredRequests = [...this.requests];
        this.loading = false;
      },
      error: () => {
        this.requests = [];
        this.filteredRequests = [];
        this.loading = false;
      }
    });
  }

  normalizeRequest(r: any) {
    return {
      requestId: r.requestId ?? r.RequestId,
      requestType: r.requestType ?? r.RequestType,
      feedId: r.feedId ?? r.FeedId,
      medicineId: r.medicineId ?? r.MedicineId,
      quantity: r.quantity ?? r.Quantity,
      status: r.status ?? r.Status,
      submissionDate: r.submissionDate ?? r.SubmissionDate,
      feed: null,
      medicine: null
    };
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredRequests = term
      ? this.requests.filter(r =>
          (r.requestType || '').toLowerCase().includes(term)
        )
      : [...this.requests];
  }

  openDeletePopup(req: any): void {
    this.requestToDelete = req;
    this.showConfirm = true;
  }

  closeDeletePopup(): void {
    this.showConfirm = false;
    this.requestToDelete = null;
  }

  confirmDelete(): void {
    const id = this.requestToDelete?.requestId;
    if (!id) return;

    this.requestService.deleteRequest(id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.requestId !== id);
        this.filteredRequests = this.filteredRequests.filter(r => r.requestId !== id);
        this.closeDeletePopup();
      },
      error: () => this.closeDeletePopup()
    });
  }
}
