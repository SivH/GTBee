/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { GtBeeTestModule } from '../../../test.module';
import { GTBactivityDeleteDialogComponent } from 'app/entities/gt-bactivity/gt-bactivity-delete-dialog.component';
import { GTBactivityService } from 'app/entities/gt-bactivity/gt-bactivity.service';

describe('Component Tests', () => {
    describe('GTBactivity Management Delete Component', () => {
        let comp: GTBactivityDeleteDialogComponent;
        let fixture: ComponentFixture<GTBactivityDeleteDialogComponent>;
        let service: GTBactivityService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GtBeeTestModule],
                declarations: [GTBactivityDeleteDialogComponent]
            })
                .overrideTemplate(GTBactivityDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(GTBactivityDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GTBactivityService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
