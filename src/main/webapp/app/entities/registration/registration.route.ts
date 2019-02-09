import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Registration } from 'app/shared/model/registration.model';
import { RegistrationService } from './registration.service';
import { RegistrationComponent } from './registration.component';
import { RegistrationDetailComponent } from './registration-detail.component';
import { RegistrationUpdateComponent } from './registration-update.component';
import { RegistrationDeletePopupComponent } from './registration-delete-dialog.component';
import { IRegistration } from 'app/shared/model/registration.model';

@Injectable({ providedIn: 'root' })
export class RegistrationResolve implements Resolve<IRegistration> {
    constructor(private service: RegistrationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRegistration> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Registration>) => response.ok),
                map((registration: HttpResponse<Registration>) => registration.body)
            );
        }
        return of(new Registration());
    }
}

export const registrationRoute: Routes = [
    {
        path: '',
        component: RegistrationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.registration.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: RegistrationDetailComponent,
        resolve: {
            registration: RegistrationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.registration.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: RegistrationUpdateComponent,
        resolve: {
            registration: RegistrationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.registration.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: RegistrationUpdateComponent,
        resolve: {
            registration: RegistrationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.registration.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const registrationPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: RegistrationDeletePopupComponent,
        resolve: {
            registration: RegistrationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gtBeeApp.registration.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
