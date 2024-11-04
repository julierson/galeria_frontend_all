
import { Cliente } from '../cliente/cliente';

export class GRAnexo {
    numAnexo: number;
    anexadoSize: number;
    numArquivo: number;
    galeriaSize: number;
    listaAll: any;
}

export class ClienteAnexo {
    id: number;
    cliente: Cliente;
    descricao: String;
    contenttype: String;
    anexo: Blob;
}

export class ClienteAnexoView {
    checked: boolean;
    id: number;
    clienteId: number;
    clienteCodigo: number;
    clienteNome: string;
    descricao: String;
    tamanho: number;
    slug: string;
    comprimido: boolean;
}