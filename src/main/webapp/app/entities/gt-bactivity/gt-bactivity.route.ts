import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GTBactivity } from 'app/shared/model/gt-bactivity.model';
import { GTBactivityService } from './gt-bactivity.service';
import { GTBactivityComponent } from './gt-bactivity.component';
import { GTBactivityDetailComponent } from './gt-bactivity-detail.component';
import { GTBactivityUpdateComponent } from './gt-bactivity-update.component';
import { GTBactivityDeletePopupComponent } from './gt-bactivity-delete-dialog.component';
import { IGTBactivity } from 'app/shared/model/gt-bactivity.model';

@Injectable({ providedIn: 'root' })
export class GTBactivityResolve implements Resolve<IGTBactivity> {
    constructor(private service: GTBactivityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGTBactivity> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<GTBactivity>) => response.ok),
                map((gTBactivity: HttpResponse<GTBactivity>) => gTBactivity.body)
            );
        }
        return of(new GTBactivity());
    }
}

export const gTBactivityRoute: Routes = [
    {
        path: '',
        component: GTBactivityComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.gTBactivity.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: GTBactivityDetailComponent,
        resolve: {
            gTBactivity: GTBactivityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.gTBactivity.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: GTBactivityUpdateComponent,
        resolve: {
            gTBactivity: GTBactivityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.gTBactivity.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: GTBactivityUpdateComponent,
        resolve: {
            gTBactivity: GTBactivityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.gTBactivity.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const gTBactivityPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: GTBactivityDeletePopupComponent,
        resolve: {
            gTBactivity: GTBactivityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.gTBactivity.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
