import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'app/services/auth.service';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html'
})

export class FooterComponent implements OnInit {
    isLoggedIn$: Observable<boolean>
    test: Date = new Date();

    constructor(private _authService: AuthService) { }

    ngOnInit() {
        this.isLoggedIn$ = this._authService.isLoggedIn;
    }
}
