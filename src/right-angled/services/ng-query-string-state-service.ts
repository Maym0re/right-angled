import { ActivatedRoute, Router } from '@angular/router';
import { Injectable, SkipSelf, Optional } from '@angular/core';

import { NgStateManagementService } from './ng-state-management-service';

@Injectable()
export class NgQueryStringStateService implements NgStateManagementService {
    private static stateObject: Map<any, any> = new Map<any, any>();
    public target: any;

    constructor( @Optional() @SkipSelf() private activatedRoute: ActivatedRoute, @Optional() @SkipSelf() private router: Router) {
    }
    public flushRequestState(state: Object): void {
        NgQueryStringStateService.stateObject.set(this.target, NgQueryStringStateService.stateObject.get(this.target) || {});
        let vmState = NgQueryStringStateService.stateObject.get(this.target);
        setTimeout(() => {
            let newState = {};
            Object.assign(newState, state);
            vmState.lastRequestState = newState;
            let params = this.router.routerState.snapshot.queryParams || {};

            Object.assign(params, vmState.lastRequestState);
            this.router.navigate(['/' + this.activatedRoute.snapshot.url[0].path], { queryParams: params });
        }, 0);
    }
    public persistLocalState(state: Object): void { return void (0); }
    public mergeStates(): Object {
        const restoredState = {};
        const requestState = this.getRequestState();
        const persistedState = this.getPersistedState();
        Object.assign(restoredState, persistedState || {}, requestState ? (requestState.lastRequestState || {}) : {}, this.router.routerState.snapshot.queryParams || {});
        return restoredState;
    }
    private getRequestState(): any {
        return NgQueryStringStateService.stateObject.get(this.target);
    }
    private getPersistedState(): any {
        return {};
    }
}