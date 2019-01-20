import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IGTBactivity } from 'app/shared/model/gt-bactivity.model';
import { AccountService } from 'app/core';
import { GTBactivityService } from './gt-bactivity.service';

@Component({
    selector: 'jhi-gt-bactivity',
    templateUrl: './gt-bactivity.component.html'
})
export class GTBactivityComponent implements OnInit, OnDestroy {
    gTBactivities: IGTBactivity[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected gTBactivityService: GTBactivityService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.gTBactivityService.query().subscribe(
            (res: HttpResponse<IGTBactivity[]>) => {
                this.gTBactivities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInGTBactivities();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IGTBactivity) {
        return item.id;
    }

    registerChangeInGTBactivities() {
        this.eventSubscriber = this.eventManager.subscribe('gTBactivityListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
