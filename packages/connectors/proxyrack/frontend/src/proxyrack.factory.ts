import {
    Injectable,
    Type,
} from '@angular/core';
import { CONNECTOR_PROXYRACK_TYPE } from '@scrapoxy/connector-proxyrack-sdk';
import {
    ConnectorprovidersService,
    EConnectorFactoryGroup,
} from '@scrapoxy/frontend-sdk';
import { ConnectorProxyrackComponent } from './connector/connector.component';
import { CredentialProxyrackComponent } from './credential/credential.component';
import type {
    IConnectorComponent,
    IConnectorConfig,
    IConnectorFactory,
    ICredentialComponent,
    IInstallComponent,
} from '@scrapoxy/frontend-sdk';


@Injectable()
export class ConnectorProxyrackFactory implements IConnectorFactory {
    readonly type = CONNECTOR_PROXYRACK_TYPE;

    readonly config: IConnectorConfig = {
        name: 'Proxyrack',
        description: 'Proxyrack is an online platform that provides diverse and rotating residential, datacenter, and mobile proxies.',
        url: 'https://proxyrack.com',
        group: EConnectorFactoryGroup.ProxiesService,
        canInstall: false,
        canUninstall: false,
        useCertificate: false,
        canReplaceProxy: true,
    };

    constructor(connectorproviders: ConnectorprovidersService) {
        connectorproviders.register(this);
    }

    init() {
        // Nothing
    }

    getCredentialComponent(): Type<ICredentialComponent> {
        return CredentialProxyrackComponent;
    }

    getConnectorComponent(): Type<IConnectorComponent> {
        return ConnectorProxyrackComponent;
    }

    getInstallComponent(): Type<IInstallComponent> {
        throw new Error('Not implemented');
    }
}