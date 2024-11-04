import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { environment } from '../../../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private headers: Headers;
  private options: RequestOptions;
  private baseUrl: string;

  constructor(private http: Http) {
      this.headers = new Headers({'Authorization': 'Basic ' + btoa('crmClient1:crmSuperSecret'),
                                  'Content-type': 'application/x-www-form-urlencoded'});
      this.options = new RequestOptions({ headers : this.headers });
      this.baseUrl = environment.baseUrl;
  }

  login(loginPayload: string) {

    return this.http.post(this.baseUrl + '/oauth/token', loginPayload, this.options).map((res: Response) => res.json());
  }
}
