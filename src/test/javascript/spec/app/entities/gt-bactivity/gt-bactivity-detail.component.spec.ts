/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GtBeeTestModule } from '../../../test.module';
import { GTBactivityDetailComponent } from 'app/entities/gt-bactivity/gt-bactivity-detail.component';
import { GTBactivity } from 'app/shared/model/gt-bactivity.model';

describe('Component Tests', () => {
    describe('GTBactivity Management Detail Component', () => {
        let comp: GTBactivityDetailComponent;
        let fixture: ComponentFixture<GTBactivityDetailComponent>;
        const route = ({ data: of({ gTBactivity: new GTBactivity(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GtBeeTestModule],
                declarations: [GTBactivityDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(GTBactivityDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(GTBactivityDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.gTBactivity).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
