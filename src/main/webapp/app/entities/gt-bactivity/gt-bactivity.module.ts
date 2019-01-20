import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

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
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GtBeeGTBactivityModule {}
