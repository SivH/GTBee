import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IGTBactivity } from 'app/shared/model/gt-bactivity.model';

type EntityResponseType = HttpResponse<IGTBactivity>;
type EntityArrayResponseType = HttpResponse<IGTBactivity[]>;

@Injectable({ providedIn: 'root' })
export class GTBactivityService {
    public resourceUrl = SERVER_API_URL + 'api/gt-bactivities';

    constructor(protected http: HttpClient) {}

    create(gTBactivity: IGTBactivity): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(gTBactivity);
        return this.http
            .post<IGTBactivity>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(gTBactivity: IGTBactivity): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(gTBactivity);
        return this.http
            .put<IGTBactivity>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IGTBactivity>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IGTBactivity[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(gTBactivity: IGTBactivity): IGTBactivity {
        const copy: IGTBactivity = Object.assign({}, gTBactivity, {
            activityDate: gTBactivity.activityDate != null && gTBactivity.activityDate.isValid() ? gTBactivity.activityDate.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.activityDate = res.body.activityDate != null ? moment(res.body.activityDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((gTBactivity: IGTBactivity) => {
                gTBactivity.activityDate = gTBactivity.activityDate != null ? moment(gTBactivity.activityDate) : null;
            });
        }
        return res;
    }
}
