module powerbi.extensibility.visual {
    "use strict";

    export class Client {

        token: IToken;
        private tenant: string;
        private endpointsUrl: string;
        private clientID: string;
        private refreshTokenPromise: JQueryPromise<IToken>;

        constructor() {
            this.clientID = 'Studio';
        }

        public authorize(tenant: string, endpointsUrl: string, username: string, password: string) {

            this.tenant = tenant;
            this.endpointsUrl = endpointsUrl;

            var headers = this.tenant ? { Tenant: this.tenant } : {};

            return $.ajax({
                url: `${this.endpointsUrl}/api/v1/oauth2/token`,
                headers: headers,
                data: <ILoginRequest>{ grant_type: 'password', username: username, password: password, client_id: this.clientID },
                type: 'POST'
            }).then((newToken: IToken) => {
                this.setToken(newToken);
            });
        }    

        public readMapViews() {

            return this.ajax({
                url: `${this.endpointsUrl}/api/v2/studio/mapviews`
            });
        }

        public ajax<T>(settings: JQueryAjaxSettings): JQueryPromise<T> {
            
            var token = this.token;

            if (!token || token.initialRecharge === "true")
                return $.Deferred<T>().reject();
            
            if (Date.now() >= token.expiration_date) {
                if (!this.refreshTokenPromise)
                    this.refreshTokenPromise = this.refreshToken(token.refresh_token, token.client_id);

                return this.refreshTokenPromise.then((newToken: IToken) => {
                    this.setToken(newToken);
                    delete this.refreshTokenPromise;
                    return this.ajaxWithAuthorization(settings, newToken.access_token);
                });
            }
            else {
                return this.ajaxWithAuthorization(settings, token.access_token);
            }
        }

        protected ajaxWithAuthorization<T>(settings: JQueryAjaxSettings, accessToken: string): JQueryPromise<T> {
            if (!settings.headers)
                settings.headers = {};

            settings.headers['Authorization'] = 'Bearer '.concat(accessToken);

            if (this.tenant)
                settings.headers['Tenant'] = this.tenant;

            return $.ajax(settings);
        }

        protected refreshToken(refreshToken: string, clientId: string): JQueryPromise<IToken> {
            return $.ajax({
                url: `${this.endpointsUrl}api/v1/oauth2/token`,
                data: <IRefreshTokenRequest>{ grant_type: 'refresh_token', refresh_token: refreshToken, client_id: clientId },
                type: 'POST'
            });
        }

        public setTenant(tenant: string) {
            this.tenant = tenant;
        }

        public setEnpointsUrl(endpointsUrl: string) {
            this.endpointsUrl = endpointsUrl;
        }

        private setToken(token: IToken) {
            token.expiration_date = Date.now() + (token.expires_in * 1000);
            this.token = token;
        }
    }

    export interface IToken {
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
        expiration_date: number;
        userEmail: string;
        userFullName: string;
        userId: string;
        userName: string;
        initialRecharge: string;    
        client_id: string;
    }

    interface IRefreshTokenRequest {
        grant_type: string;
        refresh_token: string;
    }
    
    interface ILoginRequest {
        grant_type: string;
        username: string;
        password: string;
        client_id: string;
    }

}