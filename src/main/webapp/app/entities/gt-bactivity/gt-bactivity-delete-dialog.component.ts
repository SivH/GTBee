import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IGTBactivity } from 'app/shared/model/gt-bactivity.model';
import { GTBactivityService } from './gt-bactivity.service';

@Component({
    selector: 'jhi-gt-bactivity-delete-dialog',
    templateUrl: './gt-bactivity-delete-dialog.component.html'
})
export class GTBactivityDeleteDialogComponent {
    gTBactivity: IGTBactivity;

    constructor(
        protected gTBactivityService: GTBactivityService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.gTBactivityService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'gTBactivityListModification',
                content: 'Deleted an gTBactivity'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-gt-bactivity-delete-popup',
    template: ''
})
export class GTBactivityDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ gTBactivity }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(GTBactivityDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.gTBactivity = gTBactivity;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
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
