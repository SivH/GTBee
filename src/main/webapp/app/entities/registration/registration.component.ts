import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IRegistration } from 'app/shared/model/registration.model';
import { AccountService } from 'app/core';
import { RegistrationService } from './registration.service';

@Component({
    selector: 'jhi-registration',
    templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit, OnDestroy {
    registrations: IRegistration[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected registrationService: RegistrationService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.registrationService
            .query()
            .pipe(
                filter((res: HttpResponse<IRegistration[]>) => res.ok),
                map((res: HttpResponse<IRegistration[]>) => res.body)
            )
            .subscribe(
                (res: IRegistration[]) => {
                    this.registrations = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInRegistrations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IRegistration) {
        return item.id;
    }

    registerChangeInRegistrations() {
        this.eventSubscriber = this.eventManager.subscribe('registrationListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
