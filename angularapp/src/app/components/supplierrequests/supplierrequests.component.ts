import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { FeedService } from 'src/app/services/feed.service';
import { LivestockService } from 'src/app/services/livestock.service';

@Component({
  selector: 'app-supplierrequests',
  templateUrl: './supplierrequests.component.html',
  styleUrls: ['./supplierrequests.component.css']
})
export class SupplierrequestsComponent implements OnInit {

  requests: any[] = [];
  filteredRequests: any[] = [];

  searchTerm: string = '';
  errorMessage: string = '';

  // Livestock modal
  showLivestockModal: boolean = false;
  selectedLivestock: any = null;

  // caches to avoid repeated calls
  private medicineNameCache: Record<number, string> = {};
  private feedNameCache: Record<number, string> = {};
  private livestockCache: Record<number, any> = {};

  constructor(
    private requestService: RequestService,
    private medicineService: MedicineService,
    private feedService: FeedService,
    private livestockService: LivestockService
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.errorMessage = '';

    const idStr = localStorage.getItem('userId');
    const supplierId = idStr ? Number(idStr) : 0;

    console.log(' Supplier userId:', supplierId);

    if (!supplierId || isNaN(supplierId)) {
      this.errorMessage = 'UserId missing. Please login again.';
      this.requests = [];
      this.filteredRequests = [];
      return;
    }

    this.requestService.getRequestByMedicineOrFeedUserId(supplierId).subscribe({
      next: (data: any[]) => {
        const list = Array.isArray(data) ? data : [];

        //  Map API -> 
        this.requests = list.map(x => ({
          RequestId: x.requestId ?? x.RequestId,
          RequestType: x.requestType ?? x.RequestType,

          MedicineId: x.medicineId ?? x.MedicineId ?? 0,
          FeedId: x.feedId ?? x.FeedId ?? 0,

          UserId: x.userId ?? x.UserId,
          LivestockId: x.livestockId ?? x.LivestockId ?? 0,

          Quantity: x.quantity ?? x.Quantity ?? 0,
          Status: x.status ?? x.Status ?? 'Pending',

          SubmissionDate: x.requestDate ?? x.RequestDate ?? null,

          // names (resolved after fetching)
          MedicineName: '-',
          FeedName: '-'
        }));

        //  Resolve names (Medicine/Feed) using ID
        this.requests.forEach(r => {
          if (r.MedicineId) this.resolveMedicineName(r);
          if (r.FeedId) this.resolveFeedName(r);
        });

        this.applySearch();
      },

      error: (err) => {
        console.error(' Error fetching supplier requests:', err);

        // treat 404 as empty list
        if (err?.status === 404) {
          this.requests = [];
          this.filteredRequests = [];
          this.errorMessage = '';
          return;
        }

        this.requests = [];
        this.filteredRequests = [];
        this.errorMessage = 'Failed to load requests.';
      }
    });
  }

  applySearch(): void {
    const term = (this.searchTerm || '').trim().toLowerCase();

    if (!term) {
      this.filteredRequests = [...this.requests];
      return;
    }

    this.filteredRequests = this.requests.filter(r =>
      String(r.RequestType || '').toLowerCase().includes(term) ||
      String(r.MedicineName || '').toLowerCase().includes(term) ||
      String(r.FeedName || '').toLowerCase().includes(term) ||
      String(r.Status || '').toLowerCase().includes(term)
    );
  }

  private resolveMedicineName(r: any): void {
    const id = Number(r.MedicineId);
    if (!id) return;

    if (this.medicineNameCache[id]) {
      r.MedicineName = this.medicineNameCache[id];
      return;
    }

    r.MedicineName = `Medicine #${id}`;

    this.medicineService.getMedicineById(id).subscribe({
      next: (m: any) => {
        const name = m?.medicineName ?? m?.MedicineName ?? `Medicine #${id}`;
        this.medicineNameCache[id] = name;
        r.MedicineName = name;
        this.applySearch();
      },
      error: () => {
        r.MedicineName = `Medicine #${id}`;
      }
    });
  }


  private resolveFeedName(r: any): void {
    const id = Number(r.FeedId);
    if (!id) return;

    if (this.feedNameCache[id]) {
      r.FeedName = this.feedNameCache[id];
      return;
    }

    r.FeedName = `Feed #${id}`;

    // feedService.getFeedById expects string in your service
    this.feedService.getFeedById(String(id)).subscribe({
      next: (f: any) => {
        const name = f?.feedName ?? f?.FeedName ?? `Feed #${id}`;
        this.feedNameCache[id] = name;
        r.FeedName = name;
        this.applySearch();
      },
      error: () => {
        r.FeedName = `Feed #${id}`;
      }
    });
  }

 
  openLivestock(req: any): void {
    const lid = Number(req?.LivestockId);
    if (!lid) {
      this.selectedLivestock = null;
      this.showLivestockModal = true;
      return;
    }


    if (this.livestockCache[lid]) {
      this.selectedLivestock = this.livestockCache[lid];
      this.showLivestockModal = true;
      return;
    }

    this.livestockService.getLivestockByID(lid).subscribe({
      next: (l: any) => {
        const mapped = {
          name: l?.name ?? l?.Name ?? `Livestock #${lid}`,
          type: l?.type ?? l?.Type ?? '-',
          species: l?.species ?? l?.Species ?? '-',
          breed: l?.breed ?? l?.Breed ?? '-',
          age: l?.age ?? l?.Age ?? '-',
          healthCondition: l?.healthCondition ?? l?.HealthCondition ?? '-',
          location: l?.location ?? l?.Location ?? '-',
          vaccinationStatus: l?.vaccinationStatus ?? l?.VaccinationStatus ?? '-'
        };

        this.livestockCache[lid] = mapped;
        this.selectedLivestock = mapped;
        this.showLivestockModal = true;
      },
      error: (err) => {
        console.error(' Livestock fetch failed:', err);
        this.selectedLivestock = {
          name: `Livestock #${lid}`,
          type: '-',
          species: '-',
          breed: '-',
          age: '-',
          healthCondition: '-',
          location: '-',
          vaccinationStatus: '-'
        };
        this.showLivestockModal = true;
      }
    });
  }

  closeLivestock(): void {
    this.showLivestockModal = false;
    this.selectedLivestock = null;
  }

 
  approve(req: any): void {
    this.updateStatus(req, 'Approved');
  }

  reject(req: any): void {
    this.updateStatus(req, 'Rejected');
  }

  private updateStatus(req: any, status: string): void {
    const requestId = Number(req?.RequestId);
    if (!requestId) return;

    //  IMPORTANT: use null (not 0) for unused id to avoid FK/validation issues
    const medicineId = req.MedicineId ? Number(req.MedicineId) : null;
    const feedId = req.FeedId ? Number(req.FeedId) : null;

    //  force numeric for ids
    const userId = req.UserId ? Number(req.UserId) : 0;
    const livestockId = req.LivestockId ? Number(req.LivestockId) : 0;
    const quantity = req.Quantity ? Number(req.Quantity) : 0;

    //  keep original date if exists
    const requestDate = req.SubmissionDate || req.RequestDate || new Date().toISOString();

    //  Full payload expected by backend UpdateRequest (PUT)
    const payload = {
      RequestId: requestId,
      RequestType: req.RequestType,
      MedicineId: medicineId,
      FeedId: feedId,
      UserId: userId,
      LivestockId: livestockId,
      Quantity: quantity,
      Status: status,
      RequestDate: requestDate
    };

    console.log(' PUT payload:', payload);

    this.requestService.updateRequestStatus(requestId, payload).subscribe({
      next: () => {
        // update UI instantly
        req.Status = status;
        this.applySearch();

        //  optional: refresh from backend so status stays consistent
        this.loadRequests();
      },
      error: (err) => {
        console.error(' Status update failed:', err);
        console.error(' Status:', err.status);
        console.error(' Error body:', err.error);
        alert('Failed to update request status');
      }
    });
  }

  formatDate(dateStr: any): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toISOString().slice(0, 10);
  }

  trackByRequestId(index: number, item: any): number {
    return item?.RequestId || index;
  }
}