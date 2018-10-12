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

  getColleges(search) {
    return this._http.get(`https://querobolsa.com.br/simple_universities_search.json?term=${search}&all_universities=true&per_page=10&page=1`);
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

  groupBy(array, grouper, aggregator) {
    return array.reduce(
      (res, obj) => {
        if (!(obj[grouper] in res)) {
          res.__array.push((res[obj[grouper]] = obj));
        } else {
          res[obj[grouper]][aggregator] += obj[aggregator];
        }
        return res;
      },
      { __array: [] }
    ).__array.sort((a, b) => b[aggregator] - a[aggregator]);
  }
  preparateDataChart(array, keyLabels, keyData) {
    const labels = [], data = []; let result;
    for (let index = 0; index < array.length; index++) {
      labels.push(array[index][keyLabels]);
      data.push(array[index][keyData]);
    }
    result = {labels: labels, data: data};
    return result;
  }

}
