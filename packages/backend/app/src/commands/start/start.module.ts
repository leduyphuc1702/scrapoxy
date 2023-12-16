import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
    AuthGithubModule,
    getEnvAuthGithubModuleConfig,
} from '@scrapoxy/auth-github';
import {
    AuthGoogleModule,
    getEnvAuthGoogleModuleConfig,
} from '@scrapoxy/auth-google';
import {
    AuthLocalModule,
    getEnvAuthLocalModuleConfig,
} from '@scrapoxy/auth-local';
import {
    CommanderCaCertificateModule,
    CommanderEventsModule,
    CommanderFrontendModule,
    CommanderMasterModule,
    CommanderRefreshModule,
    CommanderScraperModule,
    CommanderUsersModule,
    getEnvAssetsPath,
    MasterModule,
    ProbeModule,
    RefreshConnectorsModule,
    RefreshFreeproxiesModule,
    RefreshMetricsModule,
    RefreshProxiesModule,
    RefreshTasksModule,
} from '@scrapoxy/backend-sdk';
import { ConnectorAwsModule } from '@scrapoxy/connector-aws-backend';
import { ConnectorAzureModule } from '@scrapoxy/connector-azure-backend';
import { ConnectorCloudlocalModule } from '@scrapoxy/connector-cloudlocal-backend';
import { ConnectorDigitaloceanModule } from '@scrapoxy/connector-digitalocean-backend';
import { ConnectorFreeproxiesModule } from '@scrapoxy/connector-freeproxies-backend';
import { ConnectorGcpModule } from '@scrapoxy/connector-gcp-backend';
import { ConnectorIproyalResidentialModule } from '@scrapoxy/connector-iproyal-residential-backend';
import { ConnectorIproyalServerModule } from '@scrapoxy/connector-iproyal-server-backend';
import { ConnectorNinjasproxyModule } from '@scrapoxy/connector-ninjasproxy-backend';
import { ConnectorOvhModule } from '@scrapoxy/connector-ovh-backend';
import { ConnectorProxidizeModule } from '@scrapoxy/connector-proxidize-backend';
import { ConnectorProxylocalModule } from '@scrapoxy/connector-proxylocal-backend';
import { ConnectorProxyrackModule } from '@scrapoxy/connector-proxyrack-backend';
import { ConnectorRayobyteModule } from '@scrapoxy/connector-rayobyte-backend';
import { ConnectorXProxyModule } from '@scrapoxy/connector-xproxy-backend';
import { ConnectorZyteModule } from '@scrapoxy/connector-zyte-backend';
import {
    StorageDistributedConnModule,
    StorageDistributedMsModule,
} from '@scrapoxy/storage-distributed';
import {
    StorageFileModule,
    StorageMemoryModule,
} from '@scrapoxy/storage-local';
import { getEnvCommanderPort } from './start.helpers';
import type { DynamicModule } from '@nestjs/common';


export interface IAppStartModuleConfig {
    standalone?: boolean;
    master?: boolean;
    commander?: boolean;
    distributed?: string;
    frontend?: boolean;
    refreshAll?: boolean;
    refreshConnectors?: boolean;
    refreshFreeproxies?: boolean;
    refreshMetrics?: boolean;
    refreshProxies?: boolean;
    refreshTasks?: boolean;
    storage?: string;
    test?: boolean;
    cloudlocalAppUrl?: string;
    proxylocalAppUrl?: string;
}


@Module({
    imports: [],
})
export class AppStartModule {
    static forRoot(options: IAppStartModuleConfig): DynamicModule {
        // Connectors
        const imports: any = [
            ConnectorAwsModule,
            ConnectorAzureModule,
            ConnectorDigitaloceanModule,
            ConnectorFreeproxiesModule,
            ConnectorIproyalResidentialModule,
            ConnectorIproyalServerModule,
            ConnectorGcpModule,
            ConnectorNinjasproxyModule,
            ConnectorOvhModule,
            ConnectorProxidizeModule,
            ConnectorProxyrackModule,
            ConnectorRayobyteModule,
            ConnectorXProxyModule,
            ConnectorZyteModule,
            ProbeModule.forRootFromEnv(),
        ];

        if (options.cloudlocalAppUrl) {
            imports.push(ConnectorCloudlocalModule.forRoot({
                url: options.cloudlocalAppUrl,
            }));
        }

        if (options.proxylocalAppUrl) {
            imports.push(ConnectorProxylocalModule.forRoot({
                url: options.proxylocalAppUrl,
            }));
        }

        // Frontend
        if (options.frontend) {
            imports.push(ServeStaticModule.forRoot({
                rootPath: resolve(
                    getEnvAssetsPath(),
                    'frontend'
                ),
            }));
        }

        // Storage
        if (options.storage) {
            switch (options.storage) {
                case 'memory': {
                    imports.push(StorageMemoryModule.forRoot());
                    break;
                }

                case 'distributed': {
                    switch (options.distributed) {
                        case 'read': {
                            imports.push(StorageDistributedConnModule.forRoot());
                            break;
                        }

                        case 'write': {
                            imports.push(StorageDistributedMsModule.forRoot());
                            break;
                        }

                        // File is the default
                        default: {
                            imports.push(
                                StorageDistributedConnModule.forRoot(),
                                StorageDistributedMsModule.forRoot()
                            );
                            break;
                        }
                    }

                    break;
                }

                case 'file': {
                    imports.push(StorageFileModule.forRoot());

                    break;
                }

                default: {
                    // Don't add any storage
                    break;
                }
            }
        }

        // Frontend
        const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:8890';
        // Commander
        const commanderUrl = process.env.COMMANDER_URL ?? `http://localhost:${getEnvCommanderPort()}/api`;

        if (options.commander) {
            imports.push(
                CommanderEventsModule.forRoot(),
                CommanderCaCertificateModule,
                CommanderMasterModule.forRoot(),
                CommanderRefreshModule.forRootFromEnv(),
                CommanderFrontendModule.forRoot(),
                CommanderScraperModule,
                CommanderUsersModule.forRoot()
            );

            // Auth
            let hasAuth = false;
            const configAuthLocal = getEnvAuthLocalModuleConfig();

            if (configAuthLocal) {
                hasAuth = true;
                imports.push(AuthLocalModule.forRoot(configAuthLocal));
            }

            const configAuthGithub = getEnvAuthGithubModuleConfig(frontendUrl);

            if (configAuthGithub) {
                hasAuth = true;
                imports.push(AuthGithubModule.forRoot(configAuthGithub));
            }

            const configAuthGoogle = getEnvAuthGoogleModuleConfig(frontendUrl);

            if (configAuthGoogle) {
                hasAuth = true;
                imports.push(AuthGoogleModule.forRoot(configAuthGoogle));
            }

            if (!hasAuth) {
                throw new Error('No auth module has been enabled');
            }
        }

        // Master
        const trackSockets = process.env.NODE_ENV !== 'production';

        if (options.master) {
            imports.push(MasterModule.forRootFromEnv(
                commanderUrl,
                trackSockets
            ));
        }

        // Refresh
        if (options.refreshConnectors) {
            imports.push(RefreshConnectorsModule.forRoot(commanderUrl));
        }

        if (options.refreshFreeproxies) {
            imports.push(RefreshFreeproxiesModule.forRoot(commanderUrl));
        }

        if (options.refreshMetrics) {
            imports.push(RefreshMetricsModule.forRoot(commanderUrl));
        }

        if (options.refreshProxies) {
            imports.push(RefreshProxiesModule.forRoot(
                commanderUrl,
                trackSockets
            ));
        }

        if (options.refreshTasks) {
            imports.push(RefreshTasksModule.forRoot(commanderUrl));
        }

        return {
            module: AppStartModule,
            imports,
        };
    }
}