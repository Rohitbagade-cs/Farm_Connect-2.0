
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FeedService } from '../../services/feed.service';
import { Feed } from 'src/app/models/feed.model';

@Component({
  selector: 'app-suppliereditfeed',
  templateUrl: './suppliereditfeed.component.html',
  styleUrls: ['./suppliereditfeed.component.css']
})
export class SuppliereditfeedComponent implements OnInit {

  feedId!: string;

  units: string[] = ['Kg', 'Gram', 'Litre', 'Ml', 'Packet'];

  feed: Feed = {
    FeedId: 0 as any,
    FeedName: '',
    Type: '',
    Description: '',
    Quantity: null as any,
    Unit: '',
    PricePerUnit: null as any,
    Image: '',     //  optional
    UserId: 0 as any
  };

  submitted = false;

  duplicateError = '';
  allFieldsError = '';

  selectedFileName = '';

  constructor(
    private feedService: FeedService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.allFieldsError = 'Invalid feed id';
      return;
    }
    this.feedId = id;
    this.loadFeed();
  }

  loadFeed(): void {
    this.feedService.getFeedById(this.feedId).subscribe({
      next: (data: any) => {
        //  Map camelCase -> PascalCase (safe)
        this.feed = {
          FeedId: data.feedId ?? data.FeedId,
          FeedName: data.feedName ?? data.FeedName,
          Type: data.type ?? data.Type,
          Description: data.description ?? data.Description,
          Quantity: data.quantity ?? data.Quantity,
          Unit: data.unit ?? data.Unit,
          PricePerUnit: data.pricePerUnit ?? data.PricePerUnit,
          Image: data.image ?? data.Image ?? '',  //  optional
          UserId: data.userId ?? data.UserId
        } as Feed;
      },
      error: (err) => {
        console.error('Error loading feed', err);
        this.allFieldsError = 'Failed to load feed';
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event?.target?.files?.[0];

    if (!file) {
      this.selectedFileName = '';
      return;
    }

    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.feed.Image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  updateFeed(form: NgForm): void {
    this.submitted = true;
    this.allFieldsError = '';
    this.duplicateError = '';

    if (form.invalid) {
      this.allFieldsError = 'All fields are required';
      return;
    }

    if ((this.feed.Quantity as any) <= 0 || (this.feed.PricePerUnit as any) <= 0) {
      this.allFieldsError = 'All fields are required';
      return;
    }

    //  if no image uploaded keep empty string
    if (!this.feed.Image) {
      this.feed.Image = '';
    }

    this.feedService.updateFeed(this.feedId, this.feed).subscribe({
      next: () => {
        alert('Updated successfully');
        this.router.navigate(['/admin/feed/view']);  //  correct route
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          err?.error ||
          err?.message ||
          '';

        if (
          err?.status === 409 ||
          (typeof msg === 'string' && msg.toLowerCase().includes('already exists'))
        ) {
          this.duplicateError = 'Feed with the same name and type already exists';
        } else {
          this.allFieldsError = 'Failed to update feed';
        }
      }
    });
  }

  back(): void {
    this.router.navigate(['/admin/feed/view']); //  correct route
  }

  showError(control: any): boolean {
    return !!control && (control.touched || this.submitted) && control.invalid;
  }
}
