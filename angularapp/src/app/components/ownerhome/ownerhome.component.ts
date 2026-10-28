import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ownerhome',
  templateUrl: './ownerhome.component.html',
  styleUrls: ['./ownerhome.component.css']
})
export class OwnerhomeComponent implements OnInit {

  ownerName: string = 'Farmer';
  greeting: string = '';
  currentDate: string = '';

  // Use CHILD ROUTES (no leading slash)
  features = [
    { icon: '🐄', label: 'My Livestock', desc: 'View and manage all your animals', route: 'viewlivestock', color: 'fc-green' },
    { icon: '💊', label: 'Medicines', desc: 'Browse available medicines for your livestock', route: 'medicines', color: 'fc-blue' },
    { icon: '🌾', label: 'Feeds', desc: 'Explore feed options from suppliers', route: 'feeds', color: 'fc-amber' },
    { icon: '📋', label: 'My Requests', desc: 'Track all your medicine and feed requests', route: 'ownerviewrequest', color: 'fc-teal' },
    { icon: '💬', label: 'Feedbacks', desc: 'Share your experience with suppliers', route: 'useraddfeedback', color: 'fc-purple' },
    { icon: '➕', label: 'Add Livestock', desc: 'Register a new animal to your farm', route: 'createlivestock', color: 'fc-orange' },
  ];

  tips = [
    { icon: '💡', text: 'Regularly update your livestock health condition to get better medicine recommendations.' },
    { icon: '🔔', text: 'Check your requests page to see if a supplier has approved your order.' },
    { icon: '⭐', text: 'Leave feedback after receiving supplies to help other farmers.' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setGreeting();
    this.setCurrentDate();
    this.loadOwnerName();
  }

  private loadOwnerName(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email: string =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        payload['name'] ||
        payload['email'] ||
        '';

      this.ownerName = email.includes('@')
        ? email.split('@')[0].replace(/[._]/g, ' ')
        : email || 'Farmer';

      this.ownerName = this.ownerName
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    } catch {
      this.ownerName = 'Farmer';
    }
  }

  private setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  private setCurrentDate(): void {
    this.currentDate = new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  //  navigate within /owner children
  navigate(childPath: string): void {
    this.router.navigate(['..', childPath], { relativeTo: this.route });
  }
}