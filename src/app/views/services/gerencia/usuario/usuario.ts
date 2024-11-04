
import { Perfil } from '../configuracao/perfil/perfil';
import { SisEmpresa } from '../sisempresa/sisempresa';

export class Usuario {
    id: number;
    username: String;
    password: String;
    nickname: String;
    perfil: Perfil [];
    idUsuario: number;
    acessoApp: boolean;
    sisEmpresa: SisEmpresa;
}
