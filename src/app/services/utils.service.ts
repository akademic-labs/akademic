import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { States } from '../models/states.interface';
import { Cities } from '../models/cities.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private _http: HttpClient
  ) { }

  getStates() {
    return this._http.get<States[]>(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
    );
  }

  getCities(idState) {
    return this._http.get<Cities[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idState}/municipios`
    );
  }

  getLocation() {
    return this._http.get<any[]>(
      `https://ip-api.io/api/json`
    );
  }

  sortBy(array, key, order) {
    return array.sort(function (a, b) {
      const x = a[key], y = b[key];
      if (order === 'asc') {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      } else if (order === 'desc') {
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
      }
    })
  };

}
