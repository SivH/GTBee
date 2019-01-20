import { Moment } from 'moment';
import { IGTBactivity } from 'app/shared/model//gt-bactivity.model';

export interface IRegistration {
    id?: number;
    registrationCode?: string;
    registrationDate?: Moment;
    gTBactivity?: IGTBactivity;
}

export class Registration implements IRegistration {
    constructor(
        public id?: number,
        public registrationCode?: string,
        public registrationDate?: Moment,
        public gTBactivity?: IGTBactivity
    ) {}
}
