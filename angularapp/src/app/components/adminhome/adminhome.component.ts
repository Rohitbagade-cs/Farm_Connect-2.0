import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent implements OnInit {
  supplierName: string = 'Supplier';
  greeting: string = '';
  currentDate: string = '';
  stats = [
    { icon: '💊', label: 'Medicines', desc: 'Manage your medicine inventory', route: '/admin/medicine/view', color: 'card-blue' },
    { icon: '🌾', label: 'Feeds', desc: 'Manage your feed listings', route: '/admin/feed/view', color: 'card-amber' },
    { icon: '📋', label: 'Requests', desc: 'View and approve farmer requests', route: '/admin/requests', color: 'card-green' },
    { icon: '💬', label: 'Feedbacks', desc: 'Read what farmers say', route: '/admin/feedbacks', color: 'card-purple' },
  ];
  quickLinks = [
    { icon: '➕', label: 'Add Medicine', route: '/admin/medicine/add' },
    { icon: '➕', label: 'Create Feed', route: '/admin/feed' },
    { icon: '📦', label: 'View Inventory', route: '/admin/medicine/view' },
    { icon: '✅', label: 'Pending Requests', route: '/admin/requests' },
  ];
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.setGreeting();
    this.setCurrentDate();
    this.loadSupplierName();
  }
  private loadSupplierName(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email: string =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        payload['name'] ||
        payload['email'] ||
        '';
      // Use part before @ as display name
      this.supplierName = email.includes('@')
        ? email.split('@')[0].replace(/[._]/g, ' ')
        : email || 'Supplier';
      // Capitalize each word
      this.supplierName = this.supplierName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    } catch {
      this.supplierName = 'Supplier';
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
  navigate(route: string): void {
    this.router.navigate([route]);
  }
}