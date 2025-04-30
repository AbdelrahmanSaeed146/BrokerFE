import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideTranslocoConfig } from './shared/providers/transloco.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideTranslocoConfig(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      // withHashLocation()
    ),
  ]
};
