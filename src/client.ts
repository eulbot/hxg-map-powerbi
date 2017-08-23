module powerbi.extensibility.visual {
    "use strict";

    export class Client {

        private baseUrl: string;
        private clientID: string;

        constructor() {
            this.baseUrl = 'https://localhost/MApp/'
            this.clientID = 'Studio';
        }

        public login(username: string, password: string) {
            // var token = Platform.getToken(this.options.storageId);
            let token = undefined;
            return $.ajax({
                url: `${this.baseUrl}api/v1/oauth2/token`,
                headers: {
                    tenant: 'NewYork_163'
                },
                data: { 
                    grant_type: 'password', 
                    username: username,
                    password: password, 
                    client_id: this.clientID 
                },
                method: 'POST'
            });
        }    

    }

}