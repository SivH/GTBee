/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { GtBeeTestModule } from '../../../test.module';
import { GTBactivityUpdateComponent } from 'app/entities/gt-bactivity/gt-bactivity-update.component';
import { GTBactivityService } from 'app/entities/gt-bactivity/gt-bactivity.service';
import { GTBactivity } from 'app/shared/model/gt-bactivity.model';

describe('Component Tests', () => {
    describe('GTBactivity Management Update Component', () => {
        let comp: GTBactivityUpdateComponent;
        let fixture: ComponentFixture<GTBactivityUpdateComponent>;
        let service: GTBactivityService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GtBeeTestModule],
                declarations: [GTBactivityUpdateComponent]
            })
                .overrideTemplate(GTBactivityUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(GTBactivityUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GTBactivityService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new GTBactivity(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.gTBactivity = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new GTBactivity();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.gTBactivity = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
