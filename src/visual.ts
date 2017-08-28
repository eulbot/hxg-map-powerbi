module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private host: IVisualHost;
        private target: HTMLElement;
        private settings: VisualSettings;
        private dataView: DataView;
        private options: VisualUpdateOptions;
        private client: Client;
        private vm: VisualModel;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.host = options.host;
            this.target = options.element;
            
            this.client = new Client();
            this.target.innerHTML = Templates.getMarkup(true);
            this.vm = new VisualModel(this.host);
            let el = document.querySelector('.hxg.container');
            
            try {
                ko.applyBindings(this.vm, el);
            }
            catch(e) {
                console.error(e);
            }
        }

        public update(options: VisualUpdateOptions) {
            let dataViewAvailable = options && options.dataViews && options.dataViews[0];
            this.settings = Visual.parseSettings(dataViewAvailable);
            console.log('Visual update', options);

            if(dataViewAvailable) {
                
                try {
                    this.vm.connectionModel.readModel(options.dataViews[0]); 
                }
                catch(e) {
                    debugger;
                }
                
                // $('#api_connect').on('click', (e) => { 
                    
                //     if(this.client.token)
                //         this.disconnect();
                //     else
                //         this.connect(); 
                // });
                // $('#hxg_mv').on('click', (e) => {
                //         debugger;
                //     this.client.readMapViews().then((data) => {
                //         debugger;
                //     });
                // });
                
                // this.manageTabs();
                // this.getConnectionData(options.dataViews[0]);
            }
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }

        /**
         * Event registration
         */
        private connect() {
            
            let tenant = $('#api_tenant').val();
            let url = $('#api_url').val();
            let username = $('#api_username').val();
            let password = $('#api_password').val();
            
            this.client.authorize(tenant, url, username, password).then(() => {
                this.persistConnectionData(tenant, url, username, JSON.stringify(this.client.token));
                $(".tab[data-tab='login-tab']").addClass('connected');
                $(".tab[data-tab='login-tab'] input[type=text], .tab[data-tab='login-tab'] input[type=password]").attr('disabled', 'disabled');
                $("#api_connect").val('disconnect'.toUpperCase()).addClass('connected');
            });
        }

        public disconnect() {

            this.client.token = undefined;
            $(".tab[data-tab='login-tab']").removeClass('connected');
            $(".tab[data-tab='login-tab'] input").removeAttr('disabled');
            $('#api_password').val('');
            $("#api_connect").val('connect'.toUpperCase()).removeClass('connected');
            this.clearToken();
            
        }

        public getConnectionData(dataView: DataView) {
            let visualConnected = false;
            
            if(dataView.metadata && dataView.metadata.objects) {
                let connectionData: any = dataView.metadata.objects['connectionData'];
                $('#api_tenant').val(connectionData.tenant);
                $('#api_url').val(connectionData.url);
                $('#api_username').val(connectionData.username);
                $('#api_password').val('nothin here');
                this.client.token = JSON.parse(connectionData.token);

                if(this.client.token) {
                    this.client.setTenant(connectionData.tenant);
                    this.client.setEnpoint(connectionData.url);
                    visualConnected = true;
                }
            }

            if(visualConnected) {
                $(".tab[data-tab='login-tab']").addClass('connected');
                $(".tab[data-tab='login-tab'] input[type=text], .tab[data-tab='login-tab'] input[type=password]").attr('disabled', 'disabled');
                $("#api_connect").val('disconnect'.toUpperCase()).addClass('connected');
            }
            else {
                this.disconnect();
            }
        }

        public persistConnectionData(tenant: string, url: string, username: string, token: string) {
            
            let data: VisualObjectInstancesToPersist = {
                merge: [
                    <VisualObjectInstance>{
                        objectName: 'connectionData',
                        selector: undefined,
                        properties: {
                            'tenant': tenant,
                            'url': url,
                            'username': username,
                            'token': token
                        }
                    }
                ]
            }

            this.host.persistProperties(data);
        }

        public clearToken() {
            let data: VisualObjectInstancesToPersist = {
                remove: [
                    <VisualObjectInstance>{
                        objectName: 'connectionData',
                        selector: undefined,
                        properties: {
                            'token': undefined
                        }
                    }
                ]
            }

            this.host.persistProperties(data);
        }
        
        private manageTabs() {

            $('.hxg.topnav li').on('click', (e) => {
                
                let li = ($(e.target).prop('tagName') == 'li' ? $(e.target) : $(e.target).closest('li'));
                let tab = li.attr('data-tab');

                if(li.hasClass('selected')) {
                    $('.hxg.sidenav').toggleClass('expanded');
                    li.removeClass('selected'); 
                }
                else {
                    $('.hxg.sidenav').addClass('expanded');
                    $('.hxg.topnav li').removeClass('selected');
                    li.addClass('selected');
                    $('.hxg.sidenav div.tab').fadeOut(0, () => {
                        setTimeout(function() {
                            $(`.hxg.sidenav div.tab[data-tab='${tab}']`).fadeIn(100);
                        }, 0);
                    });
                }
            });
        }
    }
}