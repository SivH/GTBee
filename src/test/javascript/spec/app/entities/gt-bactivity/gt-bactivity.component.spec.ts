/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GtBeeTestModule } from '../../../test.module';
import { GTBactivityComponent } from 'app/entities/gt-bactivity/gt-bactivity.component';
import { GTBactivityService } from 'app/entities/gt-bactivity/gt-bactivity.service';
import { GTBactivity } from 'app/shared/model/gt-bactivity.model';

describe('Component Tests', () => {
    describe('GTBactivity Management Component', () => {
        let comp: GTBactivityComponent;
        let fixture: ComponentFixture<GTBactivityComponent>;
        let service: GTBactivityService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GtBeeTestModule],
                declarations: [GTBactivityComponent],
                providers: []
            })
                .overrideTemplate(GTBactivityComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(GTBactivityComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GTBactivityService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new GTBactivity(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.gTBactivities[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
