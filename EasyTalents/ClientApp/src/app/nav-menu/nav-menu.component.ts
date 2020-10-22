import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { uiPath, requiredRole } from '../constants';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  isAuthenticated$: Observable<boolean>;
  isAuthorized$: Observable<boolean>;
  path = uiPath;

  constructor(private authService: AuthorizeService) { }

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.isAuthorized$ = this.authService.isAuthorized([requiredRole]);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
