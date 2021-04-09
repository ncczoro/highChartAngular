import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

interface iGiaiPhong {
  ma_da: string;
  ten_da: string;
  tongdt_gpmb: number;
  lk_da_gpmb: number;
  ngaythang: string;
}
@Component({
  selector: 'app-giai-phong-mb',
  templateUrl: './giai-phong-mb.component.html',
  styleUrls: ['./giai-phong-mb.component.css']
})
export class GiaiPhongMbComponent implements OnInit {
  highcharts = Highcharts;
  chartOptions: any = {};
  @Input() fonSize = 16;

  dataTKD: any;
  optionTKD: any;
  dGPMB: Date;
  date_has_value: Date;
  dGPMB_befor1: Date;
  dGPMB_befor2: Date;
  dGPMB_befor3: Date;
  isLoading: boolean = false;
  lableGP: any = [];
  dataTuanNay: any = [];
  dataTuanTruoc: any = [];
  dataTuanTruoc2: any = [];
  dataTuanTruoc3: any = [];
  dataAll: any = [];
  charColor: any = [];

  chart;
  updateFlag = false;
  chartConstructor = "chart";
  chartCallback;
  constructor(private router: Router, public service: CommonService, private utility: Utility, private datePipe: DatePipe, private messageService: MessageService) {
    const self = this;

    this.chartCallback = chart => {
      // saving chart reference
      self.chart = chart;
    };
  }

  ngOnInit() {
    let today = new Date();
    this.dGPMB = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 1));
    this.dGPMB_befor1 = new Date(this.dGPMB.getFullYear(), this.dGPMB.getMonth(), this.dGPMB.getDate() - 7)
    this.dGPMB_befor2 = new Date(this.dGPMB_befor1.getFullYear(), this.dGPMB_befor1.getMonth(), this.dGPMB_befor1.getDate() - 7)
    this.dGPMB_befor3 = new Date(this.dGPMB_befor2.getFullYear(), this.dGPMB_befor2.getMonth(), this.dGPMB_befor2.getDate() - 7)
    this.date_has_value = this.dGPMB;
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1']
    this.getDataHighChart();
    this.updateHighChart()
  }
  onSelectDate() {
    this.dGPMB_befor1 = new Date(this.dGPMB.getFullYear(), this.dGPMB.getMonth(), this.dGPMB.getDate() - 7)
    this.dGPMB_befor2 = new Date(this.dGPMB_befor1.getFullYear(), this.dGPMB_befor1.getMonth(), this.dGPMB_befor1.getDate() - 7)
    this.dGPMB_befor3 = new Date(this.dGPMB_befor2.getFullYear(), this.dGPMB_befor2.getMonth(), this.dGPMB_befor2.getDate() - 7)
    this.getDataHighChart();
  }

  async getDataHighChart() {
    this.isLoading = true;
    let url = this.utility.getGPMB_TheoDienTich(this.datePipe.transform(this.dGPMB, "yyyy-MM-dd"));
    const res = await this.service.getDataAsync(url);
    let url_tuanTruoc = this.utility.getGPMB_TheoDienTich(this.datePipe.transform(this.dGPMB_befor1, "yyyy-MM-dd"));
    const res_tuanTruoc = await this.service.getDataAsync(url_tuanTruoc);
    let url_tuanTruoc2 = this.utility.getGPMB_TheoDienTich(this.datePipe.transform(this.dGPMB_befor2, "yyyy-MM-dd"));
    const res_tuanTruoc2 = await this.service.getDataAsync(url_tuanTruoc2);
    let url_tuanTruoc3 = this.utility.getGPMB_TheoDienTich(this.datePipe.transform(this.dGPMB_befor3, "yyyy-MM-dd"));
    const res_tuanTruoc3 = await this.service.getDataAsync(url_tuanTruoc3);

    if ((res && res.length == 0) || (res_tuanTruoc && res_tuanTruoc.length == 0) || (res_tuanTruoc2 && res_tuanTruoc2.length == 0) || (res_tuanTruoc3 && res_tuanTruoc3.length == 0)) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Tỷ lệ giải phóng mặt bằng/ tổng diện tích ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")}`
      });
      this.dGPMB = this.date_has_value;
      this.dGPMB_befor1 = new Date(this.dGPMB.getFullYear(), this.dGPMB.getMonth(), this.dGPMB.getDate() - 7)
      this.dGPMB_befor2 = new Date(this.dGPMB_befor1.getFullYear(), this.dGPMB_befor1.getMonth(), this.dGPMB_befor1.getDate() - 7)
      this.dGPMB_befor3 = new Date(this.dGPMB_befor2.getFullYear(), this.dGPMB_befor2.getMonth(), this.dGPMB_befor2.getDate() - 7)
      this.isLoading = false;
      return;
    }
    this.date_has_value = this.dGPMB;
    this.xulyData(res, res_tuanTruoc, res_tuanTruoc2, res_tuanTruoc3);
    this.isLoading = false;
    // console.log("giai phong mb", res);
    // console.log("giai phong mb befor", res_tuanTruoc);
  }
  updateChart(_series) {
    const self = this,
      chart = this.chart;

    chart.showLoading();
    setTimeout(() => {
      chart.hideLoading();

      self.chartOptions.series = _series

      self.updateFlag = true;
    }, 100);
  }
  xulyData(_data: iGiaiPhong[], _dataBefor: iGiaiPhong[], _dataBefor2: iGiaiPhong[], _dataBefor3: iGiaiPhong[]) {
    this.lableGP = [];
    this.dataTuanNay = [];
    this.dataTuanTruoc = [];
    this.dataTuanTruoc2 = [];
    this.dataTuanTruoc3 = [];
    this.dataAll = [];
    for (let i = 0; i < _data.length; i++) {
      const element = _data[i];
      this.lableGP.push(element.ten_da);
      let _phanTram = ((element.lk_da_gpmb || 0) / (element.tongdt_gpmb || 1)) * 100;
      this.dataTuanNay.push(parseFloat(_phanTram.toFixed(2)));
    }
    /* Phan tinh toan theo bieu do cu
    for (let i = 0; i < _dataBefor.length; i++) {
      const element = _dataBefor[i];
      let _phanTram = ((element.lk_da_gpmb || 0) / (element.tongdt_gpmb || 1)) * 100;
      this.dataTuanTruoc.push(parseFloat(_phanTram.toFixed(2)));
    }
    for (let i = 0; i < _dataBefor2.length; i++) {
      const element = _dataBefor2[i];
      let _phanTram = ((element.lk_da_gpmb || 0) / (element.tongdt_gpmb || 1)) * 100;
      this.dataTuanTruoc2.push(parseFloat(_phanTram.toFixed(2)));
    }
    for (let i = 0; i < _dataBefor3.length; i++) {
      const element = _dataBefor3[i];
      let _phanTram = ((element.lk_da_gpmb || 0) / (element.tongdt_gpmb || 1)) * 100;
      this.dataTuanTruoc3.push(parseFloat(_phanTram.toFixed(2)));
    } */

    // Tinh toan theo bieu do moi
    for (let i = 0; i < this.lableGP.length; i++) {
      let _day3 = _dataBefor3.filter(p => p.ten_da.includes(this.lableGP[i]))
      let _TempPhanTram3 = ((_day3[0].lk_da_gpmb || 0) / (_day3[0].tongdt_gpmb || 1)) * 100;
      let _phanTramW3 = parseFloat(_TempPhanTram3.toFixed(2));

      let _day2 = _dataBefor2.filter(p => p.ten_da.includes(this.lableGP[i]))
      let _TempPhanTram2 = ((_day2[0].lk_da_gpmb || 0) / (_day2[0].tongdt_gpmb || 1)) * 100;
      let _phanTramW2 = parseFloat(_TempPhanTram2.toFixed(2));

      let _day1 = _dataBefor.filter(p => p.ten_da.includes(this.lableGP[i]))
      let _TempPhanTram1 = ((_day1[0].lk_da_gpmb || 0) / (_day1[0].tongdt_gpmb || 1)) * 100;
      let _phanTramW1 = parseFloat(_TempPhanTram1.toFixed(2));

      let _day = _data.filter(p => p.ten_da.includes(this.lableGP[i]))
      let _TempPhanTram = ((_day[0].lk_da_gpmb || 0) / (_day[0].tongdt_gpmb || 1)) * 100;
      let _phanTramW = parseFloat(_TempPhanTram.toFixed(2));

      let _tempData = {
        name: this.lableGP[i],
        marker: {
          symbol: 'circle',
        },
        data: [_phanTramW3, _phanTramW2, _phanTramW1, _phanTramW]
      }
      this.dataAll.push(_tempData);
    }
    this.updateHighChart();
    this.updateChart(this.dataAll);
  }

  updateHighChart() {
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      },
      colors: this.charColor
    });
    this.chartOptions = {
      // chart: {
      //   type: "spline"
      // },
      title: {
        text: ""
      },
      xAxis: {
        categories: [`Tuần ${this.datePipe.transform(this.dGPMB_befor3, "w")}`, `Tuần ${this.datePipe.transform(this.dGPMB_befor2, "w")}`, `Tuần ${this.datePipe.transform(this.dGPMB_befor1, "w")}`,
        `Tuần ${this.datePipe.transform(this.dGPMB, "w")}`],
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
        title: {
          text: ""
        },
        max: 100,
        tickAmount: 5,
        labels: {
          formatter: function () {
            let temp = this.value
            return `<span style="font-weight:600; font-size:16px; font-family: 'Montserrat';
            font-style: normal;color: #8C8C8C">${temp}%</span>`
          }
        },
      },
      tooltip: {
        valueSuffix: " %"
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        symbolPadding: 30,
        symbolWidth: 40,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        itemMarginTop: 50,
        // itemWidth: 400,
        itemStyle: {
          height: '10vh',
          // lineWidth : '10vh',
          // whiteSpace: 'break-spaces'
          // lineHeight: '10vh',

        },
        useHTML: true,
        labelFormatter: function () {
          let temp = this.name.split(';')
          if (temp.length > 1) {
            return `<span style="font-weight:600; font-size:20px; font-family: 'Open Sans';
            font-style: normal;color: #515151;">${temp[0]}</span> <br/>
            <span style="font-weight:600; font-size:20px; font-family: 'Open Sans';
            font-style: normal;color: #515151;">${temp[1]}</span>
            `
          } else {
            return `<span style="font-weight:600; font-size:20px; font-family: 'Open Sans';
            font-style: normal;color: #515151;">${temp[0]}</span>
            `
          }
        },
      },
      plotOptions: {
        series: {
          lineWidth: 8,
          states: {
            hover: {
              lineWidth: 4
            }
          },
          marker: {
            enabled: true,
            // fillColor: '#FFFFFF',
            lineWidth: 12,
            lineColor: null,
          },
        }
      },
      series: []
    }
  }

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

  // updateHighChart() {
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
  //       // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
  //       // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor1, "w")} (N-1) </span>`,
  //     },
  //     xAxis: {
  //       categories: this.lableGP,
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
  //         text: `<span style="font-weight:bold">%</span>`,
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
  //       // shared: true,
  //       // useHTML: true,
  //       // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
  //       // pointFormat: `<tr>
  //       //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
  //       //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
  //       //               </tr>`,
  //       formatter: function () {
  //         let temp = this.y
  //         temp = temp.toString().replace('.', ',');
  //         return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
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
  //           // format: '{point.y:.1f}%',
  //           formatter: function () {
  //             let temp = this.y
  //             temp = temp.toString().replace('.', ',');
  //             return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
  //           }

  //         }
  //       }
  //     },
  //     series: [{
  //       name: 'Tuần này',
  //       data: this.dataTuanNay,
  //       color: '#F39738'
  //     }, {
  //       name: 'Tuần trước',
  //       data: this.dataTuanTruoc,
  //       color: '#5899DA'
  //     }]
  //   };
  // }
}
