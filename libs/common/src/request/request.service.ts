import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class RequestService {
  constructor(private http: HttpService) {}

  async requestGet(url: string, config?): Promise<string> {
    return new Promise(resolve => {
      this.http
        .get(url, config)
        .pipe(
          map((axiosResponse: AxiosResponse) => {
            return axiosResponse.data;
          }),
        )
        .subscribe(result => {
          resolve(result);
        });
    });
  }

  async requestPost(url: string, data?, config?): Promise<string> {
    return new Promise(resolve => {
      this.http
        .post(url, data, config)
        .pipe(
          map((axiosResponse: AxiosResponse) => {
            return axiosResponse.data;
          }),
        )
        .subscribe(result => {
          resolve(result);
        });
    });
  }
}
