import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LangService } from './shared/services/lang.service';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslocoPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private langService = inject(LangService);
  currentYear = new Date().getFullYear();
  currentLang = computed(() => this.langService.currentLang() === 'ar' ? 'عربي' : 'English');
  
  activeLang: string = 'ar'; // Default language

  setActiveLang(lang: string): void {
    this.langService.setActiveLang(lang)
    this.activeLang = lang;
  }
}
