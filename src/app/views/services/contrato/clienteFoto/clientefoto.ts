
import { Cliente } from '../cliente/cliente';

export class GRFoto {
    numAnexo: number;
    anexadoSize: number;
    numArquivo: number;
    galeriaSize: number;
    listaAll: any;
}

export class ClienteFoto {
    id: number;
    cliente: Cliente;
    descricao: String;
    contenttype: String;
    foto: Blob;
    tipo: String;
}

export class ClienteFotoView {
    checked: boolean;
    id: number;
    clienteId: number;
    clienteCodigo: number;
    clienteNome: string;
    descricao: String;
    tipo: String;
    tamanho: number;
    slug: string;
    comprimido: boolean;
}