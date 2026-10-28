import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedService } from '../../services/feed.service';
import { Feed } from 'src/app/models/feed.model';

@Component({
  selector: 'app-viewfeed',
  templateUrl: './viewfeed.component.html',
  styleUrls: ['./viewfeed.component.css']
})
export class ViewfeedComponent implements OnInit {

  feeds: Feed[] = [];
  filteredFeeds: Feed[] = [];

  searchTerm: string = '';
  confirmDeleteFeedId: number | null = null;

  deleteBlockedError: string = '';

  showImageModal: boolean = false;
  modalImageSrc: string = '';

  constructor(private feedService: FeedService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadFeeds();
  }
  loadFeeds(): void {
    this.feedService.getAllFeed().subscribe({
      next: (data: any[]) => {

        this.feeds = (data || []).map(x => ({
          FeedId: x.feedId ?? x.FeedId,
          FeedName: x.feedName ?? x.FeedName,
          Type: x.type ?? x.Type,
          Description: x.description ?? x.Description,
          Quantity: x.quantity ?? x.Quantity,
          Unit: x.unit ?? x.Unit,
          PricePerUnit: x.pricePerUnit ?? x.PricePerUnit,
          Image: x.image ?? x.Image ?? '',   // optional
          UserId: x.userId ?? x.UserId
        })) as Feed[];

        this.loadRequestCounts();
        this.applySearch();
      },
      error: (err) => {
        console.error('Error fetching feeds', err);
      }
    });
  }


  // Search by FeedName + Type (case-insensitive)
  applySearch(): void {
    const term = (this.searchTerm || '').trim().toLowerCase();

    if (!term) {
      this.filteredFeeds = [...this.feeds];
      return;
    }

    this.filteredFeeds = this.feeds.filter(f =>
      (f.FeedName || '').toLowerCase().includes(term) ||
      (f.Type || '').toLowerCase().includes(term)
    );
  }

  // editFeed(feedId?: number): void {
  //   if (!feedId) return;
  //   this.router.navigate(['/suppliereditfeed', feedId]);
  // }
  // editFeed(feedId?: number): void {
  //   if (!feedId) return;
  
  //   // ✅ Correct navigation inside admin layout
  //   this.router.navigate(['/suppliereditfeed', feedId], {
  //     relativeTo: this.route
  //   });
  // }
  editFeed(feedId?: number): void {
    if (!feedId) return;
  
    this.router.navigate(['/admin/suppliereditfeed', feedId]);
  }


  // Fetch per-feed request counts so the UI can explain blocked deletes
  private loadRequestCounts(): void {
    this.feeds.forEach(f => {
      if (f.FeedId == null) return;
      this.feedService.getFeedRequestCount(f.FeedId).subscribe({
        next: (c) => { f.RequestCount = c; },
        error: () => { f.RequestCount = 0; }
      });
    });
  }

  /** Tooltip / disabled reason for the Delete button */
  deleteBlockedReason(feed: Feed): string {
    const c = feed.RequestCount ?? 0;
    return c > 0
      ? `Cannot delete: this feed is referenced by ${c} request(s). Resolve the requests first.`
      : 'Delete this feed';
  }


  // When Delete button clicked -> show confirm box for that row
  askDelete(feedId?: number): void {
    if (!feedId) return;
    this.deleteBlockedError = '';
    this.confirmDeleteFeedId = feedId;
  }

  cancelDelete(): void {
    this.confirmDeleteFeedId = null;
    this.deleteBlockedError = '';
  }

  confirmDelete(feedId: number): void {
    this.deleteBlockedError = '';

    this.feedService.deleteFeed(feedId.toString()).subscribe({
      next: () => {
        this.confirmDeleteFeedId = null;
        this.loadFeeds();
      },
      error: (err) => {
        console.error('Delete failed', err);

        // "Feed cannot be deleted, it is referenced in requests"
        const msg =
          err?.error?.message ||
          err?.error ||
          err?.message ||
          '';

        if (
          err?.status === 409 ||
          (typeof msg === 'string' && msg.toLowerCase().includes('referenced'))
        ) {
          this.deleteBlockedError = 'Feed cannot be deleted, it is referenced in requests';
        } else {
          this.deleteBlockedError = 'Unable to delete feed. Please try again.';
        }
      }
    });
  }

  openImage(feed: Feed): void {
    this.modalImageSrc = feed.Image || '';
    this.showImageModal = true;
  }

  closeImage(): void {
    this.showImageModal = false;
    this.modalImageSrc = '';
  }

  trackByFeedId(index: number, item: Feed): number {
    return item.FeedId || index;
  }
}
