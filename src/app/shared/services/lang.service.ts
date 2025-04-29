import { computed, inject, Injectable, Injector } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { currentLang } from '../util/current-lang';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  private translocoService = inject(TranslocoService);

  currentLang = currentLang(inject(Injector));

  constructor() {
    // Set the default language and direction on initialization
    const defaultLang = this.translocoService.getDefaultLang();
    this.setActiveLang(defaultLang);
  }

  setActiveLang(lang: string): void {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    const language = lang === 'ar' ? 'ar' : 'en';

    // Update HTML lang attribute and direction
    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    // Set the active language
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);

    // Update UI elements if necessary (e.g., settings cog)
    const settingsCog = document.querySelector('.settings-cog');
    if (settingsCog) {
      const classesToReplace = {
        'rotate-180': lang === 'ar' ? 'rotate-180' : 'rotate-0',
        'rotate-0': lang === 'ar' ? 'rotate-180' : 'rotate-0',
        'right-0': lang === 'ar' ? 'left-0' : 'right-0',
        'left-0': lang === 'ar' ? 'right-0' : 'left-0',
        'right-16': lang === 'ar' ? 'left-16' : 'right-16',
        'left-16': lang === 'ar' ? 'right-16' : 'left-16',
      };

      for (const [oldClass, newClass] of Object.entries(classesToReplace)) {
        if (settingsCog.classList.contains(oldClass)) {
          settingsCog.classList.remove(oldClass);
          settingsCog.classList.add(newClass);
        }
      }
    }
  }
}
