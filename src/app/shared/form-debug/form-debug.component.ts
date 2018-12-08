import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'aka-form-debug',
  templateUrl: './form-debug.component.html'
})
export class FormDebugComponent implements OnInit {

  @Input() form;

  constructor() { }

  ngOnInit() { }

}
