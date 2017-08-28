module powerbi.extensibility.visual {
    "use strict";
    export class VisualModel {

        protected host: IVisualHost;
        connectionModel: ConnectionModel;

        activateTab: (tab: string) => void;
        activeTab: KnockoutObservable<string>;

        constructor(host: IVisualHost) {

            this.host = host;
            this.connectionModel = new ConnectionModel(host);
            this.activeTab = ko.observable<string>('login');

            this.activateTab = (tab: string) => {
                this.activeTab(tab == this.activeTab() ? '' : tab);
            }
        }
    }

    export interface IPersistable {
        
        persistModel: () => void;
        readModel: (dataView: DataView) => void;
    }
}