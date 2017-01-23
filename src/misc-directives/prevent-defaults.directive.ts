import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { EventsAttacherBase } from './events-attacher.base';

@Directive({
    selector: '[rtPreventDefaults]'
})
export class PreventDefaultsDirective extends EventsAttacherBase {
    /* tslint:disable-next-line:no-input-rename */
    @Input('rtPreventDefaults') public eventNames: string[];
    constructor(elementRef: ElementRef, renderer: Renderer) {
        super(elementRef, renderer, (evt: Event) => { evt.preventDefault(); });
    }
}
