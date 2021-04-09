import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
highcharts3D(Highcharts);
@Component({
  selector: 'app-thuong-pham',
  templateUrl: './thuong-pham.component.html',
  styleUrls: ['./thuong-pham.component.css']
})
export class ThuongPhamComponent implements OnInit {

  thuongPham: any;
  option: any;

  highcharts = Highcharts;
  chartOptions: any;
  cols: any;
  lstTPPT: any;
  isLoading: boolean = false;
  dataTP: any = [];
  legend: any = [];
  charColor: any = [];
  dThuongPham: Date;
  day_has_value: Date;
  strSumSL: string;
  constructor(private router: Router, public service: CommonService, private utility: Utility, private messageService: MessageService) {

  }

  ngOnInit() {
    let today = new Date();
    console.log("on", today.getDate() ,today.getMonth())
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1']
    if (today.getDate() >= 2) {
      this.dThuongPham = new Date(today.getFullYear(), today.getMonth() - 1, 15);
    } else {
      this.dThuongPham = new Date(today.getFullYear(), today.getMonth() - 2, 15);
    }
    this.day_has_value = this.dThuongPham;
    this.getDataTP_highChart();
  }

  onSelectDate() {
    this.getDataTP_highChart();
  }

  async getDataTP_highChart() {
    this.isLoading = true;
    const res = await this.service.getDataAsync(this.utility.GetTyTrong5Tp(this.dThuongPham.getFullYear(), this.dThuongPham.getMonth() + 1))
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Tỷ trọng thương phẩm theo 5 thành phần phụ tải tháng ${this.dThuongPham.getMonth() + 1}-${this.dThuongPham.getFullYear()}!`
      });
      this.dThuongPham = this.day_has_value;
      this.isLoading = false;
      return;
    }
    this.day_has_value = this.dThuongPham;
    // console.log("Thuong pham", res);
    this.xulyData(res);
    this.updateChart();
    this.isLoading = false;
  }

  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  xulyData(data) {
    this.dataTP = [];
    this.legend = [];
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += Math.round(data[i].sanLuong/ 1000);
    }
   let sumMW = Math.round(sum);
    this.strSumSL = this.stringFormat(sumMW);
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let _typleLH = []
      let _phanTram = (element.sanLuong / (sum * 1000)) * 100;
      _typleLH[0] = `${element.ten_phutai}`;
      _typleLH[1] = parseFloat(_phanTram.toFixed(2));
      this.legend.push({
        color: this.charColor[i],
        loai: element.ten_phutai,
        giatri: this.stringFormat(Math.round(element.sanLuong/1000)),
        phantram:  this.stringFormat(_typleLH[1]).concat('%')
    })
      this.dataTP.push(_typleLH);
    }
    // console.log("data TP", this.dataTP)
  }

  updateChart() {
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      },
      colors: this.charColor
    });
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        useHTML: true,
        text: `<span style="font-family: 'Oswald';
          font-style: normal;
          font-weight: 600;
          font-size: 36px;
          line-height: 54px;
          color: #CE7A58;">${this.strSumSL}`,
        align: 'center',
        verticalAlign: 'middle',
        y: 80
      },
      tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.key}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
        }
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            // format: '{point.name} ({point.percentage:.2f}%)',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return ` <span style="font-size:12px; white-space: nowrap">${this.key}</span>`
            },
            style: {
              color: '#515151',
              // width: '120px',
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '130%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Tỷ lệ',
        innerSize: '50%',
        data: this.dataTP,
      }]
      
    };
    // this.chartOptions = {
    //   chart: {
    //     type: 'pie',
    //     options3d: {
    //       enabled: true,
    //       alpha: 65,
    //       beta: 0,
    //     }
    //   },
    //   title: {
    //     useHTML: true,
    //     text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;">TỶ TRỌNG THƯƠNG PHẨM THEO 5 THÀNH PHẦN PHỤ TẢI THÁNG ${this.dThuongPham.getMonth() + 1}-${this.dThuongPham.getFullYear()}</span>`

    //     // text: `Tỷ trọng thương phẩm theo 5 thành phần phụ tải tháng ${this.dThuongPham.getMonth()+1}-${this.dThuongPham.getFullYear()}`
    //   },
    //   subtitle: {
    //     useHTML: true,
    //     text: `<span style="font-family:'Open Sans'; color:#8C8C8C; font-weight: bold; font-size:18px">Tổng sản lượng điện thương phẩm <span style="color:#219653; font-family:'Oswald'">${this.strSumSL} MWh</span></span>`
    //   },
    //   tooltip: {
    //     // pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
    //     formatter: function () {
    //       let temp = this.y
    //       temp = temp.toString().replace('.', ',');
    //       return ` <span>${this.key} MWh</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
    //     }
    //   },
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       cursor: 'pointer',
    //       depth: 35,
    //       dataLabels: {
    //         enabled: true,
    //         // format: '{point.name} ({point.percentage:.2f}%)',
    //         formatter: function () {
    //           let temp = this.y
    //           temp = temp.toString().replace('.', ',');
    //           return ` <span>${this.key}</span><br/> (${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%)`
    //         },
    //         style: {
    //           color: '#8C8C8C',
    //           fontsize: '11',
    //           width: '100px',
    //         }
    //       }
    //     }
    //   },
    //   events: {
    //     load: function () {
    //       let categoryHeight = 35;
    //       this.update({
    //         chart: {
    //           height: categoryHeight * this.pointCount + (this.chartHeight - this.plotHeight)
    //         }
    //       })
    //     }
    //   },
    //   series: [{
    //     type: 'pie',
    //     name: 'Tỷ lệ',
    //     data: this.dataTP
    //   }]
    // };
  }

  }