
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';

@Component({
  selector: 'app-userviewfeedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {

  feedbackList: any[] = [];
  loading = false;
  errorMsg = '';

  showDeleteModal = false;
  deleteTarget: any = null;

  showLogoutModal = false;

  displayName = 'DemoOwner / Owner';

  constructor(
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyFeedbacks();
  }

  private getUserId(): number {
    const a = localStorage.getItem('userId');
    const b = localStorage.getItem('UserId');
    const c = localStorage.getItem('id');

    const raw = a || b || c;
    const id = raw ? Number(raw) : 0;
    return isNaN(id) ? 0 : id;
  }


  loadMyFeedbacks(): void {
    this.loading = true;
    this.errorMsg = '';

    const userId = this.getUserId();

    if (userId === 0) {
      this.loading = false;
      this.feedbackList = [];
      this.errorMsg = 'UserId not found. Please login again.';
      return;
    }

    this.feedbackService.getFeedbacksByUserId(userId).subscribe({
      next: (res: any) => {
        this.feedbackList = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.feedbackList = [];
        this.errorMsg = 'No records found.';
      }
    });
  }

  getFeedbackText(item: any): string {
    return (
      item?.feedback ||
      item?.Feedback ||
      item?.feedbackText ||
      item?.FeedbackText ||
      item?.message ||
      item?.Message ||
      item?.comment ||
      item?.description ||
      ''
    );
  }

  getFeedbackId(item: any): number {
    return (
      item?.feedbackId ||
      item?.FeedbackId ||
      item?.id ||
      item?.Id ||
      0
    );
  }

  openDeleteModal(item: any): void {
    this.deleteTarget = item;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteTarget = null;
  }

  confirmDelete(): void {
    if (!this.deleteTarget) return;

    const id = this.getFeedbackId(this.deleteTarget);
    if (!id) {
      this.closeDeleteModal();
      return;
    }

    this.feedbackService.deleteFeedback(id).subscribe({
      next: () => {
        this.feedbackList = this.feedbackList.filter(x => this.getFeedbackId(x) !== id);
        this.closeDeleteModal();
        this.loadMyFeedbacks();
      },
      error: () => {
        this.closeDeleteModal();
      }
    });
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    localStorage.clear();
    this.closeLogoutModal();
    this.router.navigate(['/login']);
  }

  goToHome(): void { this.router.navigate(['/ownerhome']); }
  goToLivestock(): void { this.router.navigate(['/ownerviewlivestock']); }
  goToMedicines(): void { this.router.navigate(['/viewmedicine']); }
  goToFeeds(): void { this.router.navigate(['/viewfeeds']); }
  goToMyRequests(): void { this.router.navigate(['/ownerviewrequest']); }

  goToPostFeedback(): void { this.router.navigate(['/useraddfeedback']); }
  goToMyFeedbacks(): void { this.router.navigate(['/userviewfeedback']); } 
}

