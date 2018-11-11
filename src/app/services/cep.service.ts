import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient, private _notify: NotifyService) { }

  queryCEP(cep: string) {
    cep = cep.replace(/\D/g, '');
    // verifica se campo cep possui valor informado.
    if (cep !== '') {
      // regex para validar o CEP.
      const validacep = /^[0-9]{8}$/;

      // valida o formato do CEP.
      if (validacep.test(cep)) {
        return this.http.get<any>(`https://viacep.com.br/ws/${cep}/json`);
      } else {
        this._notify.update('warning', 'CEP inválido.');
        return of({})
      }
    }
  }
}
