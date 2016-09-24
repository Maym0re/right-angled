import { Directive, HostBinding, HostListener, KeyValueDiffers } from '@angular/core';
import { BufferedPager } from 'e2e4';

import { RtListService } from '../list-service';
import { PageSizeControlBase } from './page-size-control-base';

@Directive({
    selector: 'input[rtRowCount]'
})
export class RowCountDirective extends PageSizeControlBase {
    @HostBinding('value')
    public innerValue: number;
    public get pageSizePropertyName(): string {
        return 'takeRowCountInternal';
    }
    constructor(listService: RtListService, private bufferedPager: BufferedPager, differs: KeyValueDiffers) {
        super(listService, bufferedPager, differs);
        if (bufferedPager === null) {
            throw new Error('[rtRowCount] directive can be used only with buffered list provider.');
        }
    }
    @HostBinding('attr.disabled')
    public get disabled(): boolean {
        return this.bufferedPager.skip >= this.bufferedPager.totalCount;
    }
    @HostListener('keyup.enter')
    public onEnter(): void {
        super.onComplete();
    }

    @HostListener('input', ['$event.target.value'])
    public inputHandler(value: any): void {
        super.setPageSize(value);
    }

    @HostListener('blur')
    public blurHandler(): void {
        super.restoreInputValue();
    }
}
