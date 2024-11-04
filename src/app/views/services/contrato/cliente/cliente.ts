
export class Cliente {
    id: number;
    codigo: number;
    nome: String;
    referencia: String;
    telefoneFixo: String;
    telefoneMovel: String;
    telefoneWhatsApp: String;
    
    cpf: String;
    dataNascimento: Date;
    renda: number;
    informacao: String;
    limiteEmprestimo: number;

    endereco: String;

    indicacao: String;
    telefoneIndicacao: String;

    enderecoComercial: String;
    inadimplente: boolean;

    localizacao: String;
    localizacaoTrabalho: String;
    notificarCobranca: boolean;
    enderecoCobranca: String;

    idUsuario: number;
    idEmpresa: number;

    status: String;
    listaNegra: boolean;
    situacao: String;
    motivoListaNegra: String;

    incluidoEm: Date;
    incluidoPor: number;
    alteradoEm: Date;
    alteradoPor: number;
    excluidoEm: Date;
    excluidoPor: number;
}
