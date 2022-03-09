import { Component, Input } from '@angular/core';

import { User } from '../../../models/user.interface';

@Component({
  selector: 'aka-institution-view',
  templateUrl: './institution-view.component.html',
  styleUrls: ['./institution-view.component.css'],
})
export class InstitutionViewComponent {
  @Input() user: User;
}
