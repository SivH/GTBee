import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGTBactivity } from 'app/shared/model/gt-bactivity.model';

@Component({
    selector: 'jhi-gt-bactivity-detail',
    templateUrl: './gt-bactivity-detail.component.html'
})
export class GTBactivityDetailComponent implements OnInit {
    gTBactivity: IGTBactivity;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ gTBactivity }) => {
            this.gTBactivity = gTBactivity;
        });
    }

    previousState() {
        window.history.back();
    }
}
