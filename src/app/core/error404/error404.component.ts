import { Component } from '@angular/core';

@Component({
  selector: 'aka-error404',
  template: `
  <div class="page-404">
      <p class="text-404">404</p>
      <h2>Ops!</h2>
      <p>Essa página não existe.<br></p>
      <p>Volte a <a [routerLink]="['/dashboard']">página inicial</a>.<br></p>
  </div>
            `,
  styleUrls: ['./error404.component.css']
})
export class Error404Component {

  constructor() { }

}
