import { Component, OnInit, Input, forwardRef, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { TTIN_DAUTU } from './model-dautu-xaydung-ctiet';
import { DAUTU_THUAN_CTIET } from './model-dautu-xaydung-ctiet';

@Component({
  selector: 'app-ctiet-kehoach-dautu',
  templateUrl: './ctiet-kehoach-dautu.component.html',
  styleUrls: ['./ctiet-kehoach-dautu.component.css']
})
export class CtietKehoachDautuComponent implements OnInit {
  lstMaCongViecChuyenHuong = [1, 3, 4, 5]
  @Input() lstTTinDauTu: Array<TTIN_DAUTU>;

  constructor() {
  }

  ngOnInit() {
  }
  getnumber(num: number) {
    if (num < 10) {
      return '00' + num;
    } else if (num < 100) {
      return '0' + num;
    } else return num;
  }

  getformatnumber(num: number) {
    if (num == undefined || num == null) {
      return '';
    }
    let numstr = num.toString();
    let numbertp = numstr.substring(numstr.indexOf('.'), numstr.length);
    let numcheck = num - Math.round(num);

    if (numcheck != 0) {
      let num1 = Math.round(num);
      return this.getformatnumberint(num1) + numbertp;
    } else return this.getformatnumberint(num);
  }

  getformatnumberint(num: number) {
    let strnum = '';
    while (num > 999) {
      strnum = this.getnumber(num % 1000) + ',' + strnum;
      num = Math.floor(num /= 1000);
    }
    return (num + ',' + strnum).substring(0, (num + ',' + strnum).length - 1);
  }
  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
