import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FeedService } from '../../services/feed.service';
import { AiService } from '../../services/ai.service';
import { Feed } from 'src/app/models/feed.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createfeed',
  templateUrl: './createfeed.component.html',
  styleUrls: ['./createfeed.component.css']
})
export class CreatefeedComponent {

  units: string[] = ['Kg', 'Gram', 'Litre', 'Ml', 'Packet'];

  feed: Feed = {
    FeedName: '',
    Type: '',
    Description: '',
    Quantity: null as any,
    Unit: '',
    PricePerUnit: null as any,
    Image: '',
    UserId: null as any
  };

  submitted = false;

  allFieldsError = '';
  duplicateError = '';

  selectedFileName = '';


  showSuccessPopup = false;
  isSubmitting = false;

  constructor(private feedService: FeedService, private router: Router, private ai: AiService) {}

  generatingDescription = false;

  /** Fill the Description field with an AI-written product description. */
  generateDescription(): void {
    if (this.generatingDescription || !this.feed.FeedName?.trim()) return;
    this.generatingDescription = true;
    const details = [this.feed.Type,
      this.feed.Quantity ? `${this.feed.Quantity} ${this.feed.Unit || ''}`.trim() : '']
      .filter(x => x && x.trim()).join(', ');
    this.ai.generateDescription(this.feed.FeedName.trim(), 'Feed', details).subscribe({
      next: res => {
        this.feed.Description = res.description || '';
        this.generatingDescription = false;
      },
      error: () => { this.generatingDescription = false; }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event?.target?.files?.[0];

    if (!file) {
      this.selectedFileName = '';
      this.feed.Image = '';
      return;
    }

    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.feed.Image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  addFeed(form: NgForm): void {
    this.submitted = true;
    this.allFieldsError = '';
    this.duplicateError = '';


    const uidStr =
      localStorage.getItem('userId') ||
      localStorage.getItem('UserId') ||
      localStorage.getItem('id') ||
      localStorage.getItem('Id') ||
      '';

    if (uidStr) {
      const uid = Number(uidStr);
      if (!isNaN(uid) && uid > 0) this.feed.UserId = uid as any;
    }

    if (form.invalid) {
      this.allFieldsError = 'All fields are required';
      return;
    }

    if (this.feed.Quantity <= 0 || this.feed.PricePerUnit <= 0 || this.feed.UserId <= 0) {
      this.allFieldsError = 'All fields are required';
      return;
    }

    // Image optional
    if (!this.feed.Image) {
      this.feed.Image = '';
    }

    this.isSubmitting = true;

    this.feedService.addFeed(this.feed).subscribe({
      next: () => {
        this.isSubmitting = false;

        //  Show popup 
        this.showSuccessPopup = true;

        // reset form & state
        form.resetForm();
        this.submitted = false;
        this.selectedFileName = '';
        this.feed.Image = '';
      },
      error: (err) => {
        this.isSubmitting = false;

        const serverMsg =
          err?.error?.message ||
          err?.error ||
          err?.message ||
          '';

        if (
          err?.status === 409 ||
          (typeof serverMsg === 'string' && serverMsg.toLowerCase().includes('already exists'))
        ) {
          this.duplicateError = 'Feed with the same name and type already exists';
        } else {
          this.allFieldsError = 'Failed to add feed. Please try again.';
        }
      }
    });
  }

  // Close popup 
  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/admin/feed/view']);
  }

  showError(control: any): boolean {
    return !!control && (control.touched || this.submitted) && control.invalid;
  }
}