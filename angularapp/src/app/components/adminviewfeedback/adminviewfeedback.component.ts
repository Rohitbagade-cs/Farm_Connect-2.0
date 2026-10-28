import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {

  feedbacks: Feedback[] = [];
  selectedFeedback: Feedback | null = null;

  showProfileModal = false;
  showLogoutModal = false;

  constructor(
    private feedbackService: FeedbackService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFeedbacks();''
  }

  loadFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe({
      next: (data: any) => {
        console.log('Raw feedback response:', data);
  
        const list = Array.isArray(data) ? data : [];
  
        this.feedbacks = list.map((x: any) => ({
          ...x,
  
          // UI fields 
          uiUserName:
            x?.user?.userName ??
            x?.user?.UserName ??
            x?.user?.username ??
            x?.user?.name ??
            (x?.userId ? `User #${x.userId}` : '-'),
  
          uiFeedback:
            x?.feedbackText ??
            x?.feedback ??
            x?.comments ??
            x?.Feedback ??
            '-',
  
          uiPostedDate:
            x?.date ??
            x?.postedDate ??
            x?.createdAt ??
            x?.RequestDate ??
            null,
  
          uiEmail:
            x?.user?.email ??
            x?.user?.Email ??
            '-',
  
          uiMobile:
            x?.user?.mobileNumber ??
            x?.user?.MobileNumber ??
            x?.user?.phone ??
            x?.user?.Phone ??
            '-'
        }));
  
        console.log(' Mapped feedbacks:', this.feedbacks);
      },
      error: (err) => {
        console.error(' Error loading feedbacks', err);
        this.feedbacks = [];
      }
    });
  }


  openProfile(feedback: Feedback): void {
    this.selectedFeedback = feedback;
    this.showProfileModal = true;
  }

  closeProfile(): void {
    this.selectedFeedback = null;
    this.showProfileModal = false;
  }

  openLogoutDialog(): void {
    this.showLogoutModal = true;
  }

  closeLogoutDialog(): void {
    this.showLogoutModal = false;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}