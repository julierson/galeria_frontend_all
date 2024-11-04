import { Permissao } from '../permissao/permissao';

export class Perfil {
    id: number;
    nome: String;
    master: boolean;
    empValorMaximoEmprestimo: number;
    empQtdDiasReagendamento: number;
    permissao: Permissao [];
    sisEmpresaId: number;
    idUsuario: number;
}
