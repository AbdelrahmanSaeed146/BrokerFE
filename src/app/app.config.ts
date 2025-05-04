import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideTranslocoConfig } from './shared/providers/transloco.provider';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

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
    provideToastr({
      timeOut: 2000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
      progressAnimation: 'decreasing',
      enableHtml: true,
    }),
    provideAnimationsAsync(),

  ]
};
