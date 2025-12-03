
// Baseado nas tabelas: 1-ASSOCIADOS, 1-EVENTOS, 2-DESPESAS, 1-RECEITAS, etc.

export enum StatusEvento {
  Planejado = 'Planejado',
  EmAndamento = 'Em Andamento',
  Concluido = 'Concluído',
  Cancelado = 'Cancelado'
}

export interface Associado {
  id: number;
  Nome_Produtor: string; // 1-ASSOCIADOS.NOME_PRODUTOR
  CPF: string; // 1-ASSOCIADOS.CPF
  Data_Nasc: string; // 1-ASSOCIADOS.DATA_NASC
  Municipio: string; // 1-ASSOCIADOS.MUNICÍPIO
  Estado_Civil: string; // 1-ASSOCIADOS.ESTADO_CIVIL
  Genero: string; // 1-ASSOCIADOS.GÊNERO
  Email: string; // 1-ASSOCIADOS.E-MAIL
  Telefone: string; // 1-ASSOCIADOS.TEL
  Matricula: string; // 1-ASSOCIADOS.MATRÍCULA
  Data_Filiacao: string; // 1-ASSOCIADOS.DATA_FILIAÇÃO
  Status: string; // 1-ASSOCIADOS.STATUS
}

export interface Evento {
  id: number; // 1-EVENTOS.CódigoEVENTO
  Nome: string; // 1-EVENTOS.NOME
  Tipo: string; // 1-EVENTOS.TIPO
  Data_Inicio: string; // 1-EVENTOS.DATA-INICIO
  Data_Fim: string; // 1-EVENTOS.DATA-FIM
  Local_Realizacao: string; // 1-EVENTOS.LOCAL-REALI
  Responsavel: string; // 1-EVENTOS.RESP-GER
  Status: string; // 1-EVENTOS.Razão do Status
  Descricao?: string; // 1-EVENTOS.OBS
}

export interface Despesa {
  id: number; // 2-DESPESAS.CódigoSAIDA
  EventoID: number; // 2-DESPESAS.CÓD-EVENTO (Foreign Key)
  Descricao: string; // 2-DESPESAS.DESC-SAIDA
  Valor: number; // 2-DESPESAS.VALOR
  Data_Pagamento: string; // 2-DESPESAS.DATA-VENC
  Pagar_Para: string; // 2-DESPESAS.PAGAR
  Tipo_Despesa: string; // 2-DESPESAS.TIPO-DESPESA
  Centro_Custo: string; // 2-DESPESAS.CENTRO-CUSTO
}

export interface Receita {
  id: number; // 1-RECEITAS.CódigoREC
  EventoID: number; // 1-RECEITAS.CÓD-EVENTO (Foreign Key)
  Descricao: string; // 1-RECEITAS.DESC-REC
  Valor: number; // 1-RECEITAS.VALOR
  Data_Recebimento: string; // 1-RECEITAS.DATA-PGTO
  Receber_De: string; // 1-RECEITAS.RECEBER
  Forma_Recebimento: string; // 1-RECEITAS.FORMA-RECEB
}

export interface Fornecedor {
  id: number; // 7-FORNECEDORES.CódigoFOR
  Nome: string; // 7-FORNECEDORES.NOME
  CNPJ: string; // 7-FORNECEDORES.CNPJ_PROP
  Cidade: string; // 7-FORNECEDORES.CIDADE
  Telefone: string; // 7-FORNECEDORES.TELEFONE
}

export interface Colaborador {
  id: number; // 5-COLABORADORES.CódigoCOLAB
  Nome: string; // 5-COLABORADORES.NOME
  Funcao: string; // 5-COLABORADORES.FUNÇÃO
  CPF: string; // 5-COLABORADORES.CPF_ASSOC
  Data_Admissao: string; // 5-COLABORADORES.DATA-ADMIS
}

export interface Sindicato {
  id: number;
  Nome: string;
  Presidente: string;
  Gerente: string;
  Data_Fundacao: string;
  Data_Filiacao: string;
  Data_Registro_MTE: string;
  Numero_Registro_MTE: string;
  Data_Registro_Cartorio: string;
  Extensao_Base: string;
  CNPJ: string;
  Telefone: string;
  Endereco: string;
  Numero: string;
  Complemento: string;
  Bairro: string;
  Cidade: string;
  Estado: string;
  CEP: string;
  Email: string;
}

export interface ContaBancaria {
  id: number;
  Nome_Conta: string;
  Tipo_Conta: string;
  Banco: string;
  Agencia: string;
  Numero_Conta: string;
}

export type ViewState = 'dashboard' | 'associados' | 'associado-form' | 'sindicato-form' | 'eventos' | 'evento-form' | 'financeiro' | 'contas-form' | 'colaboradores' | 'chapas-form' | 'diretoria-form' | 'agenda-form' | 'ai-chat' | 'arquivo-gestao' | 'relatorios';
