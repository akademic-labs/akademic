import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cities } from '../models/cities.interface';
import { States } from '../models/states.interface';
import { sort } from './../rxjs-operators/sort-by.operator';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private _http: HttpClient
  ) { }

  getStates(): Observable<States[]> {
    const url = 'assets/json/states.json';
    return this._http.get<States[]>(url).pipe(
      sort('nome', 'asc')
    );
  }

  getCities(idState) {
    return this._http.get<Cities[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idState}/municipios`
    ).pipe(
      map(cities => {
        return cities.map(({ id, nome }) => {
          return { id, nome };
        });
      }),
      sort('nome', 'asc')
    );
  }

  getLocation() {
    return this._http.get<any[]>(
      `https://ip-api.io/api/json`
    );
  }

  preparateDataChart(array, keyLabels, keyData) {
    const labels = [], data = []; let result;
    for (let index = 0; index < array.length; index++) {
      labels.push(array[index][keyLabels]);
      data.push(array[index][keyData]);
    }
    result = { labels: labels, data: data };
    return result;
  }

}
