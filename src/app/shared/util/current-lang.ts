import { Injector, inject, runInInjectionContext } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslocoService } from "@ngneat/transloco";

export const currentLang = (injector: Injector) => {
    return runInInjectionContext(injector, () => {
        const translocoService = inject(TranslocoService);
        const currentLang = toSignal(translocoService.langChanges$)
        return currentLang
    })
}