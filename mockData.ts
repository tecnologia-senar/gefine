
import { Associado, Evento, Despesa, Receita, Colaborador, Fornecedor, Sindicato } from './types';

export const mockAssociados: Associado[] = [
  {
    id: 1,
    Nome_Produtor: "JOÃO DA SILVA",
    CPF: "123.456.789-00",
    Data_Nasc: "1975-04-12",
    Municipio: "PORTO VELHO",
    Estado_Civil: "CASADO(A)",
    Genero: "MASCULINO",
    Email: "joao.silva@faperon.org.br",
    Telefone: "(69) 99999-0001",
    Matricula: "2023001",
    Data_Filiacao: "2010-01-15",
    Status: "ATIVO(A)"
  },
  {
    id: 2,
    Nome_Produtor: "MARIA OLIVEIRA",
    CPF: "987.654.321-99",
    Data_Nasc: "1982-08-23",
    Municipio: "JI-PARANÁ",
    Estado_Civil: "SOLTEIRO(A)",
    Genero: "FEMININO",
    Email: "maria.oli@faperon.org.br",
    Telefone: "(69) 98888-0002",
    Matricula: "2023045",
    Data_Filiacao: "2015-06-20",
    Status: "ATIVO(A)"
  }
];

export const mockEventos: Evento[] = [
  {
    id: 101,
    Nome: "EXPOVEL 2025",
    Tipo: "FEIRA",
    Data_Inicio: "2025-07-10",
    Data_Fim: "2025-07-15",
    Local_Realizacao: "PARQUE DE EXPOSIÇÕES",
    Responsavel: "CARLOS MENDES",
    Status: "Em Planejamento",
    Descricao: "Evento principal do ano."
  },
  {
    id: 102,
    Nome: "CURSO DE MANEJO SUSTENTÁVEL",
    Tipo: "CURSO",
    Data_Inicio: "2025-03-05",
    Data_Fim: "2025-03-06",
    Local_Realizacao: "SEDE FAPERON",
    Responsavel: "ANA PAULA",
    Status: "Concluído"
  }
];

export const mockDespesas: Despesa[] = [
  {
    id: 501,
    EventoID: 101,
    Descricao: "ALUGUEL DE TENDAS",
    Valor: 5000.00,
    Data_Pagamento: "2025-06-01",
    Pagar_Para: "TENDAS RONDÔNIA",
    Tipo_Despesa: "ESTRUTURA",
    Centro_Custo: "EVENTOS"
  },
  {
    id: 502,
    EventoID: 101,
    Descricao: "PUBLICIDADE RÁDIO",
    Valor: 1500.00,
    Data_Pagamento: "2025-06-15",
    Pagar_Para: "RÁDIO RONDÔNIA",
    Tipo_Despesa: "MARKETING",
    Centro_Custo: "PUBLICIDADE"
  }
];

export const mockReceitas: Receita[] = [
  {
    id: 601,
    EventoID: 101,
    Descricao: "PATROCÍNIO OURO",
    Valor: 10000.00,
    Data_Recebimento: "2025-05-20",
    Receber_De: "BANCO DA AMAZÔNIA",
    Forma_Recebimento: "PIX"
  },
  {
    id: 602,
    EventoID: 102,
    Descricao: "INSCRIÇÕES",
    Valor: 2500.00,
    Data_Recebimento: "2025-03-01",
    Receber_De: "DIVERSOS",
    Forma_Recebimento: "BOLETO"
  }
];

export const mockColaboradores: Colaborador[] = [
  {
    id: 1,
    Nome: "ROBERTO SANTOS",
    Funcao: "GERENTE ADMINISTRATIVO",
    CPF: "111.222.333-44",
    Data_Admissao: "2018-02-01"
  }
];

export const mockSindicato: Sindicato = {
  id: 1,
  Nome: "NOME SEU SINDICATO RURAL",
  Presidente: "Hélio Dias de Souza",
  Gerente: "Sirlei Bedim",
  Data_Fundacao: "",
  Data_Filiacao: "",
  Data_Registro_MTE: "",
  Numero_Registro_MTE: "",
  Data_Registro_Cartorio: "",
  Extensao_Base: "",
  CNPJ: "00.000.000/0000-00",
  Telefone: "(65)3301-2894",
  Endereco: "Rua João Goulart",
  Numero: "1843",
  Complemento: "",
  Bairro: "Nossa Sra. das Graças",
  Cidade: "Porto Velho",
  Estado: "RO",
  CEP: "78195-000",
  Email: "faperon@faperon.org.br"
};
