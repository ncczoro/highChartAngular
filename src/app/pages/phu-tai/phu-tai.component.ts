import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
import { LoadingComponent } from '../loading/loading.component'
import { fromEventPattern } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
// import * as highchartsTreemap from 'highcharts/modules/treemap';
// highchartsTreemap(Highcharts);

export interface iPhuTai {
  mien: string,
  ngay: string,
  thoiDiem: Date,
  giaTri: number
}

@Component({
  selector: 'app-phu-tai',
  templateUrl: './phu-tai.component.html',
  styleUrls: ['./phu-tai.component.css']
})



export class PhuTaiComponent implements OnInit {

  highcharts = Highcharts;
  chartOptions: any;
  dataPhuTai: any;
  optionPT: any;
  today: Date = new Date();
  dataQG: number[] = [];
  dataBac: number[] = [];
  dataTrung: number[] = [];
  dataNam: number[] = [];
  pMax: string;
  isLoading: boolean = false;
  dPhuTai: Date;
  dHasValue: Date;
  iTQ_max: number; 
  iNam_max: number;
  iBac_max: number;
  iTrung_max: number
  constructor(public service: CommonService, private utility: Utility,
    private messageService: MessageService, private router: Router,
    private datePipe: DatePipe) { }

  ngOnInit() {
    let today = new Date();
    this.dPhuTai = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    this.dHasValue = this.dPhuTai;
    this.getDataPT_highChart();
  }

  onSelectDate(event) {
    this.getDataPT_highChart();
  }
  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  
  async getDataPT_highChart() {
    this.isLoading = true;
    let url = this.utility.GetPhuTai(this.datePipe.transform(this.dPhuTai, "yyyy-MM-dd"));
    const res = await this.service.getDataAsync(url);
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Kh??ng c?? d??? li???u!",
        detail: `Ph??? t???i ng??y ${this.datePipe.transform(this.dPhuTai, "dd/MM/yyyy")}`
      });
      this.dPhuTai = this.dHasValue;
      this.isLoading = false;
      return;
    }
    this.dHasValue = this.dPhuTai;
    // console.log("Phu Tai", res);
    this.xulyData(res);
    this.updateChart();
    this.isLoading = false;
  }
  xulyData(data) {
    this.dataQG = []; this.dataBac = []; this.dataNam = []; this.dataTrung = [];
    let quocGia = data.filter(p => p.mien.indexOf("gia") > 0);
    quocGia.forEach(element => {
      this.dataQG.push(element.giaTri)
    });
    this.iTQ_max = Math.max(...this.dataQG);

    let bac = data.filter(p => p.mien == "B???c");
    bac.forEach(element => {
      this.dataBac.push(element.giaTri)
    });
    this.iBac_max = Math.max(...this.dataBac);

    let trung = data.filter(p => p.mien == "Trung")
    trung.forEach(element => {
      this.dataTrung.push(element.giaTri)
    });
    this.iTrung_max = Math.max(...this.dataTrung);

    let nam = data.filter(p => p.mien == "Nam");
    nam.forEach(element => {
      this.dataNam.push(element.giaTri)
    });
    this.iNam_max = Math.max(...this.dataNam);
  }

  updateChart() {
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptions = {
      chart: {
        type: 'spline'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Bi???u ????? c??ng su???t ph??? t???i ng??y ${this.datePipe.transform(this.dPhuTai, "dd/MM/yyyy")}</span>`
      },
      // subtitle: {
      //   useHTMl: true,
      //   text: `<span style="font-family:'Open Sans'; color:#8C8C8C; font-weight: bold; font-size:18px;text-transform:uppercase">
      //   P max = <span style="color:#219653; font-family:'Oswald';font-size:18px">${this.pMax} MW</span></span>`
      // },
      xAxis: {
        // type: 'datetime',
        labels: {
          overflow: 'justify'
        }
      },
      legend: {
        // backgroundColor: '#FCFFC5',
        // borderColor: '#C98657',
        // borderWidth: 1,
        // borderRadius: 3,
        symbolWidth: 40
      },
      yAxis: {
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold">MW</span>`
        },
        tickInterval: 3000,     
        labels: {
          formatter: function () {
            // console.log(this)
            let temp = this.value
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return  `<span style="font-weight:bold; font-size:12px">${temp}</span>`
          }
        }
        // min: 1,
        // minorGridLineWidth: 1,
        // gridLineWidth: 1,
        // alternateGridColor: null,
      },
      tooltip: {
        //   valueSuffix: ' MW',
        //   shared: true,
        //   useHTML: true,
        //   headerFormat: '<small>{point.key}h</small><table>',
        //   pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
        //       '<td style="text-align: right"><b>{point.y}</b></td></tr>',
        //   footerFormat: '</table>',
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}h</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} MW`
        }
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
          // pointInterval: 3600000, // one hour
          pointInterval: 1, // one hour
          pointStart: 0,

        },
        // series: {

        // }
      },
      series: [
        {
          name: 'To??n Qu???c',
          color: '#5899DA',
          data: this.dataQG,
          marker: {
            symbol: 'circle',
          },
          dataLabels: {
            enabled: true,
            filter: {
              property: 'y',
              operator: '==',
              value: this.iTQ_max
            },
            // align: "left",
            formatter: function () {
              let temp = this.y.toString().replace('.', ',');
              temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
             return `<span style="font-size:26px;color:#5899DA">${this.x}h | ${temp} MW</span>`
            }
          }
        },
        {
          name: 'Mi???n B???c',
          color: '#F39738',
          data: this.dataBac,
          marker: {
            symbol: 'circle',
          },
          dataLabels: {
            enabled: true,
            filter: {
              property: 'y',
              operator: '==',
              value: this.iBac_max
            },
            // align: "left",
            y: -34,
            formatter: function () {
              let temp = this.y.toString().replace('.', ',');
              temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
             return `<span style="font-size:26px;color:#F39738">${this.x}h | ${temp} MW</span>`
            }
          }
        },
        {
          name: 'Mi???n Trung',
          color: '#3AB5C2',
          data: this.dataTrung,
          marker: {
            symbol: 'circle',
          },
          dataLabels: {
            enabled: true,
            filter: {
              property: 'y',
              operator: '==',
              value: this.iTrung_max
            },
            // align: "left",
            formatter: function () {
              let temp = this.y.toString().replace('.', ',');
              temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
             return `<span style="font-size:26px;color:#3AB5C2">${this.x}h | ${temp} MW</span>`
            }
          }
        },
        {
          name: 'Mi???n Nam',
          color: '#9685D9',
          data: this.dataNam,
          marker: {
            symbol: 'circle',
          },
          dataLabels: {
            enabled: true,
            filter: {
              property: 'y',
              operator: '==',
              value: this.iNam_max
            },
            // align: "left",
            formatter: function () {
              let temp = this.y.toString().replace('.', ',');
              temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
             return `<span style="font-size:26px;color:#9685D9">${this.x}h | ${temp} MW</span>`
            }
          }
        },
      ],
      navigation: {
        menuItemStyle: {
          fontSize: '12px'
        }
      }
    };
  }

}
