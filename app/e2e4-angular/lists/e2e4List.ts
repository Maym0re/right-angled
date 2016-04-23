import {Component, Input, OnChanges, OnDestroy} from 'angular2/core';
import {NgListService} from '../bootstrap/ngListService';
import {NgListServiceMediator} from '../bootstrap/ngListServiceMediator';

@Component({
    providers: [NgListServiceMediator],
    selector: 'e2e4-list',
    template: `<ng-content></ng-content>`
})
export class E2E4List implements OnChanges, OnDestroy {
    @Input() items: Array<any>;
    ngListServiceMediator: NgListServiceMediator;
    constructor(ngListServiceMediator: NgListServiceMediator) {
        this.ngListServiceMediator = ngListServiceMediator;
    }
    ngOnDestroy(): void {
        this.ngListServiceMediator.instance.dispose();
    }
    ngOnChanges(changes: any): void {
        if (changes.items) {
            this.ngListServiceMediator.instance.items = changes.items.currentValue;
        }
    }
}