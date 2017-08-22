module powerbi.extensibility.visual {
    "use strict";

    export class Templates {

        static getMarkup(advancedEditMode?: boolean) {

            if(advancedEditMode) {
                return Templates.container().replace(/#/g, this.topnav().concat(this.sidenav().concat(this.map())));
            }
            
            return Templates.container().replace(/#/g, this.map());
        }

        private static container() {
            return `
                <div class="hxg container">
                    #
                </div>
            `
            .replace(/\n/g, '');
        }

        private static map() {
            return `
                <div class="hxg map">
                    HERE COMES THE MAP!
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
                </div>
            `
            .replace(/\n/g, '');
        }
    }

}