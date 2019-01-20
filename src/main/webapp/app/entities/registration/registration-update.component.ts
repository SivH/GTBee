import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IRegistration } from 'app/shared/model/registration.model';
import { RegistrationService } from './registration.service';
import { IGTBactivity } from 'app/shared/model/gt-bactivity.model';
import { GTBactivityService } from 'app/entities/gt-bactivity';

@Component({
    selector: 'jhi-registration-update',
    templateUrl: './registration-update.component.html'
})
export class RegistrationUpdateComponent implements OnInit {
    registration: IRegistration;
    isSaving: boolean;

    gtbactivities: IGTBactivity[];
    registrationDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected registrationService: RegistrationService,
        protected gTBactivityService: GTBactivityService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ registration }) => {
            this.registration = registration;
            this.registrationDate =
                this.registration.registrationDate != null ? this.registration.registrationDate.format(DATE_TIME_FORMAT) : null;
        });
        this.gTBactivityService.query().subscribe(
            (res: HttpResponse<IGTBactivity[]>) => {
                this.gtbactivities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.registration.registrationDate = this.registrationDate != null ? moment(this.registrationDate, DATE_TIME_FORMAT) : null;
        if (this.registration.id !== undefined) {
            this.subscribeToSaveResponse(this.registrationService.update(this.registration));
        } else {
            this.subscribeToSaveResponse(this.registrationService.create(this.registration));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegistration>>) {
        result.subscribe((res: HttpResponse<IRegistration>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackGTBactivityById(index: number, item: IGTBactivity) {
        return item.id;
    }
}
