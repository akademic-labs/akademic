import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(
    private http: Http,
    private _notify: NotifyService
  ) { }

  consultaCEP(cep: string) {
    cep = cep.replace(/\D/g, '');
    // verifica se campo cep possui valor informado.
    if (cep !== '') {
      // expressão regular para validar o CEP.
      const validacep = /^[0-9]{8}$/;
      // valida o formato do CEP.
      if (validacep.test(cep)) {
        return this.http.get(`https://viacep.com.br/ws/${cep}/json`)
          .pipe(map(dados => dados.json()));
      } else {
        this._notify.update('warning', `Cep inválido.`);
        return of({})
      }
    }
  }
}
