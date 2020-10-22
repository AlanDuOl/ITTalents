import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { redirectCode, redirectMessage } from '../constants';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  message$: Observable<string>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.setMessage();
  }

  private setMessage(): void {
    this.message$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const code = +params.get('code');
        if (!code || !redirectMessage[code]) {
          return of(redirectMessage[redirectCode.notFound]);
        }
        else {
          return of(redirectMessage[code]);
        }
      })
    );
  }
}
