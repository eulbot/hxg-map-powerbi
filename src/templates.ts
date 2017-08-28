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
                        <li data-bind="click: function() { activateTab('login') }, css: { active: activeTab() == 'login' }"><span>Login</span></li>
                        <li data-bind="click: function() { activateTab('config') }, css: { active: activeTab() == 'config' }"><span>Map Configs<span></li>
                    </ul>
                </div>
            `.trim().replace(/\n/g, '');
        }

        private static sidenav() {
            return `
                <div class="hxg sidenav" data-bind="css: { expanded: activeTab() != '' }">

                    <div class="tab" data-bind="css: { active: activeTab() == 'login', connected: connectionModel.connected }">

                        <label for="api_tenant">Tenant</label>
                        <input id="api_tenant" type="text" class="w-1-2" data-bind="value: connectionModel.tenant, disable: connectionModel.connected">

                        <label for="api_url">MapEnterprise Api Url</label>
                        <input id="api_url" type="text" placeholder="http://localhost/MApp/api" class="w-1" spellcheck="false" data-bind="value: connectionModel.endpoint, disable: connectionModel.connected">

                        <label for="api_username">Username</label>
                        <input id="api_username" type="text" class="w-2-3" data-bind="value: connectionModel.username, disable: connectionModel.connected">

                        <label for="api_password">Password</label>
                        <input id="api_password" type="password" class="w-2-3" data-bind="value: connectionModel.password, disable: connectionModel.connected">

                        <input id="api_connect" type="button" value="CONNECT" class="w-1-2" data-bind="value: connectionModel.buttonDisplayName, click: connectionModel.authorize, css: { connected: connectionModel.connected }">
                    </div>

                    <div class="tab" data-bind="css: { active: activeTab() == 'config' }">
                        <span>
                            <input id="hxg_mv" type="button" value="sadf">
                        </span>
                    </div>
                </div>
            `
            .replace(/\n/g, '');
        }
    }

}