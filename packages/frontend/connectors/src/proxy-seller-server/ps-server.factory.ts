import {
    Injectable,
    Type,
} from '@angular/core';
import { CONNECTOR_PROXY_SELLER_SERVER_TYPE } from '@scrapoxy/common';
import {
    ConnectorprovidersService,
    EConnectorType,
} from '@scrapoxy/frontend-sdk';
import { ConnectorProxySellerServerComponent } from './connector/connector.component';
import { CredentialProxySellerServerComponent } from './credential/credential.component';
import type {
    IConnectorComponent,
    IConnectorConfig,
    IConnectorFactory,
    ICredentialComponent,
    IInstallComponent,
} from '@scrapoxy/frontend-sdk';


@Injectable()
export class ConnectorProxySellerServerFactory implements IConnectorFactory {
    readonly type = CONNECTOR_PROXY_SELLER_SERVER_TYPE;

   readonly config: IConnectorConfig = {
       name: 'Proxy-Seller Server',
       description: 'Proxy-Seller\'s DC/ISP/Mobile proxy service offers businesses a high-quality, cost-effective solution for reliable data access, tailored to meet the demands of professional use.',
       defaultCredentialName: 'Proxy-Seller Server Credential',
       defaultConnectorName: 'Proxy-Seller Server Connector',
       url: 'https://proxy-seller.com/?partner=GR930FP5IOO78P',
       type: EConnectorType.StaticIp,
       canInstall: false,
       canUninstall: false,
       useCertificate: false,
       canReplaceProxy: false,
   };

   constructor(connectorproviders: ConnectorprovidersService) {
       connectorproviders.register(this);
   }

   init() {
       // Nothing
   }

   getCredentialComponent(): Type<ICredentialComponent> {
       return CredentialProxySellerServerComponent;
   }

   getConnectorComponent(): Type<IConnectorComponent> {
       return ConnectorProxySellerServerComponent;
   }

   getInstallComponent(): Type<IInstallComponent> {
       throw new Error('Not implemented');
   }
}
