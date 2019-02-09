import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { GtBeeSharedModule } from 'app/shared';
import {
    GTBactivityComponent,
    GTBactivityDetailComponent,
    GTBactivityUpdateComponent,
    GTBactivityDeletePopupComponent,
    GTBactivityDeleteDialogComponent,
    gTBactivityRoute,
    gTBactivityPopupRoute
} from './';

const ENTITY_STATES = [...gTBactivityRoute, ...gTBactivityPopupRoute];

@NgModule({
    imports: [GtBeeSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        GTBactivityComponent,
        GTBactivityDetailComponent,
        GTBactivityUpdateComponent,
        GTBactivityDeleteDialogComponent,
        GTBactivityDeletePopupComponent
    ],
    entryComponents: [GTBactivityComponent, GTBactivityUpdateComponent, GTBactivityDeleteDialogComponent, GTBactivityDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GtBeeGTBactivityModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
