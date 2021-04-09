import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input('timeout') timeout: any;
  @Output() onTimeout: EventEmitter<any> = new EventEmitter<any>();

  public _isLoading: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  @Input() set isLoading(value: boolean) {
    if (value != undefined) {
      this._isLoading = value;
      document.body.style.cursor = value ? 'wait' : 'default';
    }
    else {
      document.body.style.cursor = 'default';
    }
  }
}
