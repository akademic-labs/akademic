import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html'
})

export class FooterComponent implements OnInit {
    isLoggedIn$: Observable<boolean>
    test: Date = new Date();

    constructor() { }

    ngOnInit() {
    }
}
