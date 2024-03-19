import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
    NavigationEnd,
    Router,
} from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { ConnectedEvent } from '@scrapoxy/common';
import { EventsService } from '@scrapoxy/frontend-sdk';
import { Subscription } from 'rxjs';
import { icons } from './icons/icons';
import type {
    OnDestroy,
    OnInit,
} from '@angular/core';


@Component({
    selector: 'body',
    template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Scrapoxy';

    private readonly subscription = new Subscription();

    constructor(
        private readonly events: EventsService,
        iconSetService: IconSetService,
        private readonly router: Router,
        titleService: Title
    ) {
        titleService.setTitle(this.title);
        iconSetService.icons = icons;
    }

    async ngOnInit(): Promise<void> {
        // Manage app events
        this.subscription.add(this.events.event$.subscribe((event) => {
            if (!event) {
                return;
            }

            switch (event.id) {
                case ConnectedEvent.id: {
                    const connected = event as ConnectedEvent;
                    this.onConnected(connected);

                    break;
                }
            }
        }));
        await this.events.connect();

        // Scroll to top when route changes
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(
                0,
                0
            );
        });
    }

    ngOnDestroy() {
        this.events.disconnect();

        // Stop listening events
        this.subscription.unsubscribe();
    }

    private onConnected(connected: ConnectedEvent) {
        // Force reload of the page when backend comes online
        if (connected &&
            !connected.firstConnection) {
            window.location.reload();
        }
    }
}
