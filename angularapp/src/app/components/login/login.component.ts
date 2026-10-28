import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showSuccessPopup = false;
  showErrorPopup = false;
  errorMessage = 'Invalid email or password';

  private loginRole = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(form: NgForm) {
    if (!form.valid) return;

    this.authService.login(form.value).subscribe({
      next: (res: any) => {

        //  Clear old session
        localStorage.clear();

        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', String(res.userId));

        //  Decode role (.NET shortens ClaimTypes.Role to "role" in the JWT payload)
        const payload = JSON.parse(atob(res.token.split('.')[1]));
        const roleClaim =
          payload['role'] ??
          payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const role = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;
        localStorage.setItem('userRole', role ?? '');

        //  Extract name (ClaimTypes.Name is shortened to "unique_name")
        const name =
          payload['unique_name'] ||
          payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
          payload['email'] ||
          'User';

        localStorage.setItem(
          'userName',
          name.includes('@') ? name.split('@')[0] : name
        );

        //  keep role for navigation after popup
        this.loginRole = role;

        this.showSuccessPopup = true;
      },
      error: () => {
        this.showErrorPopup = true;
      }
    });
  }

  onSuccessOk(): void {
    this.showSuccessPopup = false;

    const role = (this.loginRole || '').toLowerCase();

    if (role === 'owner') {
      this.router.navigate(['/owner']);
    } else if (role === 'supplier' || role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  onErrorOk(): void {
    this.showErrorPopup = false;
  }
}
