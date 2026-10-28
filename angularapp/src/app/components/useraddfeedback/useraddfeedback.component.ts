
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent {

  displayName = 'DemoOwner / Owner';

  feedbackText: string = '';
  isSubmitted = false;
  loading = false;

  successMsg = '';
  errorMsg = '';

  showLogoutModal = false;

  constructor(
    private feedbackService: FeedbackService,
    private router: Router
  ) { }

  private getUserId(): number {
    const fromUserId = localStorage.getItem('userId');
    const fromUserIdCaps = localStorage.getItem('UserId');
    const fromId = localStorage.getItem('id');

    const raw = fromUserId || fromUserIdCaps || fromId;
    const id = raw ? Number(raw) : 0;

    return isNaN(id) ? 0 : id;
  }

  submitFeedback(): void {
    this.isSubmitted = true;
    this.successMsg = '';
    this.errorMsg = '';

    if (!this.feedbackText || this.feedbackText.trim().length === 0) {
      return;
    }

    const userId = this.getUserId();
    if (userId === 0) {
      this.errorMsg = 'UserId not found. Please login again.';
      return;
    }

    const payload = {
      UserId: userId,
      FeedbackText: this.feedbackText.trim(),
      Date: new Date()
    };

    this.loading = true;

    this.feedbackService.addFeedback(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Feedback posted successfully!';
        this.feedbackText = '';
        this.isSubmitted = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Failed to post feedback. Try again.';
        console.error(err);
      }
    });
  }

  goToHome(): void { this.router.navigate(['/ownerhome']); }
  goToLivestock(): void { this.router.navigate(['/ownerviewlivestock']); }
  goToMedicines(): void { this.router.navigate(['/viewmedicine']); }
  goToFeeds(): void { this.router.navigate(['/viewfeeds']); }
  goToMyRequests(): void { this.router.navigate(['/ownerviewrequest']); }

  goToPostFeedback(): void { this.router.navigate(['/useraddfeedback']); } 
  goToMyFeedbacks(): void { this.router.navigate(['/ownerviewfeedback']); }

  openLogoutModal(): void { this.showLogoutModal = true; }
  closeLogoutModal(): void { this.showLogoutModal = false; }

  confirmLogout(): void {
    localStorage.clear();
    this.closeLogoutModal();
    this.router.navigate(['/login']);
  }
}
