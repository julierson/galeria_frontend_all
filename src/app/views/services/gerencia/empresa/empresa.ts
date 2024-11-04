import { SisEmpresa } from "../sisempresa/sisempresa";

export class Empresa {
    id: number;
    nome: String;
    telefone: String;
    idUsuario: number;
    email: String;
    utilizaCodigoCliente: boolean;
    empPadrao: boolean;
    sisEmpresa: SisEmpresa;
}
