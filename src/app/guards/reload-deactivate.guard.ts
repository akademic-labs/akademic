import { HostListener, Injectable } from '@angular/core';

// Consider using this interface for all CanDeactivate guards,
// and have your components implement this interface, too.
//
//   e.g. export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
//
// export interface CanComponentDeactivate {
// canDeactivate: () => any;
// }

@Injectable({ providedIn: 'root' })
export abstract class ComponentCanDeactivate {
    abstract canDeactivate(): boolean;

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue = true;
            console.log('window:beforeunload');
            console.log($event);
            if (confirm('Deseja realmente sair desta tela?')) {
                return true;
            } else {
                return false;
            }
        }
    }

}
