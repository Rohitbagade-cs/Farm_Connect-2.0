import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedService } from 'src/app/services/feed.service';
import { Feed } from 'src/app/models/feed.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ownerviewfeed',
  templateUrl: './ownerviewfeed.component.html',
  styleUrls: ['./ownerviewfeed.component.css']
})
export class OwnerviewfeedComponent implements OnInit {
 
  feeds: Feed[] = [];
  filteredFeeds: Feed[] = [];
  searchTerm: string = '';
  loading: boolean = false;
 
  constructor(
    public feedService: FeedService,
    public router: Router,
    private route: ActivatedRoute
  ) { }
 
  ngOnInit(): void {
    this.getAllFeeds();
  }
 
  getAllFeeds(): void {
    this.loading = true;
 
    this.feedService.getAllFeed().subscribe({
      next: data => {
        this.feeds = data ;
        console.log(data);
        this.filteredFeeds = [...this.feeds];
        this.loading = false;
      },
      error: () => {
        this.feeds = [];
        this.filteredFeeds = [];
        this.loading = false;
      }
    });
  }
 

  onSearchChange(): void {
    const term = (this.searchTerm || '').trim().toLowerCase();
  
    if (!term) {
      this.filteredFeeds = [...this.feeds];
      return;
    }
  
    this.filteredFeeds = this.feeds.filter((f: any) => {
      const name = String(f.feedName ?? f.FeedName ?? '').toLowerCase();
      const type = String(f.feedType ?? f.Type ?? '').toLowerCase();
      const desc = String(f.description ?? f.Description ?? '').toLowerCase();
  
      return name.startsWith(term);
    });
  }
  
  requestFeed(feedId: number): void {
    this.router.navigate(['/owner/requestform', feedId]);
  }
}
 