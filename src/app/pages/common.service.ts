import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
/**
 * Phien ban EVN: dùng url tương đối, rem hàm getIPAsync() lại
 * Phien ban màn hình tòa nhà: dùng url tuyệt đối, mở rem hàm getIPAsync()
 */
export class CommonService {
  API: any;
  static URL_API: string = "";
  public currentVersion: version = 'DH3008';

  constructor(private httpClient: HttpClient, public http: Http) {
    if (this.currentVersion === 'EVN' || this.currentVersion === 'DH3008')
      this.getIPAsync();
  }

  private async getIPAsync() {
    if (localStorage.getItem("IP") === null) {
      let response = await this.http.get("assets/config/IPconfig.json").toPromise().finally();
      let resJson = response.json();
      this.API = resJson.IP;
      localStorage.setItem("IP", this.API);
    } else {
      this.API = localStorage.getItem("IP");
    }
  }

  public async getDataAsync(url) {
    if (this.currentVersion === 'EVN' || this.currentVersion === 'DH3008') {
      await this.getIPAsync();
      let _url = this.API + url;
      const response = await this.http.get(_url).toPromise();
      return response.json();
    } else {
      const response = await this.http.get(url).toPromise();
      return response.json();
    }
  }

  public paserName(value) {
    switch (value) {
      case 0:
        return 'QUẢNG NAM'
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
}
type version = 'VPCP' | 'EVN' | 'DH3008';


