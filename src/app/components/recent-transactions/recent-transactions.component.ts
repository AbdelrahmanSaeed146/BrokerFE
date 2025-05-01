import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './recent-transactions.component.html',
  styleUrl: './recent-transactions.component.scss'
})
export class RecentTransactionsComponent {
  private translocoService = inject(TranslocoService);
  private apiService = inject(ApiService);
  
  currentLang = toSignal(this.translocoService.langChanges$);
  transactions = signal<any>([]);
  
  // Use API service's pagination state
  currentPage = this.apiService.currentPage;
  pageSize = this.apiService.pageSize;
  totalItems = this.apiService.totalItems;
  totalPages = this.apiService.totalPages;
  Math = Math; // Make Math available in template

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.apiService.getPagedTransactions(this.currentPage(), this.pageSize()).subscribe((res: any) => {
      this.transactions.set(res.items);
      this.totalItems.set(res.totalCount);
      this.totalPages.set(Math.ceil(res.totalCount / this.pageSize()));
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadTransactions();
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    const arabicIntervals = {
      year: 'سنة',
      years: 'سنوات',
      month: 'شهر',
      months: 'شهور',
      week: 'أسبوع',
      weeks: 'أسابيع',
      day: 'يوم',
      days: 'أيام',
      hour: 'ساعة',
      hours: 'ساعات',
      minute: 'دقيقة',
      minutes: 'دقائق'
    };

    if (diffInSeconds < 60) {
      return this.currentLang() === 'ar' ? 'الآن' : 'just now';
    }

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      
      if (interval >= 1) {
        if (this.currentLang() === 'ar') {
          // Arabic format
          const arabicUnit = interval === 1 ? arabicIntervals[unit as keyof typeof arabicIntervals] : arabicIntervals[`${unit}s` as keyof typeof arabicIntervals];
          return `منذ ${interval} ${arabicUnit}`;
        } else {
          // English format
          return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
      }
    }

    return dateString;
  }
}
