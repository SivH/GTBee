import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRegistration } from 'app/shared/model/registration.model';
import { RegistrationService } from './registration.service';

@Component({
    selector: 'jhi-registration-delete-dialog',
    templateUrl: './registration-delete-dialog.component.html'
})
export class RegistrationDeleteDialogComponent {
    registration: IRegistration;

    constructor(
        protected registrationService: RegistrationService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.registrationService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'registrationListModification',
                content: 'Deleted an registration'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-registration-delete-popup',
    template: ''
})
export class RegistrationDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ registration }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(RegistrationDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.registration = registration;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/registration', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/registration', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
