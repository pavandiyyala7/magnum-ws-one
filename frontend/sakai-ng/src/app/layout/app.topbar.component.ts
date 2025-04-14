import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";

import { AuthService } from 'src/app/service/auth-service/auth.service';
import { MenuService } from './app.menu.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    activeMenuName: string;
    
    

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private authService: AuthService, private menuService: MenuService) { }

    ngOnInit() {
        this.menuService.activeMenu$.subscribe(name => {
            this.activeMenuName = name;
          });
    }

    logoutFn() {
        this.authService.logout();
    }
}
