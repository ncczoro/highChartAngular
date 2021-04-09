import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
import { emit } from 'process';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

interface iHoChua {
  ma_hochua: string;
  ten_hochua: string;
}
@Component({
  selector: 'app-ho-chua',
  templateUrl: './ho-chua.component.html',
  styleUrls: ['./ho-chua.component.css']
})
export class HoChuaComponent implements OnInit {

  dataHoChua: any
  option: any
  dHoChua: Date;

  highcharts = Highcharts;
  chartOptions: any;
  lstHoChua: any = [];
  dataLuuLuong: any = [];
  dataMucNuoc: any = [];
  isLoading: boolean = false;
  selectedHoChua: iHoChua;
  soNgay: number;
  ho_has_value: any;
  date_has_value: any;
  constructor(private router: Router, private datePipe: DatePipe, public service: CommonService,
    private utility: Utility, private messageService: MessageService) {

  }

  ngOnInit() {
    this.dHoChua = new Date();
    this.soNgay = 10;
    this.getListHoChua();
  }

  async getListHoChua() {
    try {
      this.lstHoChua = [];
      let res = await this.service.getDataAsync(this.utility.getHoChua());
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        this.lstHoChua.push({ label: element.ten_hochua, value: element })
      }
      this.selectedHoChua = this.lstHoChua[13].value;
      let _ngay = this.formartDatePT(this.dHoChua.getFullYear(), this.dHoChua.getMonth() + 1, this.dHoChua.getDate());
      this.ho_has_value = this.selectedHoChua;
      this.date_has_value = this.dHoChua;
      this.getDataHoChua_highChart(_ngay, parseInt(this.selectedHoChua.ma_hochua), this.soNgay);
    } catch (error) {
      console.log(error)
    }
  }

  onChageHoChua(event) {
    // console.log(this.selectedHoChua, typeof this.selectedHoChua)
    let _ngay = this.formartDatePT(this.dHoChua.getFullYear(), this.dHoChua.getMonth() + 1, this.dHoChua.getDate());
    this.getDataHoChua_highChart(_ngay, parseInt(this.selectedHoChua.ma_hochua), this.soNgay);
  }

  onSelectDate(event) {
    let _ngay = this.formartDatePT(this.dHoChua.getFullYear(), this.dHoChua.getMonth() + 1, this.dHoChua.getDate());
    this.getDataHoChua_highChart(_ngay, parseInt(this.selectedHoChua.ma_hochua), this.soNgay);
  }

  formartDatePT(year, month, date) {
    return `${year}-${month}-${date}`
  }

  async getDataHoChua_highChart(ngay: string, maHoChua: number, soNgay: number) {
    try {
      this.isLoading = true;
      const res = await this.service.getDataAsync(this.utility.getThuyVanHoChua(ngay, maHoChua, soNgay))
      if (res && res.length == 0) {
        this.messageService.add({
          severity: "warn",
          summary: "Không có dữ liệu!",
          detail: `Hồ ${this.selectedHoChua.ten_hochua} ngày ${this.datePipe.transform(this.dHoChua, "dd/MM/yyyy")}`
        });
        this.selectedHoChua = this.ho_has_value;
        this.dHoChua = this.date_has_value;
        this.isLoading = false;
        return;
      }
      this.ho_has_value = this.selectedHoChua;
      this.date_has_value = this.dHoChua;
      this.xulyData(res);
      this.updateChart();
      this.isLoading = false;
      // console.log("Ho chua", res)
    } catch (error) {
      this.selectedHoChua = this.ho_has_value;
      this.dHoChua = this.date_has_value;
      this.isLoading = false;
      console.log(error)
    }
  }
  xulyData(data) {
    this.dataLuuLuong = [];
    this.dataMucNuoc = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      this.dataLuuLuong.push(element.luu_luong);
      this.dataMucNuoc.push(element.muc_nuoc);
    }
  }
  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  updateChart() {
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    })
    this.chartOptions = {
      chart: {
        zoomType: 'xy'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;">TÌNH HÌNH THỦY VĂN HỒ CHỨA TRỌNG ĐIỂM HỒ 
        // <span style="text-transform:uppercase;font-family:'Montserrat'; color:#515151; font-weight: bold;">${this.selectedHoChua.ten_hochua} NGÀY ${this.datePipe.transform(this.dHoChua, "dd/MM/yyyy")}</span> </span>`
      },
      xAxis: {
        categories: ['D-10', 'D-9', 'D-8', 'D-7', 'D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1'],
        crosshair: true
      },
      plotOptions: {
        spline: {
          lineWidth: 6,
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

        },
      },
      yAxis: [
        {
          title: {
            useHTML: true,
            text: `<span style="color:#515151; font-weight:bold">Mực nước (m)</span>`,
            // style: {
            // color: '#515151'
            // }
          },
          labels: {
            format: `{value}`,
            style: {
              color: '#515151'
            },
            formatter: function () {
              let temp = this.value.toString().replace('.', ',');
              temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              return `<span style="font-weight:bold">${temp}</span>`
            }
          },
          opposite: true,

        },
        {
          labels: {
            format: '{value}',
            style: {
              color: '#5899DA'
            },
            formatter: function () {
              let temp = this.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              return `<span style="font-weight:bold">${temp}</span>`
            }
          },
          title: {
            useHTML: true,
            text: `<span style="color:#5899DA; font-weight:bold">Lưu lượng (m³/s)</span>`,
            // style: {
            // color: '#5899DA'
            // }
          }
        },
      ],
      tooltip: {
        // shared: true,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 30,
        symbolHeight: 16,
        symbolRadius: 0
      },
      series: [
        {
          name: 'Lưu lượng nước về (m³/s)',
          color: '#5899DA',
          type: 'column',
          yAxis: 1,
          data: this.dataLuuLuong,
          tooltip: {
            valueSuffix: ' m³/s'
          },

        },
        {
          name: 'Mực nước thượng lưu (m)',
          type: 'spline',
          color: '#515151',
          data: this.dataMucNuoc,
          tooltip: {
            valueSuffix: ' m'
          }
        }
      ]
    };
  }


  // getDataHoChua() {
  //   this.dataHoChua = {
  //     labels: ['D-10', 'D-9', 'D-8', 'D-7', 'D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1'],
  //     datasets: [
  //       {
  //         label: 'Lưu lượng nước về (m3/s)',
  //         backgroundColor: '#FFC107',
  //         borderColor: '#FFC107',
  //         data: [1288.917, 1072.25, 1077.583, 1034, 855.75, 713.25, 469.6667, 1427, 1709.5, 1086],
  //         order: 2,
  //       },
  //       {
  //         label: 'Mực nước thượng lưu(m)',
  //         type: 'line',
  //         fill: false,
  //         backgroundColor: '#03A9F4',
  //         borderColor: '#03A9F4',
  //         data: [96.76917, 96.57083, 96.34333, 96.2, 95.9575, 95.925, 96.06, 95.9475, 95.4525, 94.985].reverse(),
  //         order: 1,
  //       },

  //     ]
  //   };

  //   this.option = {
  //     legend: {
  //       display: true,
  //       position: 'bottom'
  //     }
  //   }
  // }

}
