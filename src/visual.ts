/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */


module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private host: IVisualHost;
        private target: HTMLElement;
        private settings: VisualSettings;
        private dataView: DataView;
        private options: VisualUpdateOptions;
        private client: Client;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.host = options.host;
            this.target = options.element;
            this.client = new Client();
        }

        public update(options: VisualUpdateOptions) {
            let dataViewAvailable = options && options.dataViews && options.dataViews[0];
            this.settings = Visual.parseSettings(dataViewAvailable);
            console.log('Visual update', options);

            if(dataViewAvailable) {
                this.target.innerHTML = Templates.getMarkup(options.editMode == EditMode.Advanced);
                $('#api_connect').on('click', (e) => { this.connectVisual(); });
                this.getConnectionData(options.dataViews[0]);
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
        private connectVisual() {
            
            let url = $('#api_url').val();
            let username = $('#api_username').val();
            let password = $('#api_password').val();
            
            debugger;
            this.client.login(username, password).then((token) => {
                debugger;
            });

            this.persistConnectionData(url, username, password);
        }

        public getConnectionData(dataView: DataView) {

            if(dataView.metadata && dataView.metadata.objects) {

                let connectionData: any = dataView.metadata.objects['connectionData'];
                $('#api_url').val(connectionData.url);
                $('#api_username').val(connectionData.username);
                $('#api_password').val(connectionData.password);
            }
        }

        public persistConnectionData(url: string, username: string, password: string) {
            let data: VisualObjectInstancesToPersist = {
                merge: [
                    <VisualObjectInstance>{
                        objectName: 'connectionData',
                        selector: undefined,
                        properties: {
                            'url': url,
                            'username': username,
                            'password': password
                        }
                    }
                ]
            }

            this.host.persistProperties(data);
            this.host.allowInteractions = true;
        }
    }
}