import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="topbar clearfix" style="height: 45px !important;background-color: #CE7A58">
            <div class="topbar-left" style="height: 45px !important;background-color: #CE7A58">
                <div style="color: white;text-align: center;">
                    <!-- <img style="width: 20px; height:20px" src="assets/layout/images/logoEVN.jpg"> -->
                    <span style="font-weight: 500">EVN Dashboard Report</span>
                </div>
            </div>

            

            <div class="topbar-right">
                <a id="menu-button" href="#" (click)="app.onMenuButtonClick($event)">
                    <i></i>
                </a>
<!-- 
                <a id="rightpanel-menu-button" href="#" (click)="app.onRightPanelButtonClick($event)">
                    <i class="myIcon material-icons">more_vert</i>
                </a> -->

                <a id="topbar-menu-button" href="#" (click)="app.onTopbarMenuButtonClick($event)">
                    <i class="myIcon material-icons">menu</i>
                </a>

                <ul class="topbar-items animated fadeInDown" [ngClass]="{'topbar-items-visible': app.topbarMenuActive}">
                    <li #profile class="profile-item" *ngIf="app.profileMode==='top'||app.isHorizontal()"
                        [ngClass]="{'active-top-menu':app.activeTopbarItem === profile}">

                        <a href="#" (click)="app.onTopbarItemClick($event,profile)">
                            <img class="profile-image" src="assets/layout/images/avatar.png" />
                            <span class="topbar-item-name">Jane Williams</span>
                        </a>

                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">person</i>
                                    <span>Profile</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">security</i>
                                    <span>Privacy</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">settings_applications</i>
                                    <span>Settings</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">power_settings_new</i>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <!-- <li #settings [ngClass]="{'active-top-menu':app.activeTopbarItem === settings}">
                        <a href="#" (click)="app.onTopbarItemClick($event,settings)">
                            <i class="myIcon topbar-icon material-icons">settings</i>
                            <span class="topbar-item-name">Settings</span>
                        </a>
                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">palette</i>
                                    <span>Change Theme</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">favorite_border</i>
                                    <span>Favorites</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">lock</i>
                                    <span>Lock Screen</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">wallpaper</i>
                                    <span>Wallpaper</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a routerLink="/" href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">power_settings_new</i>
                                    <span>LogOut</span>
                                </a>
                            </li>
                        </ul>
                    </li> -->
                    <!-- <li #messages [ngClass]="{'active-top-menu':app.activeTopbarItem === messages}">
                        <a href="#" (click)="app.onTopbarItemClick($event,messages)">
                            <i class="myIcon topbar-icon material-icons animated swing">message</i>
                            <span class="topbar-badge animated rubberBand">5</span>
                            <span class="topbar-item-name">Messages</span>
                        </a>
                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a href="#" class="topbar-message" (click)="app.onTopbarSubItemClick($event)">
                                    <img src="assets/layout/images/avatar1.png" width="35"/>
                                    <span>Give me a call</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" class="topbar-message" (click)="app.onTopbarSubItemClick($event)">
                                    <img src="assets/layout/images/avatar2.png" width="35"/>
                                    <span>Sales reports attached</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" class="topbar-message" (click)="app.onTopbarSubItemClick($event)">
                                    <img src="assets/layout/images/avatar3.png" width="35"/>
                                    <span>About your invoice</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" class="topbar-message" (click)="app.onTopbarSubItemClick($event)">
                                    <img src="assets/layout/images/avatar2.png" width="35"/>
                                    <span>Meeting today at 10pm</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" class="topbar-message" (click)="app.onTopbarSubItemClick($event)">
                                    <img src="assets/layout/images/avatar4.png" width="35"/>
                                    <span>Out of office</span>
                                </a>
                            </li>
                        </ul>
                    </li> -->
                    <!-- <li #notifications [ngClass]="{'active-top-menu':app.activeTopbarItem === notifications}">
                        <a href="#" (click)="app.onTopbarItemClick($event,notifications)">
                            <i class="myIcon topbar-icon material-icons">timer</i>
                            <span class="topbar-badge animated rubberBand">4</span>
                            <span class="topbar-item-name">Notifications</span>
                        </a>
                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">bug_report</i>
                                    <span>Pending tasks</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">event</i>
                                    <span>Meeting today at 3pm</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">file_download</i>
                                    <span>Download documents</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="material-icons">flight</i>
                                    <span>Book flight</span>
                                </a>
                            </li>
                        </ul>
                    </li> -->
                    <!-- <li #search class="search-item" [ngClass]="{'active-top-menu':app.activeTopbarItem === search}"
                        (click)="app.onTopbarItemClick($event,search)">
                        <span class="md-inputfield">
                            <input type="text" placeholder="T??m ki???m" pInputText>
                            <i class="myIcon topbar-icon material-icons">search</i>
                        </span>
                    </li> -->
                </ul>
            </div>
        </div>
    `,
    styles:[`
        .myIcon{
            font-size: 20px !important;
        }
    `]
})
export class AppTopbarComponent {

    constructor(public app: AppMainComponent) {}

}
