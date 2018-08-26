import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { States } from '../models/states.interface';
import { Cities } from '../models/cities.interface';

@Injectable({
  providedIn: 'root'
})
export class CityStateService {

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

}
