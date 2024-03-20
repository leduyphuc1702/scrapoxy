import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    AvatarModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FormCheckComponent,
    GridModule,
    HeaderModule,
    ModalModule,
    NavModule,
    SharedModule,
    SidebarModule,
    ToastModule,
    TooltipDirective,
    TooltipModule,
    UtilitiesModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { SharedSpxModule } from '@scrapoxy/frontend-sdk';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ConfirmComponent } from './confirm/confirm.component';
import { ConnectionComponent } from './connection/connection.component';
import { SidebarBrandAltComponent } from './header/brand/brand.component';
import { LayoutHeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { ToastMessageComponent } from './toasts/message.component';


@NgModule({
    imports: [
        AvatarModule,
        ButtonModule,
        CardModule,
        CommonModule,
        DropdownModule,
        HeaderModule,
        GridModule,
        IconModule,
        ModalModule,
        NavModule,
        NgScrollbarModule,
        RouterModule,
        SharedModule,
        SidebarModule,
        ToastModule,
        TooltipModule,
        UtilitiesModule,
        SharedSpxModule,
        FormCheckComponent,
        TooltipDirective,
    ],
    declarations: [
        ConfirmComponent,
        ConnectionComponent,
        LayoutComponent,
        LayoutHeaderComponent,
        SidebarBrandAltComponent,
        ToastMessageComponent,
    ],
})
export class LayoutModule { }
