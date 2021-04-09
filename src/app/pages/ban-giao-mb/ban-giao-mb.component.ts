import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { Utility } from '../utility';
import { CommonService } from '../common.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';

interface iBanGiao {
  ma_da: string;
  ten_da: string;
  tonghd: number;
  lk_da_gpmb: number;
  ngaythang: string;
}
interface iDuongDay {
  name: string,
  marker: any,
  color: string,
  data: any,
  index: number,
  percent: number,
  sum: number
}
@Component({
  selector: 'app-ban-giao-mb',
  templateUrl: './ban-giao-mb.component.html',
  styleUrls: ['./ban-giao-mb.component.scss']
})
export class BanGiaoMbComponent implements OnInit {

  dataTKD: any;
  optionTKD: any;
  @Input() fonSize = 16;

  highcharts = Highcharts;
  chartOptions: any;
  isLoading: boolean = false;
  dBGMB: Date;
  date_has_value: Date;
  dGPMB_befor1: Date;
  dGPMB_befor2: Date;
  dGPMB_befor3: Date;
  lableBG: any = [];
  dataHoDan: any = [];
  dataSoHoBG: any = [];
  dataSoHoBG_befor: any = [];
  dataAll: any = [];
  daySelected: any = {};

  chart;
  updateFlag = false;
  chartConstructor = "chart";
  chartCallback;
  constructor(private router: Router, private utility: Utility, public service: CommonService, private datePipe: DatePipe, private messageService: MessageService) {
    const self = this;

    this.chartCallback = chart => {
      // saving chart reference
      self.chart = chart;
    };
  }

  async ngOnInit() {
    let today = new Date();
    this.dBGMB = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 1));
    this.dGPMB_befor1 = new Date(this.dBGMB.getFullYear(), this.dBGMB.getMonth(), this.dBGMB.getDate() - 7);
    this.dGPMB_befor2 = new Date(this.dGPMB_befor1.getFullYear(), this.dGPMB_befor1.getMonth(), this.dGPMB_befor1.getDate() - 7);
    this.dGPMB_befor3 = new Date(this.dGPMB_befor2.getFullYear(), this.dGPMB_befor2.getMonth(), this.dGPMB_befor2.getDate() - 7);
    this.date_has_value = this.dBGMB;
    this.getDataChartJS(true);
  }
  onSelectDate() {
    this.dGPMB_befor1 = new Date(this.dBGMB.getFullYear(), this.dBGMB.getMonth(), this.dBGMB.getDate() - 7);
    this.dGPMB_befor2 = new Date(this.dGPMB_befor1.getFullYear(), this.dGPMB_befor1.getMonth(), this.dGPMB_befor1.getDate() - 7);
    this.dGPMB_befor3 = new Date(this.dGPMB_befor2.getFullYear(), this.dGPMB_befor2.getMonth(), this.dGPMB_befor2.getDate() - 7);
    this.getDataChartJS();
  }

  async getDataChartJS(isInit?: boolean) {
    this.isLoading = true;

    let url = this.utility.getGPMB_TheoHo(this.datePipe.transform(this.dBGMB, "yyyy-MM-dd"));
    const res = await this.service.getDataAsync(url);

    let url_tuanTruoc = this.utility.getGPMB_TheoHo(this.datePipe.transform(this.dGPMB_befor1, "yyyy-MM-dd"));
    const res_tuanTruoc = await this.service.getDataAsync(url_tuanTruoc);

    let url_tuanTruoc2 = this.utility.getGPMB_TheoHo(this.datePipe.transform(this.dGPMB_befor2, "yyyy-MM-dd"));
    const res_tuanTruoc2 = await this.service.getDataAsync(url_tuanTruoc2);

    let url_tuanTruoc3 = this.utility.getGPMB_TheoHo(this.datePipe.transform(this.dGPMB_befor3, "yyyy-MM-dd"));
    const res_tuanTruoc3 = await this.service.getDataAsync(url_tuanTruoc3);

    if ((res && res.length == 0) || (res_tuanTruoc && res_tuanTruoc.length == 0)) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Hộ dân đã bàn giao mặt bằng ngày ${this.datePipe.transform(this.dBGMB, "dd/MM/yyyy")}`
      });
      this.dBGMB = this.date_has_value;
      this.dGPMB_befor1 = new Date(this.dBGMB.getFullYear(), this.dBGMB.getMonth(), this.dBGMB.getDate() - 7)
      this.isLoading = false;
      return;
    }
    this.date_has_value = this.dBGMB;
    this.xulyData(res, res_tuanTruoc, res_tuanTruoc2, res_tuanTruoc3);
    this.updateHighchart();
    this.daySelected = isInit ? this.dataAll[0] : {};
    this.updateChart(this.daySelected);
    this.isLoading = false;

  }

  xulyData(_data: iBanGiao[], _dataBefor: iBanGiao[], _dataBefor2: iBanGiao[], _dataBefor3: iBanGiao[]) {
    this.lableBG = [];
    this.dataHoDan = [];
    this.dataSoHoBG = [];
    this.dataSoHoBG_befor = [];
    this.dataAll = [];
    for (let i = 0; i < _data.length; i++) {
      const element = _data[i];
      this.lableBG.push(element.ten_da);
      // this.dataHoDan.push(element.tonghd || 0);
      // this.dataSoHoBG.push(element.lk_da_gpmb || 0);
    }

    // for (let i = 0; i < _dataBefor.length; i++) {
    //   const element = _dataBefor[i];
    //   this.dataSoHoBG_befor.push(element.lk_da_gpmb || 0);
    // }

    for (let i = 0; i < this.lableBG.length; i++) {
      let _day3 = _dataBefor3.filter(p => p.ten_da.includes(this.lableBG[i]));
      let _hd3 = _day3[0].lk_da_gpmb || 0;

      let _day2 = _dataBefor2.filter(p => p.ten_da.includes(this.lableBG[i]));
      let _hd2 = _day2[0].lk_da_gpmb || 0;

      let _day1 = _dataBefor.filter(p => p.ten_da.includes(this.lableBG[i]));
      let _hd1 = _day1[0].lk_da_gpmb || 0;

      let _day = _data.filter(p => p.ten_da.includes(this.lableBG[i]));
      let _hd = _day[0].lk_da_gpmb || 0;
      let _TempPhanTram = ((_day[0].lk_da_gpmb || 0) / (_day[0].tonghd || 1)) * 100;
      let _phanTramW = parseFloat(_TempPhanTram.toFixed(2));

      let _tempData = {
        name: this.lableBG[i],
        marker: {
          symbol: 'circle',
        },
        color: '#CE7A58',
        data: [_hd3, _hd2, _hd1, _hd],
        index: i,
        percent: _phanTramW,
        sum: _day[0].tonghd || 0
      }
      this.dataAll.push(_tempData);
    }
    // console.log("dataAll", this.dataAll)
  }

  async onForward() {
    let i = this.daySelected.index;
    await this.getDataChartJS();
    if (i === (this.dataAll.length - 1)) {
      this.daySelected = this.dataAll[0];
    } else {
      this.daySelected = this.dataAll[i + 1];
    }
    setTimeout(() => {
      this.updateChart(this.daySelected);
    }, 100)
  }

  formater(value) {
    let temp = value.toString().replace('.', ',');
    temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return temp;
  }
  async onBack() {
    let i = this.daySelected.index;
    await this.getDataChartJS();
    if (i === 0) {
      this.daySelected = this.dataAll[this.dataAll.length - 1];
    } else {
      this.daySelected = this.dataAll[i - 1];
    }
    setTimeout(() => {
      this.updateChart(this.daySelected);
    }, 10);
  }

  updateChart(_series) {
    // console.log("updateChart", this.daySelected)
    if (!_series) return;
    const self = this,
      chart = this.chart;
    setTimeout(() => {
      self.chartOptions.series = _series
      self.updateFlag = true;
    }, 20);
  }
  updateHighchart() {
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptions = {
      chart: {
        type: 'area'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Hộ dân đã bàn giao mặt bằng so với tổng số hộ dân cần giải phóng mặt bằng tuần ${this.datePipe.transform(this.dBGMB, "w")}
        //  ngày ${this.datePipe.transform(this.dBGMB, "dd/MM/yyyy")} so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor1, "w")} (N-1)
        // </span>`,
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: [ `Tuần ${this.datePipe.transform(this.dGPMB_befor3, "w")}`, `Tuần ${this.datePipe.transform(this.dGPMB_befor2, "w")}` ,`Tuần ${this.datePipe.transform(this.dGPMB_befor1, "w")}`,
        `Tuần ${this.datePipe.transform(this.dBGMB, "w")}`],
        labels: {
          formatter: function () {
            let temp = this.value
            return `<span style="font-weight:600; font-size:20px; font-family: 'Montserrat';
            font-style: normal;color: #515151;">${temp}</span>`
          },
          y: 30
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "",
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      plotOptions: {
        series: {
          lineWidth: 6,
          fillOpacity: 0.1,
          states: {
            hover: {
              lineWidth: 4
            }
          },
          marker: {
            enabled: true,
            lineWidth: 12,
            lineColor: null,
          },
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%'
            useHTML: true,
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `<span style="font-family: 'Oswald';
              font-style: normal;
              font-weight: 600;
              font-size: 24px; color: #CE7A58;
              line-height: 36px;">${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>`
            }
          }
        },
      },
      series: [
      ]
    };
  }
  // updateHighchart() {
  //   this.highcharts.setOptions({
  //     chart: {
  //       style: {
  //         fontFamily: 'Open Sans',
  //       }
  //     }
  //   });
  //   this.chartOptions = {
  //     chart: {
  //       type: 'column'
  //     },
  //     title: {
  //       text: ""
  //       // useHTMl: true,
  //       // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
  //       // Hộ dân đã bàn giao mặt bằng so với tổng số hộ dân cần giải phóng mặt bằng tuần ${this.datePipe.transform(this.dBGMB, "w")}
  //       //  ngày ${this.datePipe.transform(this.dBGMB, "dd/MM/yyyy")} so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor1, "w")} (N-1)
  //       // </span>`,
  //     },
  //     xAxis: {
  //       categories: this.lableBG,
  //       crosshair: true,
  //       labels: {
  //         formatter: function () {
  //           return `<span style="font-weight:bold">${this.value}</span>`
  //         }
  //       },
  //     },
  //     yAxis: {
  //       min: 0,
  //       title: {
  //         useHTML: true,
  //         text: `<span style="font-weight:bold">Hộ dân</span>`,
  //       },
  //       labels: {
  //         formatter: function () {
  //           let temp = this.value.toString().replace('.', ',');
  //           temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  //           return `<span style="font-weight:bold">${temp}</span>`
  //         }
  //       },
  //     },
  //     legend: {
  //       squareSymbol: false,
  //       symbolWidth: 16,
  //       symbolHeight: 16,
  //       symbolRadius: 0
  //     },
  //     tooltip: {
  //       // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  //       // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //       //   '<td style="padding:0"><b>{point.y} hộ</b></td></tr>',
  //       // footerFormat: '</table>',
  //       // shared: true,
  //       // useHTML: true
  //       formatter: function () {
  //         let temp = this.y
  //         temp = temp.toString().replace('.', ',');
  //         return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  //       }
  //     },
  //     plotOptions: {
  //       column: {
  //         pointPadding: 0.2,
  //         borderWidth: 0
  //       },
  //       series: {
  //         borderWidth: 0,
  //         dataLabels: {
  //           enabled: true,
  //           // format: '{point.y:.1f}%'
  //           formatter: function () {
  //             let temp = this.y
  //             temp = temp.toString().replace('.', ',');
  //             return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  //           }
  //         }
  //       }
  //     },
  //     series: [{
  //       name: 'Tổng số hộ cần GPMB',
  //       data: this.dataHoDan,
  //       color: '#5899DA'

  //     }, {
  //       name: 'Số hộ đã bàn giao mặt bằng tuần này',
  //       data: this.dataSoHoBG,
  //       color: '#F39738'
  //     },
  //     {
  //       name: 'Số hộ đã bàn giao mặt bằng tuần trước',
  //       data: this.dataSoHoBG_befor,
  //       color: '#3AB5C2'
  //     },
  //     ]
  //   };
  // }

  /* takes a string phrase and breaks it into separate phrases 
   no bigger than 'maxwidth', breaks are made at complete words.*/

  formatLabel(str, maxwidth) {
    var sections = [];
    var words = str.split(" ");
    var temp = "";

    words.forEach(function (item, index) {
      if (temp.length > 0) {
        var concat = temp + ' ' + item;

        if (concat.length > maxwidth) {
          sections.push(temp);
          temp = "";
        }
        else {
          if (index == (words.length - 1)) {
            sections.push(concat);
            return;
          }
          else {
            temp = concat;
            return;
          }
        }
      }

      if (index == (words.length - 1)) {
        sections.push(item);
        return;
      }

      if (item.length < maxwidth) {
        temp = item;
      }
      else {
        sections.push(item);
      }

    });

    return sections;
  }

}
