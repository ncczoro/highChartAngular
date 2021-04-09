import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="footer">
            <div class="card clearfix" style="color: blue">
                <span class="footer-text-left">EVN</span>
                <span class="footer-text-right">
                    <span class="material-icons ui-icon-copyright"></span>
                    <span>Bản quyền thuộc Tập Đoàn Điện Lực Việt Nam - Phát triển bởi EVNICT</span>
                </span>
            </div>
        </div>
    `
})
export class AppFooterComponent {

}
