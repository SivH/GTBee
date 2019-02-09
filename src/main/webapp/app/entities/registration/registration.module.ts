import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { GtBeeSharedModule } from 'app/shared';
import {
    RegistrationComponent,
    RegistrationDetailComponent,
    RegistrationUpdateComponent,
    RegistrationDeletePopupComponent,
    RegistrationDeleteDialogComponent,
    registrationRoute,
    registrationPopupRoute
} from './';

const ENTITY_STATES = [...registrationRoute, ...registrationPopupRoute];

@NgModule({
    imports: [GtBeeSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        RegistrationComponent,
        RegistrationDetailComponent,
        RegistrationUpdateComponent,
        RegistrationDeleteDialogComponent,
        RegistrationDeletePopupComponent
    ],
    entryComponents: [
        RegistrationComponent,
        RegistrationUpdateComponent,
        RegistrationDeleteDialogComponent,
        RegistrationDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GtBeeRegistrationModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
