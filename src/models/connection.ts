module powerbi.extensibility.visual {
    "use strict";
    export class ConnectionModel implements IPersistable {

        tenant: KnockoutObservable<string>;
        endpoint: KnockoutObservable<string>;
        username: KnockoutObservable<string>;
        password: KnockoutObservable<string>;
        connected: KnockoutComputed<boolean>;
        buttonDisplayName: KnockoutComputed<string>;

        private host: IVisualHost;
        private client: Client;

        authorize: () => void;
        persistModel: () => void;
        readModel: (dataView: DataView) => void;

        constructor(host: IVisualHost) {
            
            this.tenant = ko.observable<string>();
            this.endpoint = ko.observable<string>();
            this.username = ko.observable<string>();
            this.password = ko.observable<string>();

            this.host = host;
            this.client = new Client();

            this.authorize = () => {

                if(!this.connected()) {
                    this.client.authorize(this.tenant(), this.endpoint(), this.username(), this.password()).then((token: IToken) => {
                        console.info('Connected to MApp Enterprise, persisting login information');
                        this.persistModel();
                    });
                }
                else {
                    this.client.token(undefined);
                    this.persistModel();
                }
            }

            this.persistModel = () => {
                
                let data: VisualObjectInstancesToPersist = {
                    merge: [
                        <VisualObjectInstance>{
                            objectName: 'connectionData',
                            selector: undefined,
                            properties: {
                                'tenant': this.tenant(),
                                'url': this.endpoint(),
                                'username': this.username(),
                                'token': JSON.stringify(this.client.token())
                            }
                        }
                    ]
                }

                try {
                    this.host.persistProperties(data);
                    console.info('Persisted', data);
                }
                catch(e) {
                    console.error(e);
                }
            }

            this.readModel = (dataView: DataView) => {

                if(dataView.metadata && dataView.metadata.objects) {
                    let connectionData: any = dataView.metadata.objects['connectionData'];
                    this.tenant(connectionData.tenant);
                    this.endpoint(connectionData.url);
                    this.username(connectionData.username);
                    this.client.token(JSON.parse(connectionData.token));
                    console.info('Reading data', connectionData);
                }
            }

            this.connected = ko.pureComputed(() => {

                let isValid = this.client.isTokenValid();
                console.info('Connected', isValid);
                return isValid;
            });

            this.buttonDisplayName = ko.pureComputed(() => {

                return (this.connected() ? 'disconnect' : 'connect').toUpperCase();
            });
        }
    }
}