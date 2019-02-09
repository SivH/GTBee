import { Moment } from 'moment';
import { IRegistration } from 'app/shared/model/registration.model';

export const enum Language {
    ENGLISH = 'ENGLISH',
    GERMAN = 'GERMAN'
}

export interface IGTBactivity {
    id?: number;
    activityName?: string;
    email?: string;
    phoneNumber?: string;
    activityDate?: Moment;
    cost?: number;
    language?: Language;
    registrations?: IRegistration[];
}

export class GTBactivity implements IGTBactivity {
    constructor(
        public id?: number,
        public activityName?: string,
        public email?: string,
        public phoneNumber?: string,
        public activityDate?: Moment,
        public cost?: number,
        public language?: Language,
        public registrations?: IRegistration[]
    ) {}
}
