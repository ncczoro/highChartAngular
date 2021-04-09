import { Component, OnInit } from '@angular/core';
import highcharts3D from 'highcharts/highcharts-3d';
import * as Highcharts from 'highcharts/highcharts'
highcharts3D(Highcharts);
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-nsuat-laodong-dh3008',
  templateUrl: './nsuat-laodong-dh3008.component.html',
  styleUrls: ['./nsuat-laodong-dh3008.component.css']
})
export class NsuatLaodongDh3008Component implements OnInit {

  isLoading: boolean = false;
  today: Date = new Date();

  lstYear: any = [];
  selectedYear: any;

  highchartSLDTP = Highcharts;
  chartOptionSLDTP: any;
  dataSLDTP_kh: any = [];
  dataSLDTP_tt: any = [];
  lableSLDTP: any = [];

  highchartTheoKH = Highcharts;
  chartOptionTheoKH: any;
  dataTheoKH_kh: any = [];
  dataTheoKH_tt: any = [];
  lableTheoKH: any = [];

  highchartTheoSLSX = Highcharts;
  chartOptionTheoSLSX: any;
  dataTheoSLSX_kh: any = [];
  dataTheoSLSX_tt: any = [];
  lableTheoSLSX: any = [];

  highchartTheoCSLD = Highcharts;
  chartOptionTheoCSLD: any;
  dataTheoCSLD_kh: any = [];
  dataTheoCSLD_tt: any = [];
  lableTheoCSLD: any = [];

  highchartTheoSLDTT = Highcharts;
  chartOptionTheoSLDTT: any;
  dataTheoSLDTT_kh: any = [];
  dataTheoSLDTT_tt: any = [];
  lableTheoSLDTT: any = [];

  highchartTheoKmDD = Highcharts;
  chartOptionTheoKmDD: any;
  dataTheoKmDD_kh: any = [];
  dataTheoKmDD_tt: any = [];
  lableTheoKmDD: any = [];

  highchartTheoSLDTP = Highcharts;
  chartOptionTheoSLDTP: any;
  dataTheoSLDTP_kh: any = [];
  dataTheoSLDTP_tt: any = [];
  lableTheoSLDTP: any = [];

  highchartTheoCSTBA = Highcharts;
  chartOptionTheoCSTBA: any;
  dataTheoCSTBA_kh: any = [];
  dataTheoCSTBA_tt: any = [];
  lableTheoCSTBA: any = [];

  year_has_value: any;
  charColor: any = [];

  constructor(private router: Router, public service: CommonService,
    private utility: Utility, private messageService: MessageService) { }

  ngOnInit() {
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1']
    this.today = new Date();
    for (let i = 2000; i <= this.today.getFullYear(); i++) {
      this.lstYear.push({ label: i, value: i });
    }
    this.selectedYear = this.today.getFullYear() - 1;
    this.year_has_value = this.selectedYear;
    this.getDataNSLD();
  }

  onYearChange(event) {
    this.getDataNSLD();
  }

  async getDataNSLD() {
    this.isLoading = true;
    const res = await this.service.getDataAsync(this.utility.Get_Hrms_NangSuatLaoDong(this.selectedYear));
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Báo cáo năng suất lao động năm ${this.selectedYear}!`
      });
      this.selectedYear = this.year_has_value;
      this.isLoading = false;
      return;
    }
    this.year_has_value = this.selectedYear;
    this.xulyData(res);
    this.updateChartSanLuongDienTP();
    this.updateChartTheoKH();
    this.updateChartTheoSLSX();
    this.updateChartTheoCSLD();
    this.updateChartTheoSLDTT();
    this.updateChartTheoKmDD();
    this.updateChartTheoSLDTP();
    this.updateChartTheoCSTBA();
    this.isLoading = false;

  }

  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  stringFormat_pt(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.').concat('%');
  }

  xulyData(data) {
    this.dataSLDTP_kh = [];
    this.dataSLDTP_tt = [];
    this.lableSLDTP = [];
    let _sanLuongDienTP = data.filter(p => p.tenchitieu.toLowerCase().includes("sản lượng điện tp"));
    for (let i = 0; i < _sanLuongDienTP.length; i++) {
      const element = _sanLuongDienTP[i];
      this.dataSLDTP_kh.push(parseFloat((element.evnnpc_kh + element.evnspc_kh + element.evncpc_kh + element.evnhanoi_kh + element.evnhcmc_kh).toFixed(1)));
      this.dataSLDTP_tt.push(parseFloat((element.evnnpc_tt + element.evnspc_tt + element.evncpc_tt + element.evnhanoi_tt + element.evnhcmc_tt).toFixed(1)));
      this.lableSLDTP.push('', '');
    }
    
    this.dataTheoKH_kh = [];
    this.dataTheoKH_tt = [];
    this.lableTheoKH = [];
    let _theoKH = data.filter(p => p.tenchitieu.toLowerCase().includes("theo khách hàng"));
    for (let i = 0; i < _theoKH.length; i++) {
      const element = _theoKH[i];
      this.dataTheoKH_kh.push(Math.round(element.evnnpc_kh));
      this.dataTheoKH_kh.push(Math.round(element.evnspc_kh));
      this.dataTheoKH_kh.push(Math.round(element.evncpc_kh));
      this.dataTheoKH_kh.push(Math.round(element.evnhanoi_kh));
      this.dataTheoKH_kh.push(Math.round(element.evnhcmc_kh));

      this.dataTheoKH_tt.push(Math.round(element.evnnpc_tt));
      this.dataTheoKH_tt.push(Math.round(element.evnspc_tt));
      this.dataTheoKH_tt.push(Math.round(element.evncpc_tt));
      this.dataTheoKH_tt.push(Math.round(element.evnhanoi_tt));
      this.dataTheoKH_tt.push(Math.round(element.evnhcmc_tt));
      this.lableTheoKH.push('EVNNPC', 'EVNSPC','EVNCPC', 'EVNHN', 'EVNHCMC');
    }


    this.dataTheoSLSX_kh = [];
    this.dataTheoSLSX_tt = [];
    this.lableTheoSLSX = [];
    let _TheoSLSX = data.filter(p => p.tenchitieu.toLowerCase().includes("theo sản lượng điện sản xuất (triệu kwh/lđ) tct"));
    for (let i = 0; i < _TheoSLSX.length; i++) {
      const element = _TheoSLSX[i];
      this.dataTheoSLSX_kh.push(Math.round(element.genco1_kh));
      this.dataTheoSLSX_kh.push(Math.round(element.genco2_kh));
      this.dataTheoSLSX_kh.push(Math.round(element.genco3_kh));
      this.dataTheoSLSX_kh.push(Math.round(element.ndthuduc_kh));

      this.dataTheoSLSX_tt.push(Math.round(element.genco1_tt));
      this.dataTheoSLSX_tt.push(Math.round(element.genco2_tt));
      this.dataTheoSLSX_tt.push(Math.round(element.genco3_tt));
      this.dataTheoSLSX_tt.push(Math.round(element.ndthuduc_tt));
      this.lableTheoSLSX.push('GENCO1', 'GENCO2','GENCO3', 'NDTHUDUC');
    }

    this.dataTheoCSLD_kh = [];
    this.dataTheoCSLD_tt = [];
    this.lableTheoCSLD = [];
    let _TheoCSLD = data.filter(p => p.tenchitieu.toLowerCase().includes("theo công suất đặt (người/mw) tct"));
    for (let i = 0; i < _TheoCSLD.length; i++) {
      const element = _TheoCSLD[i];
      this.dataTheoCSLD_kh.push(element.genco1_kh);
      this.dataTheoCSLD_kh.push(element.genco2_kh);
      this.dataTheoCSLD_kh.push(element.genco3_kh);
      this.dataTheoCSLD_kh.push(element.ndthuduc_kh);

      this.dataTheoCSLD_tt.push(parseFloat(element.genco1_tt.toFixed(2)));
      this.dataTheoCSLD_tt.push(parseFloat(element.genco2_tt.toFixed(2)));
      this.dataTheoCSLD_tt.push(parseFloat(element.genco3_tt.toFixed(2)));
      this.dataTheoCSLD_tt.push(parseFloat(element.ndthuduc_tt.toFixed(2)));
      this.lableTheoCSLD.push('GENCO1', 'GENCO2','GENCO3', 'NDTHUDUC');
    }

    this.dataTheoSLDTT_kh = [];
    this.dataTheoSLDTT_tt = [];
    this.lableTheoSLDTT = [];
    let _TheoSLDTT = data.filter(p => p.tenchitieu.toLowerCase().includes("sản lượng điện truyền tải"));
    for (let i = 0; i < _TheoSLDTT.length; i++) {
      const element = _TheoSLDTT[i];
      this.dataTheoSLDTT_kh.push(parseFloat((element.evnnpt_kh).toFixed(1)));
      this.dataTheoSLDTT_tt.push(parseFloat((element.evnnpt_tt).toFixed(1)));
      this.lableTheoSLDTT.push('', '');
    }

    this.dataTheoKmDD_kh = [];
    this.dataTheoKmDD_tt = [];
    this.lableTheoKmDD = [];
    let _TheoKmDD = data.filter(p => p.tenchitieu.toLowerCase().includes("km đường dây"));
    for (let i = 0; i < _TheoKmDD.length; i++) {
      const element = _TheoKmDD[i];
      this.dataTheoKmDD_kh.push(parseFloat((element.evnnpt_kh).toFixed(1)));
      this.dataTheoKmDD_tt.push(parseFloat((element.evnnpt_tt).toFixed(1)));
      this.lableTheoKmDD.push('', '');
    }

    this.dataTheoSLDTP_kh = [];
    this.dataTheoSLDTP_tt = [];
    this.lableTheoSLDTP = [];
    let _TheoSLDTP = data.filter(p => p.tenchitieu.toLowerCase().includes("sản lượng điện tp"));
    for (let i = 0; i < _TheoSLDTP.length; i++) {
      const element = _TheoSLDTP[i];
      this.dataTheoSLDTP_kh.push(Math.round(element.evnnpc_kh));
      this.dataTheoSLDTP_kh.push(Math.round(element.evnspc_kh));
      this.dataTheoSLDTP_kh.push(Math.round(element.evncpc_kh));
      this.dataTheoSLDTP_kh.push(Math.round(element.evnhanoi_kh));
      this.dataTheoSLDTP_kh.push(Math.round(element.evnhcmc_kh));

      this.dataTheoSLDTP_tt.push(Math.round(element.evnnpc_tt));
      this.dataTheoSLDTP_tt.push(Math.round(element.evnspc_tt));
      this.dataTheoSLDTP_tt.push(Math.round(element.evncpc_tt));
      this.dataTheoSLDTP_tt.push(Math.round(element.evnhanoi_tt));
      this.dataTheoSLDTP_tt.push(Math.round(element.evnhcmc_tt));
      this.lableTheoSLDTP.push('EVNNPC', 'EVNSPC','EVNCPC', 'EVNHN', 'EVNHCMC');
    }

    this.dataTheoCSTBA_kh = [];
    this.dataTheoCSTBA_tt = [];
    this.lableTheoCSTBA = [];
    let _TheoCSTBA = data.filter(p => p.tenchitieu.toLowerCase().includes("dung lượng trạm ba"));
    for (let i = 0; i < _TheoCSTBA.length; i++) {
      const element = _TheoCSTBA[i];
      this.dataTheoCSTBA_kh.push(parseFloat((element.evnnpt_kh).toFixed(1)));
      this.dataTheoCSTBA_tt.push(parseFloat((element.evnnpt_tt).toFixed(1)));
      this.lableTheoCSTBA.push('', '');
    }
  }

  updateChartSanLuongDienTP() {
    this.highchartSLDTP.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionSLDTP = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableSLDTP,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold"></span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: [{
        name: 'Kế hoạch',
        data: this.dataSLDTP_kh,
        color: '#5899DA'
      }, {
        name: 'Thực tế',
        data: this.dataSLDTP_tt,
        color: '#EAC344'
      }]
    };
  }

  updateChartTheoKH() {
    this.highchartTheoKH.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionTheoKH = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableTheoKH,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold"></span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: [{
        name: 'Kế hoạch',
        data: this.dataTheoKH_kh,
        color: '#5899DA'
      }, {
        name: 'Thực tế',
        data: this.dataTheoKH_tt,
        color: '#EAC344'
      }]
    };
  }
  updateChartTheoSLSX() {
    this.highchartTheoSLSX.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionTheoSLSX = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableTheoSLSX,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold"></span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: [{
        name: 'Kế hoạch',
        data: this.dataTheoSLSX_kh,
        color: '#5899DA'
      }, {
        name: 'Thực tế',
        data: this.dataTheoSLSX_tt,
        color: '#EAC344'
      }]
    };
  }
  updateChartTheoCSLD() {
    this.highchartTheoCSLD.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionTheoCSLD = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableTheoCSLD,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold"></span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: [{
        name: 'Kế hoạch',
        data: this.dataTheoCSLD_kh,
        color: '#5899DA'
      }, {
        name: 'Thực tế',
        data: this.dataTheoCSLD_tt,
        color: '#EAC344'
      }]
    };
  }
  updateChartTheoSLDTT() {
    this.highchartTheoSLDTT.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionTheoSLDTT = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableTheoSLDTT,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold"></span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: [{
        name: 'Kế hoạch',
        data: this.dataTheoSLDTT_kh,
        color: '#5899DA'
      }, {
        name: 'Thực tế',
        data: this.dataTheoSLDTT_tt,
        color: '#EAC344'
      }]
    };
  }
  updateChartTheoKmDD() {
    this.highchartTheoKmDD.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionTheoKmDD = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableTheoKmDD,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold"></span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: [{
        name: 'Kế hoạch',
        data: this.dataTheoKmDD_kh,
        color: '#5899DA'
      }, {
        name: 'Thực tế',
        data: this.dataTheoKmDD_tt,
        color: '#EAC344'
      }]
    };
  }
  updateChartTheoSLDTP() {
    this.highchartTheoSLDTP.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionTheoSLDTP = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableTheoSLDTP,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold"></span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: [{
        name: 'Kế hoạch',
        data: this.dataTheoSLDTP_kh,
        color: '#5899DA'
      }, {
        name: 'Thực tế',
        data: this.dataTheoSLDTP_tt,
        color: '#EAC344'
      }]
    };
  }
  updateChartTheoCSTBA() {
    this.highchartTheoCSTBA.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionTheoCSTBA = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableTheoCSTBA,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold"></span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: [{
        name: 'Kế hoạch',
        data: this.dataTheoCSTBA_kh,
        color: '#5899DA'
      }, {
        name: 'Thực tế',
        data: this.dataTheoCSTBA_tt,
        color: '#EAC344'
      }]
    };
  }

}
