import { Component } from '@angular/core';

@Component({
  selector: 'app-bolifab',
  templateUrl: './bolifab.component.html',
  styleUrls: ['./bolifab.component.css']
})
export class BolifabComponent {
  open = false;

  toggle(): void {
    this.open = !this.open;
  }
}
