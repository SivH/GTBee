import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GtBeeGTBactivityModule } from './gt-bactivity/gt-bactivity.module';
import { GtBeeRegistrationModule } from './registration/registration.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        GtBeeGTBactivityModule,
        GtBeeRegistrationModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GtBeeEntityModule {}
