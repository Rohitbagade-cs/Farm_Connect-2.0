// import { Component } from '@angular/core';
// import { AppRoutingModule } from "./app-routing.module";

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html'
// })
// export class AppComponent {
//   title = 'angularapp';
// }










import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'angularapp';

  // ✅ Controls whether Register/Login navbar is visible
  showPublicNavbar = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;

        // ✅ Show default navbar only on public pages
        const publicRoutes = ['/', '/home', '/login', '/register'];

        // ✅ Hide it on all dashboard pages after login
        // (Owner + Supplier + Admin + feature pages)
        const hideOn =
          url.startsWith('/owner') ||
          url.startsWith('/supplier') ||
          url.startsWith('/admin') ||
          url.startsWith('/createlivestock') ||
          url.startsWith('/viewlivestock') ||
          url.startsWith('/viewlivestocks') ||
          url.startsWith('/ownereditlivestock') ||
          url.startsWith('/viewmedicine') ||
          url.startsWith('/viewfeeds') ||
          url.startsWith('/medicines') ||
          url.startsWith('/feeds') ||
          url.startsWith('/ownerviewrequest') ||
          url.startsWith('/useraddfeedback') ||
          url.startsWith('/ownerviewfeedback') ||
          url.startsWith('/requestform');

        this.showPublicNavbar = publicRoutes.includes(url) && !hideOn;
      });
  }
}
