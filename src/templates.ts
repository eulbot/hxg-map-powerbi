module powerbi.extensibility.visual {
    "use strict";

    export class Templates {

        static getMarkup(advancedEditMode?: boolean) {

            let markup = Templates.container().replace(/#/g, this.topnav().concat(this.sidenav().concat(this.map())));
            let editMode = advancedEditMode ? 'edit' : '';

            return markup.replace(/\*/g, editMode);
        }

        private static container() {
            return `
                <div class="hxg container *">
                    #
                </div>
            `
            .replace(/\n/g, '');
        }

        private static map() {
            return `
                <div class="hxg map">
                </div>
            `
            .replace(/\n/g, '');
        }

        private static topnav() {
            return `
                <div class="hxg topnav">
                    <ul>
                        <li class="login"><span>Login</span></li>
                        <li class="config"><span>Map Configs<span></li>
                    </ul>
                </div>
            `.trim().replace(/\n/g, '');
        }

        private static sidenav() {
            return `
                <div class="hxg sidenav">
                    <div id="sidenav-login">
                        <label for="api_url">MapEnterprise API URL</label>
                        <input id="api_url" type="text" placeholder="http://localhost/MApp/api">

                        <label for="api_username">Username</label>
                        <input id="api_username" type="text">

                        <label for="api_password">Password</label>
                        <input id="api_password" type="password">

                        <input id="api_connect" type="button" value="Connect">        
                    </div>
                </div>
            `
            .replace(/\n/g, '');
        }
    }

}