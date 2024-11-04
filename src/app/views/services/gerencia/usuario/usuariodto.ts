import { Permissao } from '../configuracao/permissao/permissao';
import { SisEmpresa } from '../sisempresa/sisempresa';

export class UsuarioDTO {
    id: number;
    username: String;
    nickname: String;
    master: boolean;
    permissao: Permissao[];
    empValorMaximoEmprestimo: number;
    empQtdDiasReagendamento: number;
    bloqueado: boolean;
    sisEmpresa: SisEmpresa;
}