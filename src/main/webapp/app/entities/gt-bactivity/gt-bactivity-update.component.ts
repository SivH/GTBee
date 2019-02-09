import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IGTBactivity } from 'app/shared/model/gt-bactivity.model';
import { GTBactivityService } from './gt-bactivity.service';

@Component({
    selector: 'jhi-gt-bactivity-update',
    templateUrl: './gt-bactivity-update.component.html'
})
export class GTBactivityUpdateComponent implements OnInit {
    gTBactivity: IGTBactivity;
    isSaving: boolean;
    activityDate: string;

    constructor(protected gTBactivityService: GTBactivityService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ gTBactivity }) => {
            this.gTBactivity = gTBactivity;
            this.activityDate = this.gTBactivity.activityDate != null ? this.gTBactivity.activityDate.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.gTBactivity.activityDate = this.activityDate != null ? moment(this.activityDate, DATE_TIME_FORMAT) : null;
        if (this.gTBactivity.id !== undefined) {
            this.subscribeToSaveResponse(this.gTBactivityService.update(this.gTBactivity));
        } else {
            this.subscribeToSaveResponse(this.gTBactivityService.create(this.gTBactivity));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IGTBactivity>>) {
        result.subscribe((res: HttpResponse<IGTBactivity>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
