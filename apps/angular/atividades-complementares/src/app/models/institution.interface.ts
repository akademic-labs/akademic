import { Course } from './course.interface';

export interface Institution {
  uid: string;
  codMantenedora: number;
  razaoSocial: string;
  cnpj: string;
  naturezaJuridica: string;
  codigoIES: number;
  instituicao: string;
  sigla: string;
  endereco: string;
  municipio: string;
  uf: string;
  organizacaoAcademica: string;
  tipoCredenciamento: string;
  categoria: string;
  courses: Course[];
}
