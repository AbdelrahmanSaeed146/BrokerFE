import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './recent-transactions.component.html',
  styleUrl: './recent-transactions.component.scss'
})
export class RecentTransactionsComponent {
  private translocoService = inject(TranslocoService);
  
  currentLang = toSignal(this.translocoService.langChanges$)
}
