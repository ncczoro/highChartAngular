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
    this.lstKH = [{ label: "Khách hàng tăng", value: "T" }, { label: "Khách hàng giảm", value: "G" }];
    this.entity.TinhHT = "Hà Nội";
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
        summary: "Không có dữ liệu!",
        detail: `Tháng ${this.dCQHC.getMonth() + 1} năm ${this.dCQHC.getFullYear()}`
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
    let _haNoi = this.dataAll.filter(p => p.tenTinh.toLowerCase().includes("hà nội"))
    this.entity.khTang = _haNoi[0].soKhSdT;
    this.entity.khGiam = _haNoi[0].soKhSdG;
    this.selectedKH = 'T'
    // console.log("CQHC", this.dataAll);
    this.xulyData(res);
    this.updateChart();
    this.updateChart5T();
    this.updateColor('HÀ NỘI');
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
      this.chartOptions.series[0].data[18].color = tinh.includes('HÀ NỘI') ? '#F39738' : 'rgb(181, 196, 225)'
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
                return 'QUẢNG NINH'
              case 2:
                return 'KHÁNH HÒA'
              case 3:
                return 'TIỀN GIANG'
              case 4:
                return 'BÀ RỊA - VŨNG TÀU'
              case 5:
                return 'BÌNH THUẬN'
              case 6:
                return 'TP.HỒ CHÍ MINH'
              case 7:
                return 'BẾN TRE'
              case 8:
                return 'SOC TRĂNG'
              case 9:
                return 'PHÚ THỌ'
              case 10:
                return 'YÊN BÁI'
              case 11:
                return 'HẢI DƯƠNG'
              case 12:
                return 'BẮC NINH'
              case 13:
                return 'HƯNG YÊN'
              case 14:
                return 'NINH BÌNH'
              case 15:
                return 'HÀ NAM'
              case 16:
                return 'HÒA BÌNH'
              case 17:
                return 'VĨNH PHÚC'
              case 18:
                return 'HÀ NỘI'
              case 19:
                return 'BẮC GIANG'
              case 20:
                return 'THÁI BÌNH'
              case 21:
                return 'LÂM ĐỒNG'
              case 22:
                return 'BÌNH PHƯỚC'
              case 23:
                return 'PHÚ YÊN'
              case 24:
                return 'BÌNH ĐỊNH'
              case 25:
                return 'GIA LAI'
              case 26:
                return 'QUÃNG NGÃI'
              case 27:
                return 'ĐỒNG NAI'
              case 28:
                return 'ĐỒNG THÁP'
              case 29:
                return 'LONG AN'
              case 30:
                return 'HẢI PHÒNG'
              case 31:
                return 'HẬU GIANG'
              case 32:
                return 'BẠC LIÊU'
              case 33:
                return 'VĨNH LONG'
              case 34:
                return 'TÂY NINH'
              case 35:
                return 'THÁI NGUYÊN'
              case 36:
                return 'LAI CHÂU'
              case 37:
                return 'SƠN LA'
              case 38:
                return 'HÀ GIANG'
              case 39:
                return 'NAM ĐỊNH'
              case 40:
                return 'HÀ TĨNH'
              case 41:
                return 'NGHỆ AN'
              case 42:
                return 'QUẢNG BÌNH'
              case 43:
                return 'DAK LAK'
              case 44:
                return 'NINH THUẬN'
              case 45:
                return 'DAK NÔNG'
              case 46:
                return 'KON TUM'
              case 47:
              case 0:
                return 'QUẢNG NAM'
              case 48:
                return 'QUẢNG TRỊ'
              case 49:
                return 'THỪA THIÊN-HUẾ'
              case 50:
                return 'ĐÀ NẴNG'
              case 51:
                return 'AN GIANG'
              case 52:
                return 'CÀU MAU'
              case 53:
                return 'TRÀ VINH'
              case 54:
                return 'CAO BẰNG'
              case 55:
                return 'KIÊN GIANG'
              case 56:
                return 'LÀO CAI'
              case 57:
                return 'ĐIỆN BIÊN'
              case 58:
                return 'LẠNG SƠN'
              case 59:
                return 'THANH HÓA'
              case 60:
                return 'BẮC KẠN'
              case 61:
                return 'TUYÊN QUANG'
              case 62:
                return 'BÌNH DƯƠNG'
              case 63:
                return 'CẦN THƠ'
              default:
                return 'HÀ NỘI'
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
        // Tình hình sử dụng điện khách hàng cơ quan hành chính tháng ${this.dCQHC.getMonth()+1} năm ${this.dCQHC.getFullYear()} </span>`
      },
      legend: {
        enabled: false,
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      xAxis: {
        // categories: ['Lào Cai', 'Yên Bái', 'Điện Biên', 'Hòa Bình', 'Lai Châu', 'Sơn La', 'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Lạng Sơn', 'Tuyên Quang', 'Thái Nguyên', 'Phú Thọ', 'Bắc Giang',
        //   'Quảng Ninh', 'Bắc Ninh', 'Hà Nam', 'Vĩnh Phúc', 'Hà Nội', 'Hải Dương', 'Hưng Yên', 'Hải Phòng', 'Nam Định', 'Thái Bình', 'Ninh Bình',
        //   'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Gia Lai',
        //   'Kon Tum', 'ĐăkLăk', 'Đăk Nông', 'Bình Phước', 'Bình Thuận', 'Lâm Đồng', 'Tây Ninh', 'Bình Dương', 'TP Hồ Chí Minh', 'Bà Rịa Vũng Tàu', 'Đồng Nai', 'Long An', 'Đồng Tháp',
        //   'Tiền Giang', 'Bến Tre', 'Vĩnh Long', 'Cần Thơ', 'An Giang', 'Kiên Giang', 'Trà Vinh', 'Sóc Trăng', 'Ninh Thuận', 'Bạc Liêu', 'Cà Mau', 'Hậu Giang'],
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
          // text: `<span style="font-weight:bold">(số khách hàng)</span>`,
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
        // valueSuffix: ' số khách hàng'
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} số khách hàng`
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
          name: 'Khách hàng tăng so với cùng kỳ',
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
          // text: `<span style="font-weight:bold">(số khách hàng)</span>`,
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
        // valueSuffix: ' số khách hàng'
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} số khách hàng`
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
          name: 'Khách hàng giảm so với cùng kỳ',
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
  //       // Tình hình sử dụng điện khách hàng cơ quan hành chính tháng ${this.dCQHC.getMonth()+1} năm ${this.dCQHC.getFullYear()} </span>`
  //     },
  //     legend: {
  //       squareSymbol: false,
  //       symbolWidth: 16,
  //       symbolHeight: 16,
  //       symbolRadius: 0
  //     },
  //     xAxis: {
  //       // categories: ['Lào Cai', 'Yên Bái', 'Điện Biên', 'Hòa Bình', 'Lai Châu', 'Sơn La', 'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Lạng Sơn', 'Tuyên Quang', 'Thái Nguyên', 'Phú Thọ', 'Bắc Giang',
  //       //   'Quảng Ninh', 'Bắc Ninh', 'Hà Nam', 'Vĩnh Phúc', 'Hà Nội', 'Hải Dương', 'Hưng Yên', 'Hải Phòng', 'Nam Định', 'Thái Bình', 'Ninh Bình',
  //       //   'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Gia Lai',
  //       //   'Kon Tum', 'ĐăkLăk', 'Đăk Nông', 'Bình Phước', 'Bình Thuận', 'Lâm Đồng', 'Tây Ninh', 'Bình Dương', 'TP Hồ Chí Minh', 'Bà Rịa Vũng Tàu', 'Đồng Nai', 'Long An', 'Đồng Tháp',
  //       //   'Tiền Giang', 'Bến Tre', 'Vĩnh Long', 'Cần Thơ', 'An Giang', 'Kiên Giang', 'Trà Vinh', 'Sóc Trăng', 'Ninh Thuận', 'Bạc Liêu', 'Cà Mau', 'Hậu Giang'],
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
  //         text: `<span style="font-weight:bold">(số khách hàng)</span>`, 

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
  //       // valueSuffix: ' số khách hàng'
  //       formatter: function () {
  //         let temp = this.y
  //         temp = temp.toString().replace('.', ',');
  //         return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} số khách hàng`
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
  //         name: 'Khách hàng giảm so với cùng kỳ',
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
  //         name: 'Khách hàng tăng so với cùng kỳ',
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
