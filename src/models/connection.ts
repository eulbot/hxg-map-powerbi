module powerbi.extensibility.visual {
    "use strict";
    export class ConnectionModel {

        private tenant: KnockoutObservable<string>;

        constructor() {

            this.tenant = ko.observable<string>();
            this.tenant('noshit');
        }
    }
}