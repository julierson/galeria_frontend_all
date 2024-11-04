export class AppConstants {

    public static get baseURL(): string {
        // URL PRODUÇÃO ------------------------------------------------
        // return 'https://www.sistemaspro.com.br/profinancas_backend';

        // URL HOMOLOGAÇÃO
        // return 'https://hml.sistemaspro.com.br/profinancas_backend';

        // URL TESTE LOCAL ---------------------------------------------
        // return 'http://localhost:8080';
        // return 'http://localhost:8080/profinancas_backend';

        // Utilizado - Des. Julierson Padilha
        // return 'http://jpdes:8080';

        return null;

    }

    public static get baseAplicacaoURL(): string {

        // URL PRODUÇÃO ------------------------------------------------
        // return 'https://www.sistemaspro.com.br/profinancas';

        // URL HOMOLOGAÇÃO
        // return 'https://hml.sistemaspro.com.br/profinancas';

        // URL TESTE LOCAL ---------------------------------------------
        // return 'http://localhost:4200';
        // return 'http://localhost:8080/profinancas';

        // Utilizado - Des. Julierson Padilha [ng serve --host jpdes]
        // return 'http://jpdes:4200';
        
        return null;
    }
}
