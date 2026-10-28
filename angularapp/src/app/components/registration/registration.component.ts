import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register(form: NgForm) {

    if (form.valid) {

      const user = {
        Username: form.value.username,
        Email: form.value.email,
        Password: form.value.password,
        MobileNumber: form.value.mobileNumber,
        UserRole: form.value.userRole
      };

      console.log(user);

      this.authService.register(user).subscribe({
        next: () => {
          alert('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log("ERROR :", err);
          alert('Registration failed');
        }
      });
    }
  }
}