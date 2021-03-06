import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/primeng';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];
    dTuNgay: Date = new Date;
    dDenNgay: Date = new Date(this.dTuNgay.getFullYear(), this.dTuNgay.getMonth() - 1, this.dTuNgay.getDate());

    constructor(public breadcrumbService: BreadcrumbService) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            this.items = response;
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
