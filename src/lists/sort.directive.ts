import {
    Directive,
    DoCheck,
    ElementRef,
    HostListener,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnChanges,
    OnInit,
    Renderer,
    SimpleChange,
    SkipSelf
} from "@angular/core";
import { SortDirection, SortingsService, SortParameter } from "e2e4";

import { RTList } from "./providers/list";

@Directive({
    selector: "[rtSort]"
})
export class SortDirective implements DoCheck, OnInit, OnChanges {
    public static settings: {
        sortAscClassName: string;
        sortDescClassName: string;
        sortableClassName: string;
    } = {
        sortAscClassName: "rt-sort-asc",
        sortDescClassName: "rt-sort-desc",
        sortableClassName: "rt-sortable"
    };
    /* tslint:disable-next-line:no-input-rename */
    @Input("rtSort") public fieldName: string;
    @Input() public disableSort: false;
    private nativeEl: HTMLElement;
    private sortingsDiffer: IterableDiffer<SortParameter>;

    constructor(
        @SkipSelf() private listService: RTList,
        @SkipSelf() private sortingsService: SortingsService,
        private renderer: Renderer,
        el: ElementRef,
        differs: IterableDiffers
    ) {
        this.sortingsDiffer = differs.find([]).create(null);
        this.nativeEl = el.nativeElement;
    }
    public ngOnInit(): void {
        if (SortDirective.settings.sortableClassName) {
            this.renderer.setElementClass(this.nativeEl, SortDirective.settings.sortableClassName, true);
        }
        this.sortingsService.sortings.some(sortParameter => {
            if (sortParameter.fieldName === this.fieldName) {
                this.setSortClasses(sortParameter);
                return true;
            }
            return false;
        });
    }
    @HostListener("click", ["$event.ctrlKey"])
    public clickHandler(ctrlKeyPressed: boolean): void {
        if (this.listService.ready && !this.disableSort) {
            this.sortingsService.setSort(this.fieldName, ctrlKeyPressed);
            this.listService.reloadData();
        }
    }
    public ngDoCheck(): void {
        const changes = this.sortingsDiffer.diff(this.sortingsService.sortings);
        if (changes) {
            changes.forEachRemovedItem(this.sortItemRemovedCallback);
            changes.forEachAddedItem(this.sortItemAddedCallback);
        }
    }
    public ngOnChanges(changes: { disableSort?: SimpleChange }): void {
        if (changes.disableSort && changes.disableSort.currentValue) {
            this.sortingsService.removeSort(this.fieldName);
        }
    }
    private sortItemRemovedCallback = (removedItem: any): void => {
        if (removedItem.item && removedItem.item.fieldName === this.fieldName) {
            this.removeSortClasses();
        }
    };
    private sortItemAddedCallback = (addedItem: any): void => {
        if (addedItem.item && addedItem.item.fieldName === this.fieldName) {
            this.setSortClasses(addedItem.item);
        }
    };
    private removeSortClasses(): void {
        if (SortDirective.settings.sortAscClassName) {
            this.renderer.setElementClass(this.nativeEl, SortDirective.settings.sortAscClassName, false);
        }
        if (SortDirective.settings.sortDescClassName) {
            this.renderer.setElementClass(this.nativeEl, SortDirective.settings.sortDescClassName, false);
        }
    }
    private setSortClasses(sortParameter: any): void {
        const direction = sortParameter.direction;
        if (SortDirective.settings.sortAscClassName) {
            this.renderer.setElementClass(
                this.nativeEl,
                SortDirective.settings.sortAscClassName,
                direction === SortDirection.Asc
            );
        }
        if (SortDirective.settings.sortDescClassName) {
            this.renderer.setElementClass(
                this.nativeEl,
                SortDirective.settings.sortDescClassName,
                direction === SortDirection.Desc
            );
        }
    }
}
