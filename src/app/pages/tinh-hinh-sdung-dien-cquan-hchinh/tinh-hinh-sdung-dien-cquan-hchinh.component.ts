declare var require: any;
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';

import * as Highcharts from 'highcharts';
import MapModule from 'highcharts/modules/map';
import { Options } from "highcharts";
import map from 'highcharts/modules/map'
import { Route, Router } from '@angular/router';
import { VietNamMap } from './VietNamMap';
const VietNam = require('@highcharts/map-collection/countries/vn/vn-all.geo.json');
MapModule(Highcharts);

interface iCQHC {
  maDvqly: string;
  tenTinh: string;
  sluongT: number;
  sluongCkyT: number;
  sluongG: number;
  sluongCkyG: number;
  nhom: string;
  soKhSdT: number;
  soKhSdG: number;
  thang: number;
  nam: number;
}
@Component({
  selector: 'app-tinh-hinh-sdung-dien-cquan-hchinh',
  templateUrl: './tinh-hinh-sdung-dien-cquan-hchinh.component.html',
  styleUrls: ['./tinh-hinh-sdung-dien-cquan-hchinh.component.css']
})
export class TinhHinhSdungDienCquanHchinhComponent implements OnInit {

  dataTKD: any;
  optionTKD: any;

  highcharts = Highcharts;
  chartOptions: any;
  chartOptions5T: any;
  isLoading: boolean = false;
  dCQHC: Date;
  date_has_value: Date;
  dataLable: any = [];
  dataLableG: any = [];
  dataKhTang: any = [];
  dataKhGiam: any = [];
  dataAll: any = [];
  dataDp: any = [];
  lstKH: any = [];
  entity: any = {};
  pointCurrent: any = {};
  selectedKH: any;
  state: string;

  chartConstructor = "mapChart";
  chart;
  updateFlag = false;
  chartCallback;
  constructor(public service: CommonService, private utility: Utility, private messageService: MessageService, private _route: Router, private vietNamMap: VietNamMap) {
    console.log("route", _route.routerState.snapshot.url)
    if (_route.routerState.snapshot.url.includes("cquan-hchinh"))
      this.state = 'CQ';
    else
      this.state = 'TD';

    const self = this;
    this.chartCallback = chart => {
      // saving chart reference
      self.chart = chart;
    };
  }

  ngOnInit() {
    let today = new Date();
    if (today.getDate() >= 2) {
      this.dCQHC = new Date(today.getFullYear(), today.getMonth() - 1, 15);
    } else {
      this.dCQHC = new Date(today.getFullYear(), today.getMonth() - 2, 15);
    }
    this.setInit();
    this.date_has_value = this.dCQHC;
    this.getDataTKD_highCharts();
  }
  setInit() {
    this.lstKH = [{ label: "Kh??ch h??ng t??ng", value: "T" }, { label: "Kh??ch h??ng gi???m", value: "G" }];
    this.entity.TinhHT = "H?? N???i";
    this.dataDp = [
      ['vn-3655', 0],
      ['vn-qn', 1],
      ['vn-kh', 2],
      ['vn-tg', 3],
      ['vn-bv', 4],
      ['vn-bu', 5],
      ['vn-hc', 6],
      ['vn-br', 7],
      ['vn-st', 8],
      ['vn-pt', 9],
      ['vn-yb', 10],
      ['vn-hd', 11],
      ['vn-bn', 12],
      ['vn-317', 13],
      ['vn-nb', 14],
      ['vn-hm', 15],
      ['vn-ho', 16],
      ['vn-vc', 17],
      ['vn-318', 18],
      ['vn-bg', 19],
      ['vn-tb', 20],
      ['vn-ld', 21],
      ['vn-bp', 22],
      ['vn-py', 23],
      ['vn-bd', 24],
      ['vn-724', 25],
      ['vn-qg', 26],
      ['vn-331', 27],
      ['vn-dt', 28],
      ['vn-la', 29],
      ['vn-3623', 30],
      ['vn-337', 31],
      ['vn-bl', 32],
      ['vn-vl', 33],
      ['vn-tn', 34],
      ['vn-ty', 35],
      ['vn-li', 36],
      ['vn-311', 37],
      ['vn-hg', 38],
      ['vn-nd', 39],
      ['vn-328', 40],
      ['vn-na', 41],
      ['vn-qb', 42],
      ['vn-723', 43],
      ['vn-nt', 44],
      ['vn-6365', 45],
      ['vn-299', 46],
      ['vn-300', 47],
      ['vn-qt', 48],
      ['vn-tt', 49],
      ['vn-da', 50],
      ['vn-ag', 51],
      ['vn-cm', 52],
      ['vn-tv', 53],
      ['vn-cb', 54],
      ['vn-kg', 55],
      ['vn-lo', 56],
      ['vn-db', 57],
      ['vn-ls', 58],
      ['vn-th', 59],
      ['vn-307', 60],
      ['vn-tq', 61],
      ['vn-bi', 62],
      ['vn-333', 63]
    ];
  }
  onSelectDate() {
    this.getDataTKD_highCharts();
  }

  async getDataTKD_highCharts() {
    this.isLoading = true;
    let res;
    if (this.state == 'CQ') {
      res = await this.service.getDataAsync(this.utility.Get_CQHC(this.dCQHC.getFullYear(), this.dCQHC.getMonth() + 1));
    } else {
      res = await this.service.getDataAsync(this.utility.Get_KHTD(this.dCQHC.getFullYear(), this.dCQHC.getMonth() + 1));
    }
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Kh??ng c?? d??? li???u!",
        detail: `Th??ng ${this.dCQHC.getMonth() + 1} n??m ${this.dCQHC.getFullYear()}`
      });
      if (this.state == 'CQ') {
        res = await this.service.getDataAsync(this.utility.Get_CQHC(2020, 12));
        this.date_has_value = new Date("12/12/2020");
      } else {
        res = await this.service.getDataAsync(this.utility.Get_KHTD(2020, 12));
        this.date_has_value = new Date("12/12/2020");
      }
      this.dCQHC = this.date_has_value;
      this.isLoading = false;
      if (res && res.length == 0) { return; }
      // return;
    }
    this.date_has_value = this.dCQHC;
    this.dataAll = res;
    let _haNoi = this.dataAll.filter(p => p.tenTinh.toLowerCase().includes("h?? n???i"))
    this.entity.khTang = _haNoi[0].soKhSdT;
    this.entity.khGiam = _haNoi[0].soKhSdG;
    this.selectedKH = 'T'
    // console.log("CQHC", this.dataAll);
    this.xulyData(res);
    this.updateChart();
    this.updateChart5T();
    this.updateColor('H?? N???I');
    this.isLoading = false;

  }

  xulyData(data: iCQHC[]) {
    this.dataLable = []; this.dataKhGiam = []; this.dataKhTang = []; this.dataLableG = []
    let dataT = data.sort((a, b) => a.soKhSdT - b.soKhSdT);
    dataT.reverse();
    for (let i = 0; i < 5; i++) {
      const element = dataT[i];
      this.dataLable.push(element.tenTinh);
      this.dataKhTang.push(element.soKhSdT);
    }
    let dataG = data.sort((a, b) => a.soKhSdG - b.soKhSdG);
    dataG.reverse();
    for (let i = 0; i < 5; i++) {
      const element = dataG[i];
      this.dataLableG.push(element.tenTinh);
      this.dataKhGiam.push(element.soKhSdG);
    }
  }
  updateColor(tinh) {
    const self = this,
      chart = this.chart;
    setTimeout(() => {
      // this.chartOptions.series[0].data.forEach(element => {
      //   element.color = '#5899DA';
      // });
      // console.log("color", this.chartOptions.series[0])
      this.chartOptions.series[0].data[18].color = tinh.includes('H?? N???I') ? '#F39738' : 'rgb(181, 196, 225)'
      this.chartOptions.series[0].data[50].color = 'rgb(181, 196, 225)';
      this.chartOptions.series[0].data[2].color = 'rgb(181, 196, 225)';
      self.updateFlag = true;
    }, 100);
  }

  updateChart() {
    try {
      this.highcharts.setOptions({
        chart: {
          style: {
            fontFamily: 'Open Sans',
          }
        },
        colors: ['5899DA', '82B3E3', 'ABCCEC', 'D5E5F6']
      });
      this.chartOptions = {
        chart: {
          map: this.vietNamMap.map,
          // map: VietNam as any,
          // events: {
          //   load: function () {
          //     // set init selected Ha Noi
          //     console.log("lod", this)
          //     this.series[0].data[10].color = '#219653'
          //     this.update({
          //       series: [{
          //         data: this.series[0].data
          //       }]
          //     })
          //   }
          // }
        },
        title: {
          text: ""
        },
        tooltip: {
          enabled: true,
          formatter: function () {
            // console.log("tooltip", this)
            let temp = this.point.value
            switch (temp) {
              case 1:
                return 'QU???NG NINH'
              case 2:
                return 'KH??NH H??A'
              case 3:
                return 'TI???N GIANG'
              case 4:
                return 'B?? R???A - V??NG T??U'
              case 5:
                return 'B??NH THU???N'
              case 6:
                return 'TP.H??? CH?? MINH'
              case 7:
                return 'B???N TRE'
              case 8:
                return 'SOC TR??NG'
              case 9:
                return 'PH?? TH???'
              case 10:
                return 'Y??N B??I'
              case 11:
                return 'H???I D????NG'
              case 12:
                return 'B???C NINH'
              case 13:
                return 'H??NG Y??N'
              case 14:
                return 'NINH B??NH'
              case 15:
                return 'H?? NAM'
              case 16:
                return 'H??A B??NH'
              case 17:
                return 'V??NH PH??C'
              case 18:
                return 'H?? N???I'
              case 19:
                return 'B???C GIANG'
              case 20:
                return 'TH??I B??NH'
              case 21:
                return 'L??M ?????NG'
              case 22:
                return 'B??NH PH?????C'
              case 23:
                return 'PH?? Y??N'
              case 24:
                return 'B??NH ?????NH'
              case 25:
                return 'GIA LAI'
              case 26:
                return 'QU??NG NG??I'
              case 27:
                return '?????NG NAI'
              case 28:
                return '?????NG TH??P'
              case 29:
                return 'LONG AN'
              case 30:
                return 'H???I PH??NG'
              case 31:
                return 'H???U GIANG'
              case 32:
                return 'B???C LI??U'
              case 33:
                return 'V??NH LONG'
              case 34:
                return 'T??Y NINH'
              case 35:
                return 'TH??I NGUY??N'
              case 36:
                return 'LAI CH??U'
              case 37:
                return 'S??N LA'
              case 38:
                return 'H?? GIANG'
              case 39:
                return 'NAM ?????NH'
              case 40:
                return 'H?? T??NH'
              case 41:
                return 'NGH??? AN'
              case 42:
                return 'QU???NG B??NH'
              case 43:
                return 'DAK LAK'
              case 44:
                return 'NINH THU???N'
              case 45:
                return 'DAK N??NG'
              case 46:
                return 'KON TUM'
              case 47:
              case 0:
                return 'QU???NG NAM'
              case 48:
                return 'QU???NG TR???'
              case 49:
                return 'TH???A THI??N-HU???'
              case 50:
                return '???? N???NG'
              case 51:
                return 'AN GIANG'
              case 52:
                return 'C??U MAU'
              case 53:
                return 'TR?? VINH'
              case 54:
                return 'CAO B???NG'
              case 55:
                return 'KI??N GIANG'
              case 56:
                return 'L??O CAI'
              case 57:
                return '??I???N BI??N'
              case 58:
                return 'L???NG S??N'
              case 59:
                return 'THANH H??A'
              case 60:
                return 'B???C K???N'
              case 61:
                return 'TUY??N QUANG'
              case 62:
                return 'B??NH D????NG'
              case 63:
                return 'C???N TH??'
              default:
                return 'H?? N???I'
            }
          }
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            alignTo: "spacingBox"
          }
        },
        legend: {
          enabled: false
        },
        colorAxis: {
          min: 0
        },
        series: [{
          type: "map",
          // name: "Random data",
          allowPointSelect: true,
          allAreas: false,
          cursor: 'pointer',
          data: this.dataDp,
          states: {
            hover: {
              color: "#BADA55"
            },
            select: {
              color: '#F39738',
              // borderColor: 'black',
              // dashStyle: 'dot'
            }
          },
          // events: {
          //   click: (e) => {
          //     // console.log("select", e);
          //     e.point.color = 'green'
          //     this.fillData(e.point);
          //   }
          // }
        }],
        plotOptions: {
          series: {
            point: {
              events: {
                select: (e) => {
                  // console.log("select", e);
                  this.fillData(e.target);
                },
                unselect: function () {
                  // console.log("Unselect");
                }
              }
            }
          },
        },
        selected: true,
        showCheckbox: true
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  fillData(data) {
    // console.log("dataOut", data)
    this.entity.TinhHT = this.service.paserName(data.value);
    let _tinh = data.value == 6 ? 'HCM' : this.service.paserName(data.value)
    let _tinhSelected = this.dataAll.filter(p => p.tenTinh.toUpperCase().includes(_tinh));
    if (_tinhSelected.length > 0) {
      this.entity.khTang = _tinhSelected[0].soKhSdT;
      this.entity.khGiam = _tinhSelected[0].soKhSdG;
    }
    this.updateColor(_tinh);
    // console.log("select Tinh", _tinhSelected)
  }

  onKHChange(event) {
    this.xulyData(this.dataAll);
    if (event.value === 'T')
      this.updateChart5T()
    else
      this.updateChart5G();
  }

  defaultSelect() {
    // console.log('ninti', this.chartOptions.plotOptions)
    this.chartOptions.plotOptions.series[0].get('qn').select();
  }

  updateChart5T() {
    // console.log("xxT", this.dataKhTang, this.dataLable)
    this.chartOptions5T = {
      chart: {
        type: 'column'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // T??nh h??nh s??? d???ng ??i???n kh??ch h??ng c?? quan h??nh ch??nh th??ng ${this.dCQHC.getMonth()+1} n??m ${this.dCQHC.getFullYear()} </span>`
      },
      legend: {
        enabled: false,
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      xAxis: {
        // categories: ['L??o Cai', 'Y??n B??i', '??i???n Bi??n', 'H??a B??nh', 'Lai Ch??u', 'S??n La', 'H?? Giang', 'Cao B???ng', 'B???c K???n', 'L???ng S??n', 'Tuy??n Quang', 'Th??i Nguy??n', 'Ph?? Th???', 'B???c Giang',
        //   'Qu???ng Ninh', 'B???c Ninh', 'H?? Nam', 'V??nh Ph??c', 'H?? N???i', 'H???i D????ng', 'H??ng Y??n', 'H???i Ph??ng', 'Nam ?????nh', 'Th??i B??nh', 'Ninh B??nh',
        //   'Thanh H??a', 'Ngh??? An', 'H?? T??nh', 'Qu???ng B??nh', 'Qu???ng Tr???', 'Hu???', '???? N???ng', 'Qu???ng Nam', 'Qu???ng Ng??i', 'B??nh ?????nh', 'Ph?? Y??n', 'Kh??nh H??a', 'Gia Lai',
        //   'Kon Tum', '????kL??k', '????k N??ng', 'B??nh Ph?????c', 'B??nh Thu???n', 'L??m ?????ng', 'T??y Ninh', 'B??nh D????ng', 'TP H??? Ch?? Minh', 'B?? R???a V??ng T??u', '?????ng Nai', 'Long An', '?????ng Th??p',
        //   'Ti???n Giang', 'B???n Tre', 'V??nh Long', 'C???n Th??', 'An Giang', 'Ki??n Giang', 'Tr?? Vinh', 'S??c Tr??ng', 'Ninh Thu???n', 'B???c Li??u', 'C?? Mau', 'H???u Giang'],
        categories: this.dataLable,
        title: {
          text: null
        },
        labels: {
          enabled: true,
          // rotation: -90,
          style: {
            textOverflow: "none",
            fontWeight: 'bold',
          },
          formatter: function () {
            let temp = this.value;
            return `<span style="font-family: Montserrat;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;color: #515151;">${temp}</span>`;
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          // useHTML: true,
          // text: `<span style="font-weight:bold">(s??? kh??ch h??ng)</span>`,
          text: ""
        },
        labels: {
          overflow: 'justify',
          style: {
            color: '#8C8C8C'
          },
          formatter: function () {
            let temp = this.value;
            temp = temp.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`;
          }
        },

      },
      tooltip: {
        // valueSuffix: ' s??? kh??ch h??ng'
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} s??? kh??ch h??ng`
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            align: 'center',
            // inside: true,
            // rotation: -90,
            color: '#8C8C8C',
            borderColor: '#8C8C8C',
            useHTML: true,
            formatter: function () {
              let temp = this.y;
              temp = temp.toString().replace('.', ',');
              temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              return `<span style="font-weight:bold; font-family: Oswald;
              font-style: normal;
              font-weight: 600;
              font-size: 28px; color: #ED5050">${temp}</span>`
            },
            x: 2,
            y: -10
          },
          // pointPadding: 0.1,
          // groupPadding: 0
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Kh??ch h??ng t??ng so v???i c??ng k???',
          color: '#ED5050',
          type: 'column',
          data: this.dataKhTang
        },
      ]
    };
  }

  updateChart5G() {
    // console.log("xxG", this.dataKhGiam, this.dataLableG)
    this.chartOptions5T = {
      chart: {
        type: 'column'
      },
      title: {
        text: ""
      },
      legend: {
        enabled: false,
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      xAxis: {
        categories: this.dataLableG,
        title: {
          text: null
        },
        labels: {
          enabled: true,
          // rotation: -90,
          style: {
            textOverflow: "none",
            fontWeight: 'bold',
          },
          formatter: function () {
            let temp = this.value;
            return `<span style="font-family: Montserrat;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;color: #515151;">${temp}</span>`;
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          // useHTML: true,
          // text: `<span style="font-weight:bold">(s??? kh??ch h??ng)</span>`,
          text: ""
        },
        labels: {
          overflow: 'justify',
          style: {
            color: '#8C8C8C'
          },
          formatter: function () {
            let temp = this.value;
            temp = temp.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`;
          }
        },

      },
      tooltip: {
        // valueSuffix: ' s??? kh??ch h??ng'
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} s??? kh??ch h??ng`
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            align: 'center',
            // inside: true,
            // rotation: -90,
            color: '#8C8C8C',
            borderColor: '#8C8C8C',
            useHTML: true,
            formatter: function () {
              let temp = this.y;
              temp = temp.toString().replace('.', ',');
              temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              return `<span style="font-weight:bold; font-family: Oswald;
              font-style: normal;
              font-weight: 600;
              font-size: 28px; color: #219653">${temp}</span>`
            },
            x: 2,
            y: -10
          },
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Kh??ch h??ng gi???m so v???i c??ng k???',
          color: '#219653',
          type: 'column',
          data: this.dataKhGiam
        },
      ]
    };
  }
}


  // updateChart() {
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
  //       // T??nh h??nh s??? d???ng ??i???n kh??ch h??ng c?? quan h??nh ch??nh th??ng ${this.dCQHC.getMonth()+1} n??m ${this.dCQHC.getFullYear()} </span>`
  //     },
  //     legend: {
  //       squareSymbol: false,
  //       symbolWidth: 16,
  //       symbolHeight: 16,
  //       symbolRadius: 0
  //     },
  //     xAxis: {
  //       // categories: ['L??o Cai', 'Y??n B??i', '??i???n Bi??n', 'H??a B??nh', 'Lai Ch??u', 'S??n La', 'H?? Giang', 'Cao B???ng', 'B???c K???n', 'L???ng S??n', 'Tuy??n Quang', 'Th??i Nguy??n', 'Ph?? Th???', 'B???c Giang',
  //       //   'Qu???ng Ninh', 'B???c Ninh', 'H?? Nam', 'V??nh Ph??c', 'H?? N???i', 'H???i D????ng', 'H??ng Y??n', 'H???i Ph??ng', 'Nam ?????nh', 'Th??i B??nh', 'Ninh B??nh',
  //       //   'Thanh H??a', 'Ngh??? An', 'H?? T??nh', 'Qu???ng B??nh', 'Qu???ng Tr???', 'Hu???', '???? N???ng', 'Qu???ng Nam', 'Qu???ng Ng??i', 'B??nh ?????nh', 'Ph?? Y??n', 'Kh??nh H??a', 'Gia Lai',
  //       //   'Kon Tum', '????kL??k', '????k N??ng', 'B??nh Ph?????c', 'B??nh Thu???n', 'L??m ?????ng', 'T??y Ninh', 'B??nh D????ng', 'TP H??? Ch?? Minh', 'B?? R???a V??ng T??u', '?????ng Nai', 'Long An', '?????ng Th??p',
  //       //   'Ti???n Giang', 'B???n Tre', 'V??nh Long', 'C???n Th??', 'An Giang', 'Ki??n Giang', 'Tr?? Vinh', 'S??c Tr??ng', 'Ninh Thu???n', 'B???c Li??u', 'C?? Mau', 'H???u Giang'],
  //       categories: this.dataLable,
  //       title: {
  //         text: null
  //       },
  //       labels: {
  //         enabled: true,
  //         rotation: -90,
  //         style: {
  //           color: "black",
  //           textOverflow: "none",
  //           fontWeight: 'bold',
  //           fontSize: "12px"
  //         }
  //       }
  //     },
  //     yAxis: {
  //       min: 0,
  //       title: {
  //         useHTML: true,
  //         text: `<span style="font-weight:bold">(s??? kh??ch h??ng)</span>`, 

  //       },
  //       labels: {
  //         overflow: 'justify',
  //         style: {
  //           color: '#8C8C8C'
  //         },
  //         formatter: function () {
  //           let temp = this.value;
  //           temp = temp.toString().replace('.', ',');
  //           temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  //           return `<span style="font-weight:bold">${temp}</span>`;
  //         }
  //       },

  //     },
  //     tooltip: {
  //       // valueSuffix: ' s??? kh??ch h??ng'
  //       formatter: function () {
  //         let temp = this.y
  //         temp = temp.toString().replace('.', ',');
  //         return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} s??? kh??ch h??ng`
  //       }
  //     },
  //     plotOptions: {
  //       series: {
  //         dataLabels: {
  //           enabled: true,
  //           align: 'top',
  //           // inside: true,
  //           // rotation: -90,
  //           color: '#8C8C8C',
  //           borderColor: '#8C8C8C',
  //           formatter: function () {
  //             let temp = this.y;
  //             temp = temp.toString().replace('.', ',');
  //             return temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  //           }
  //           // x: -10
  //         },
  //         pointPadding: 0.1,
  //         groupPadding: 0
  //       }
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     series: [
  //       {
  //         name: 'Kh??ch h??ng gi???m so v???i c??ng k???',
  //         color: '#219653',
  //         type: 'column',
  //         data: this.dataKhGiam
  //         // data: [4, 6, 3, 0, 2, 8, 12, 4, 2, 20, 15, 6, 10, 19, 18, 15,
  //         //   10, 15, 184, 4, 3, 43, 2, 40, 39, 44, 43, 1, 1, 1, 2,
  //         //   78, 5, 1, 5, 2, 37, 2, 2, 10, 2, 15, 15, 8, 8, 45,
  //         //   71, 44, 36, 20, 15, 18, 1, 5, 35, 20, 44, 10, 15, 5, 6,
  //         //   7, 8,]
  //       },
  //       {
  //         name: 'Kh??ch h??ng t??ng so v???i c??ng k???',
  //         color: '#ED5050',
  //         type: 'column',
  //         data: this.dataKhTang
  //         // data: [4, 6, 3, 0, 2, 8, 12, 4, 2, 20, 15, 6, 10, 19, 18, 15,
  //         //   10, 15, 278, 4, 3, 43, 2, 40, 39, 44, 43, 1, 1, 1, 2,
  //         //   78, 5, 1, 5, 2, 37, 2, 2, 10, 2, 15, 15, 8, 8, 45,
  //         //   71, 44, 36, 20, 15, 18, 1, 5, 35, 20, 44, 10, 15, 5, 6,
  //         //   7, 8,]
  //       }
  //     ]
  //   };
  // }
