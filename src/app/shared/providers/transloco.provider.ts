import {
  APP_INITIALIZER,
  EnvironmentProviders,
  Provider,
  inject,
} from "@angular/core";
import { TranslocoHttpLoader } from "../../core/loaders/transloco.http-loader";
import { TranslocoService, provideTransloco } from "@ngneat/transloco";
import { firstValueFrom } from "rxjs";

export const provideTranslocoConfig = (): Array<
  Provider | EnvironmentProviders
> => {
  return [
    provideTransloco({
      config: {
        availableLangs: [
          {
            id: "en",
            label: "English",
          },
          {
            id: "ar",
            label: "عربي",
          },
        ],
        defaultLang: "ar",
        fallbackLang: "ar",
        reRenderOnLangChange: true,
        prodMode: true,
      },
      loader: TranslocoHttpLoader,
    }),

    {
      // Preload the default language before the app starts to prevent empty/jumping content
      provide: APP_INITIALIZER,
      useFactory: () => {
        const translocoService = inject(TranslocoService);
        const defaultLang = translocoService.getDefaultLang();
        translocoService.setActiveLang(defaultLang);

        return () => firstValueFrom(translocoService.load(defaultLang));
      },
      multi: true,
    },
  ];
};
