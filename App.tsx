

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Menu, 
  X,
  Search,
  Plus,
  BarChart3,
  TrendingUp,
  TrendingDown,
  BrainCircuit,
  Building2,
  ScrollText,
  UserCog,
  Truck,
  UserPlus,
  Wallet,
  FolderOpen,
  Contact,
  Sprout,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Save,
  Printer,
  ArrowLeft,
  Undo2,
  Trash2,
  FilePlus,
  LayoutGrid,
  Binoculars,
  Landmark,
  Coins,
  ArrowUp,
  ArrowDown,
  FileText,
  History,
  FileSearch,
  Filter,
  Book,
  PieChart as PieIcon,
  FileBarChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { 
  mockAssociados, 
  mockEventos, 
  mockDespesas, 
  mockReceitas, 
  mockColaboradores,
  mockSindicato 
} from './mockData';
import { ViewState, Evento } from './types';
import { analyzeFinancialData } from './services/geminiService';
import { 
    generateSindicatoReport, 
    generateAssociadosReport, 
    generateColaboradoresReport, 
    generateChapasReport,
    generateEventosReport,
    generateGenericReport
} from './services/pdfService';


// --- Reusable Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ElementType, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg ${
      active 
        ? 'bg-green-700 text-white shadow-lg' 
        : 'text-green-100 hover:bg-green-800 hover:text-white'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </button>
);

const DashboardButton = ({ 
  label, 
  icon: Icon, 
  onClick, 
  highlight = false 
}: { 
  label: string, 
  icon: any, 
  onClick?: () => void,
  highlight?: boolean
}) => (
  <button 
    onClick={onClick}
    className={`
      relative p-4 rounded-xl shadow-sm border-2 transition-all duration-200
      flex flex-col items-center justify-center text-center h-32 w-full
      group hover:-translate-y-1 hover:shadow-md
      ${highlight 
        ? 'bg-green-50 border-green-200 hover:border-green-400' 
        : 'bg-white border-slate-200 hover:border-green-300'}
    `}
  >
    <div className={`
      p-2 rounded-full mb-3 transition-colors
      ${highlight ? 'bg-green-100 text-green-700' : 'bg-slate-50 text-slate-600 group-hover:bg-green-50 group-hover:text-green-600'}
    `}>
      <Icon className="w-6 h-6" />
    </div>
    <span className={`text-sm font-semibold ${highlight ? 'text-green-800' : 'text-slate-700 group-hover:text-green-800'}`}>
      {label}
    </span>
  </button>
);

const AccessToolbar = () => (
  <div className="flex items-center gap-2 bg-white p-1 border border-slate-300 rounded shadow-sm">
     <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded border border-transparent hover:border-slate-300" title="Imprimir"><Printer className="w-4 h-4" /></button>
     <div className="w-px h-4 bg-slate-300 mx-1"></div>
     <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded border border-transparent hover:border-slate-300" title="Primeiro"><ChevronsLeft className="w-4 h-4" /></button>
     <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded border border-transparent hover:border-slate-300" title="Anterior"><ChevronLeft className="w-4 h-4" /></button>
     <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded border border-transparent hover:border-slate-300" title="Próximo"><ChevronRight className="w-4 h-4" /></button>
     <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded border border-transparent hover:border-slate-300" title="Último"><ChevronsRight className="w-4 h-4" /></button>
     <div className="w-px h-4 bg-slate-300 mx-1"></div>
     <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded border border-transparent hover:border-slate-300" title="Desfazer"><Undo2 className="w-4 h-4" /></button>
     <button className="p-1.5 hover:bg-slate-100 text-red-600 rounded border border-transparent hover:border-slate-300" title="Excluir"><Trash2 className="w-4 h-4" /></button>
     <button className="p-1.5 hover:bg-slate-100 text-yellow-600 rounded border border-transparent hover:border-slate-300" title="Novo"><FilePlus className="w-4 h-4" /></button>
     <button className="p-1.5 hover:bg-slate-100 text-purple-600 rounded border border-transparent hover:border-slate-300" title="Salvar"><Save className="w-4 h-4" /></button>
  </div>
);

const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children?: React.ReactNode }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
    <div className="bg-slate-100 w-full max-w-5xl shadow-2xl rounded-lg overflow-hidden border border-slate-400 flex flex-col max-h-[90vh]">
       {/* Window Header */}
       <div className="bg-slate-200 px-4 py-2 flex justify-between items-center border-b border-slate-300 select-none">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
             <LayoutGrid className="w-4 h-4 text-purple-600" />
             GEFINE - SISTEMA FAPERON - RONDÔNIA
          </div>
          <button onClick={onClose} className="text-slate-500 hover:bg-red-500 hover:text-white px-2 rounded transition-colors">
             <X className="w-5 h-5" />
          </button>
       </div>
       
       {/* Form Title */}
       <div className="px-4 pt-4">
         <div className="bg-green-500 text-white text-center font-bold py-1 uppercase tracking-wider text-lg shadow-sm border-b-2 border-green-600">
            {title}
         </div>
       </div>

       {/* Content */}
       <div className="p-6 overflow-auto">
          {children}
       </div>
    </div>
  </div>
);

// --- Forms ---

const ChapasForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="CADASTRO DE CHAPA ELEITA" onClose={onClose}>
      <div className="space-y-4 mb-8 flex justify-center">
          <div className="border-2 border-slate-400 p-8 bg-white shadow-sm w-full max-w-2xl">
              <div className="grid grid-cols-12 gap-y-3 gap-x-2">
                  <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">NOME DA CHAPA</label>
                      <div className="flex-1 flex gap-1">
                        <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                        <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                      </div>
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">DATA DA ELEIÇÃO</label>
                      <input type="date" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">DATA DA POSSE</label>
                      <input type="date" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">INÍCIO DO MANDATO</label>
                      <div className="flex-1 flex gap-1">
                        <input type="date" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                         <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                      </div>
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">FIM DO MANDATO</label>
                      <div className="flex-1 flex gap-1">
                        <input type="date" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                        <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Registro: 1 de 1</div>
         <AccessToolbar />
      </div>
  </Modal>
);

const DiretoriaForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="CADASTRO DE DIRETORES" onClose={onClose}>
      <div className="space-y-6 mb-6">
          {/* Header Info - Chapa Context */}
           <div className="grid grid-cols-12 gap-y-3 gap-x-4 px-6">
              <div className="col-span-6 flex items-center">
                  <label className="w-32 text-xs font-bold text-slate-700 uppercase">NOME DA CHAPA</label>
                  <div className="flex-1 flex gap-1">
                    <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                    <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                  </div>
              </div>
              <div className="col-span-3 flex items-center">
                  <label className="w-32 text-xs font-bold text-slate-700 uppercase">DATA DA ELEIÇÃO</label>
                  <div className="flex-1 flex gap-1">
                    <input type="date" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                    <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                  </div>
              </div>
               <div className="col-span-3 flex items-center">
                  <label className="w-32 text-xs font-bold text-slate-700 uppercase">FIM DO MANDATO</label>
                  <div className="flex-1 flex gap-1">
                    <input type="date" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                    <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                  </div>
              </div>
          </div>

          <div className="flex justify-end px-6">
              <div className="flex gap-2">
                   <button className="p-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm"><ChevronLeft className="w-4 h-4 text-red-600" /></button>
                   <button className="p-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm"><ChevronRight className="w-4 h-4 text-red-600" /></button>
              </div>
          </div>

          {/* Main Form Area */}
          <div className="border-2 border-green-500 p-1 mx-6">
              <div className="bg-green-500 text-white text-center font-bold py-0.5 uppercase tracking-wider text-sm mb-4">
                 CADASTRO DE DIRETORES
              </div>
              <div className="px-8 pb-6 bg-white">
                  <div className="grid grid-cols-12 gap-y-3 gap-x-4">
                      <div className="col-span-12 flex items-center">
                          <label className="w-40 text-xs font-bold text-slate-700 uppercase">NOME</label>
                          <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                      </div>
                      <div className="col-span-12 flex items-center">
                          <label className="w-40 text-xs font-bold text-slate-700 uppercase">CARGO</label>
                          <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                      </div>
                      <div className="col-span-12 flex items-center">
                          <label className="w-40 text-xs font-bold text-slate-700 uppercase">DATA DE NASCIMENTO</label>
                          <input type="date" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                      </div>
                      <div className="col-span-12 flex items-center">
                          <label className="w-40 text-xs font-bold text-slate-700 uppercase">CPF</label>
                          <div className="flex-1 flex gap-1">
                             <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                             <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                          </div>
                      </div>
                      <div className="col-span-12 flex items-center">
                          <label className="w-40 text-xs font-bold text-slate-700 uppercase">INSCRIÇÃO ESTADUAL</label>
                          <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                      </div>
                      <div className="col-span-12 flex items-center">
                          <label className="w-40 text-xs font-bold text-slate-700 uppercase">TELEFONE</label>
                          <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                      </div>
                       <div className="col-span-12 flex items-center">
                          <label className="w-40 text-xs font-bold text-slate-700 uppercase">CELULAR</label>
                          <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                      </div>
                       <div className="col-span-12 flex items-center">
                          <label className="w-40 text-xs font-bold text-slate-700 uppercase">E-MAIL</label>
                          <input type="email" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Registro: 1 de 1</div>
         <AccessToolbar />
      </div>
  </Modal>
);

const ContadorForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="CADASTRO DE CONTADOR" onClose={onClose}>
      <div className="space-y-4 mb-8">
          <div className="flex gap-2 items-center">
              <label className="text-xs font-bold text-slate-500 uppercase w-24">CPF</label>
              <input type="text" className="border border-slate-400 w-32 px-1 py-0.5 text-sm" />
          </div>
          <div className="border border-slate-300 p-4 bg-white">
              <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 flex items-center">
                      <label className="text-xs font-bold text-slate-700 w-32 uppercase">Nome do Contador</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="text-xs font-bold text-slate-700 w-32 uppercase">Tel. Para Contato</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="text-xs font-bold text-slate-700 w-32 uppercase text-right pr-2">Cel. Para Contato</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="text-xs font-bold text-slate-700 w-32 uppercase">Endereço</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
              </div>
          </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Registro: 1 de 1</div>
         <AccessToolbar />
      </div>
  </Modal>
);

const ContasForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="CADASTRO DE CONTA DO SINDICATO RURAL" onClose={onClose}>
      <div className="space-y-4 mb-8 flex justify-center">
          <div className="border-2 border-slate-400 p-8 bg-white shadow-sm w-full max-w-2xl">
              <div className="grid grid-cols-12 gap-y-3 gap-x-2">
                  <div className="col-span-12 flex items-center">
                      <label className="w-36 text-xs font-bold text-slate-700 uppercase">NOME DA CONTA</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-36 text-xs font-bold text-slate-700 uppercase">TIPO DA CONTA</label>
                      <select className="flex-1 border border-slate-400 px-2 py-0.5 text-sm bg-white">
                         <option></option>
                         <option>CORRENTE</option>
                         <option>POUPANÇA</option>
                         <option>INVESTIMENTO</option>
                      </select>
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-36 text-xs font-bold text-slate-700 uppercase">BANCO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-12 flex items-center">
                      <label className="w-36 text-xs font-bold text-slate-700 uppercase">AGÊNCIA</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-36 text-xs font-bold text-slate-700 uppercase">Nº DA CONTA</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>
              </div>
          </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Registro: 1 de 1</div>
         <AccessToolbar />
      </div>
  </Modal>
);

const ReceitaForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="LANÇAMENTO DE ENTRADAS" onClose={onClose}>
      <div className="space-y-4 mb-6">
          <div className="border p-6 bg-white shadow-sm">
              <div className="grid grid-cols-12 gap-y-3 gap-x-4">
                  <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">CONTA DE DEPÓSITO</label>
                      <select className="flex-1 border border-slate-400 px-2 py-0.5 text-sm bg-white"><option>SELECIONE A CONTA</option></select>
                  </div>
                   <div className="col-span-4 flex items-center">
                      <label className="w-24 text-xs font-bold text-slate-700 uppercase">DATA</label>
                      <input type="date" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-8 flex items-center">
                      <label className="w-24 text-xs font-bold text-slate-700 uppercase pl-4">Nº DOCUMENTO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>

                  <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">HISTÓRICO / DESCRIÇÃO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>

                  <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">ORIGEM (RECEBER DE)</label>
                      <div className="flex-1 flex gap-1">
                         <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                         <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                      </div>
                  </div>

                   <div className="col-span-6 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">VALOR (R$)</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm font-bold text-green-700" placeholder="0,00" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-4">CENTRO DE CUSTO</label>
                      <select className="flex-1 border border-slate-400 px-2 py-0.5 text-sm bg-white"><option></option></select>
                  </div>
              </div>
          </div>
      </div>
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Novo Lançamento</div>
         <AccessToolbar />
      </div>
  </Modal>
);

const DespesaForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="LANÇAMENTO DE SAÍDAS" onClose={onClose}>
       <div className="space-y-4 mb-6">
          <div className="border p-6 bg-white shadow-sm">
              <div className="grid grid-cols-12 gap-y-3 gap-x-4">
                  <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">CONTA DE SAÍDA</label>
                      <select className="flex-1 border border-slate-400 px-2 py-0.5 text-sm bg-white"><option>SELECIONE A CONTA</option></select>
                  </div>
                   <div className="col-span-4 flex items-center">
                      <label className="w-24 text-xs font-bold text-slate-700 uppercase">DATA</label>
                      <input type="date" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-8 flex items-center">
                      <label className="w-24 text-xs font-bold text-slate-700 uppercase pl-4">Nº DOCUMENTO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">HISTÓRICO / DESCRIÇÃO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                  </div>

                  <div className="col-span-12 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">DESTINO (PAGAR PARA)</label>
                      <div className="flex-1 flex gap-1">
                         <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm" />
                         <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                      </div>
                  </div>

                   <div className="col-span-6 flex items-center">
                      <label className="w-40 text-xs font-bold text-slate-700 uppercase">VALOR (R$)</label>
                      <input type="text" className="flex-1 border border-slate-400 px-2 py-0.5 text-sm font-bold text-red-700" placeholder="0,00" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-4">CENTRO DE CUSTO</label>
                      <select className="flex-1 border border-slate-400 px-2 py-0.5 text-sm bg-white"><option></option></select>
                  </div>
              </div>
          </div>
      </div>
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Novo Lançamento</div>
         <AccessToolbar />
      </div>
  </Modal>
);


const ColaboradorForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="CADASTRO DE COLABORADOR" onClose={onClose}>
      <div className="space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
           {/* Photo */}
           <div className="w-40 h-48 bg-white border-2 border-slate-300 shadow-inner flex items-center justify-center text-slate-300 shrink-0">
              <Users className="w-16 h-16" />
           </div>

           <div className="flex-1 border border-slate-300 p-4 bg-white">
              <div className="grid grid-cols-12 gap-x-4 gap-y-3">
                  <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">NOME</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">FUNÇÃO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-2">PROFISSÃO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">DATA DE ADMISSÃO</label>
                      <input type="date" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-2">DATA DE NASCIMENTO</label>
                      <input type="date" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-9 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">ENDEREÇO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-3 flex items-center">
                      <label className="w-8 text-xs font-bold text-slate-700 uppercase pl-2">Nº</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">BAIRRO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-2">COMPLEMENTO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">RG</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-2">CPF</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">ORGÃO EMISSOR</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-2">CEP</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">NATURALIDADE</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
              </div>
           </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
             <label className="text-xs font-bold text-slate-400 uppercase">CÓD</label>
             <input type="text" className="border border-slate-300 bg-slate-100 w-20 px-1 py-0.5 text-sm text-center" disabled />
             <div className="bg-black text-white text-xs px-2 py-0.5 rounded-sm">(Novo)</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Registro: 1 de 1</div>
         <AccessToolbar />
      </div>
  </Modal>
);

const AgendaForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="AGENDA DE CONTATOS" onClose={onClose}>
      <div className="space-y-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-6">
           {/* Photo */}
           <div className="w-40 h-48 bg-white border-2 border-slate-300 shadow-inner flex items-center justify-center text-slate-300 shrink-0">
              <Contact className="w-16 h-16" />
           </div>

           <div className="flex-1 border border-slate-300 p-4 bg-white">
              <div className="grid grid-cols-12 gap-x-4 gap-y-3">
                  <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">NOME</label>
                      <div className="flex-1 flex gap-1">
                         <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                         <button className="bg-slate-100 border border-slate-400 p-1 hover:bg-slate-200"><Binoculars className="w-4 h-4" /></button>
                      </div>
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">CPF</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-2">PROFISSÃO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">RG</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-2">ORGÃO EXPEDIDOR</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">DATA DE NASCIMENTO</label>
                      <input type="date" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pl-2">NATURALIDADE</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-9 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">ENDEREÇO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-3 flex items-center">
                      <label className="w-8 text-xs font-bold text-slate-700 uppercase pl-2">Nº</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">COMPLEMENTO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-6 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">BAIRRO</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-6 flex items-center">
                      <label className="w-12 text-xs font-bold text-slate-700 uppercase pl-2 text-right">CEP</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">CIDADE</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                   <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">TELEFONE</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">CELULAR</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">E-MAIL</label>
                      <input type="email" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">FILIAÇÃO PATERNA</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  <div className="col-span-12 flex items-center">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase">FILIAÇÃO MATERNA</label>
                      <input type="text" className="flex-1 border border-slate-400 px-1 py-0.5 text-sm" />
                  </div>
                  
                  <div className="col-span-12 pt-2">
                      <div className="flex items-center">
                          <label className="text-xs font-bold text-slate-700 uppercase mr-4">JÁ PARTICIPOU DE CAPACITAÇÕES PROMOVIDAS PELO SR?</label>
                          <input type="checkbox" className="w-4 h-4 accent-green-600" />
                      </div>
                  </div>
                   <div className="col-span-12 flex items-start">
                      <label className="w-32 text-xs font-bold text-slate-700 uppercase pt-1">QUAIS?</label>
                      <textarea className="flex-1 border border-slate-400 px-1 py-0.5 text-sm h-16 resize-none" />
                  </div>
                  <div className="col-span-12 pt-2 flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 uppercase">DESEJA RECEBER E-MAIL DE DIVULGAÇÃO?</label>
                      <input type="checkbox" className="w-4 h-4 accent-green-600 mr-12" />
                  </div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-300 pt-4 mt-2">
         <button className="border border-slate-400 bg-white px-2 py-1 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
             Consultar Relação de<br />pessoas Cadastradas
         </button>
         <AccessToolbar />
      </div>
  </Modal>
);

const DependentesForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="CADASTRO DE DEPENDENTES" onClose={onClose}>
      <div className="space-y-4 mb-6">
          <div className="flex gap-2 items-center">
              <label className="text-xs font-bold text-slate-500 uppercase w-12">CPF</label>
              <input type="text" className="border border-slate-400 w-32 px-1 py-0.5 text-sm" />
          </div>
          
          {/* Grid */}
          <div className="bg-white border border-slate-400 h-64 overflow-auto relative">
             <table className="w-full text-xs border-collapse min-w-[600px]">
                <thead className="bg-slate-200 sticky top-0 z-10">
                    <tr>
                       <th className="border border-slate-400 px-2 py-1 text-left w-8 bg-yellow-200">*</th>
                       <th className="border border-slate-400 px-2 py-1 text-left w-1/3">NOME</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">RELAÇÃO PARENTAL</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">DATA DE NASCIMENTO</th>
                       <th className="border border-slate-400 px-2 py-1 text-center">TRABALHA NA PROPRIEDADE?</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Mock rows */}
                    {[...Array(15)].map((_, i) => (
                        <tr key={i} className="even:bg-slate-50 hover:bg-blue-50">
                            <td className="border border-slate-300 px-2 py-1 bg-slate-100"></td>
                            <td className="border border-slate-300 p-0">
                                <input type="text" className="w-full h-full px-2 py-1 bg-transparent outline-none" />
                            </td>
                            <td className="border border-slate-300 p-0">
                                <input type="text" className="w-full h-full px-2 py-1 bg-transparent outline-none" />
                            </td>
                            <td className="border border-slate-300 p-0">
                                <input type="date" className="w-full h-full px-2 py-1 bg-transparent outline-none" />
                            </td>
                            <td className="border border-slate-300 p-0 text-center align-middle">
                                <input type="checkbox" className="w-4 h-4 accent-green-600" />
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Registro: 1 de 1</div>
         <AccessToolbar />
      </div>
  </Modal>
);

const OutrasPropriedadesForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="CADASTRO DE OUTRAS PROPRIEDADES" onClose={onClose}>
      <div className="space-y-4 mb-6">
          <div className="flex gap-2 items-center">
              <label className="text-xs font-bold text-slate-500 uppercase w-12">CPF</label>
              <input type="text" className="border border-slate-400 w-32 px-1 py-0.5 text-sm" />
          </div>
          
          {/* Datasheet View Simulation */}
          <div className="bg-white border border-slate-400 h-64 overflow-auto relative">
             <table className="w-full text-xs border-collapse min-w-[1200px]">
                <thead className="bg-slate-200 sticky top-0 z-10">
                    <tr>
                       <th className="border border-slate-400 px-2 py-1 text-left w-8 bg-yellow-200">*</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">NOME</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">QTD TOTAL DE HA</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">MUNICÍPIO</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">ENDEREÇO</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">CCIR</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">MATRÍCULA</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">COMARCA</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">NIRF</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">1º PRODUTO</th>
                       <th className="border border-slate-400 px-2 py-1 text-left">QTD_HA1</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Empty Rows for effect */}
                    {[...Array(15)].map((_, i) => (
                        <tr key={i} className="even:bg-slate-50 hover:bg-blue-50">
                            <td className="border border-slate-300 px-2 py-1 bg-slate-100"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                            <td className="border border-slate-300 px-2 py-1"></td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Registro: 1 de 1</div>
         <AccessToolbar />
      </div>
  </Modal>
);

const UtilizacaoImovelForm = ({ onClose }: { onClose: () => void }) => (
  <Modal title="UTILIZAÇÃO DO IMÓVEL PRINCIPAL" onClose={onClose}>
      <div className="space-y-4 mb-8">
          <div className="flex gap-2 items-center">
              <label className="text-xs font-bold text-slate-500 uppercase w-12">CPF</label>
              <input type="text" className="border border-slate-400 w-32 px-1 py-0.5 text-sm" />
          </div>
          
          <div className="bg-white border border-slate-300 p-4 h-96 overflow-y-auto">
             <div className="grid grid-cols-1 gap-y-1 max-w-3xl mx-auto">
                {[
                    "Área total do imóvel",
                    "Área de preservação permanente",
                    "Área de reserva legal",
                    "Área de reserva particular do patrimônio natural (RPPN)",
                    "Área de interesse ecológico",
                    "Área de servidão ambiental",
                    "Área coberta por florestas nativas",
                    "Área alagada de reservatório de usinas hidrelétricas",
                    "Área tributável (ha)",
                    "Área ocupada com benfeitorias úteis e necessárias",
                    "Área aproveitável",
                    "Área de produtos vegetais",
                    "Área em descanso",
                    "Área de reflorestamento",
                    "Área de pastagem",
                    "Área de exploração extrativa",
                    "Área de atividade granjeira ou aquícola",
                    "Área de frustração de safra ou destruição de pastagem",
                    "Área utilizada na atividade rural (total)",
                    "Grau de utilização do imóvel (%)"
                ].map((label, idx) => (
                    <div key={idx} className="flex items-center border-b border-slate-100 py-1">
                        <label className="text-xs text-slate-700 flex-1">{label}</label>
                        <input type="text" className="border border-slate-400 w-32 px-1 py-0.5 text-sm" />
                    </div>
                ))}
             </div>
          </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-300 pt-4">
         <div className="text-xs text-slate-500">Registro: 1 de 1</div>
         <AccessToolbar />
      </div>
  </Modal>
);

const AssociadoFormView = ({ onBack }: { onBack: () => void }) => {
  const [showContador, setShowContador] = useState(false);
  const [showOutras, setShowOutras] = useState(false);
  const [showUtilizacao, setShowUtilizacao] = useState(false);
  const [showDependentes, setShowDependentes] = useState(false);

  return (
    <div className="bg-slate-100 p-4 rounded-lg shadow-lg border border-slate-300 max-w-7xl mx-auto font-sans relative">
      {/* Header */}
      <div className="bg-green-600 text-white text-center font-bold py-1 uppercase tracking-wider text-lg mb-6 rounded-sm shadow-sm">
        Cadastro de Associado
      </div>
      
      <div className="space-y-6 px-2">
        {/* Personal Info Section */}
        <div className="flex flex-col lg:flex-row gap-6">
           {/* Photo & ID */}
           <div className="w-full lg:w-48 flex flex-col gap-4 shrink-0 items-center lg:items-start">
              <div className="w-40 h-48 bg-white border-2 border-slate-300 shadow-inner flex items-center justify-center text-slate-300">
                 <Users className="w-16 h-16" />
              </div>
              <div className="w-40 border-2 border-slate-300 p-2 bg-white text-center shadow-sm">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nº de Filiação</label>
                <input type="text" className="w-full text-center font-bold text-slate-800 outline-none bg-transparent text-lg" placeholder="00000" />
              </div>
           </div>

           {/* Form Fields */}
           <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3">
              {/* Row 1 */}
              <div className="md:col-span-8">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NOME</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">GÊNERO</label>
                <select className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white">
                    <option>SELECIONE</option>
                    <option>MASCULINO</option>
                    <option>FEMININO</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">MODALIDADE</label>
                 <select className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"><option></option></select>
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">DATA DE FILIAÇÃO</label>
                 <input type="date" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">STATUS</label>
                 <select className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"><option>ATIVO</option></select>
              </div>

              {/* Row 3 */}
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">DATA DE NASCIMENTO</label>
                 <input type="date" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">RG</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">ORGÃO EXPEDIDOR</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              
               {/* Row 4 */}
               <div className="md:col-span-6">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">ENTIDADE</label>
                 <select className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"><option></option></select>
              </div>
              <div className="md:col-span-6">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">CPF OU CNPJ</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>

              {/* Row 5 */}
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NÚMERO DO INCRA</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">PROFISSÃO</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">TELEFONE FIXO</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>

               {/* Row 6 */}
               <div className="md:col-span-8">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">E-MAIL</label>
                 <input type="email" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">TELEFONE MÓVEL</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              
               {/* Row 7 */}
               <div className="md:col-span-8">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">ENDEREÇO</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Nº</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-3">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">BAIRRO</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>

               {/* Row 8 */}
               <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">COMPLEMENTO</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">CEP</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-6">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">CIDADE</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>

               {/* Row 9 */}
               <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NACIONALIDADE</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NATURALIDADE</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">ESTADO CIVIL</label>
                 <select className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"><option></option></select>
              </div>

              {/* Row 10 */}
              <div className="md:col-span-8">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NOME DA MÃE</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-0.5">INSCRIÇÃO ESTADUAL</label>
                 <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
           </div>
        </div>

        {/* Property Info Section */}
        <div className="bg-green-600 text-white text-center font-bold py-1 uppercase tracking-wider mt-2 text-sm rounded-sm shadow-sm">
           INFORMAÇÕES DA PROPRIEDADE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3 pt-2">
            <div className="md:col-span-6">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NOME DA PROPRIEDADE</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
            <div className="md:col-span-2 flex items-center pt-4 justify-center">
                <input type="checkbox" className="w-4 h-4 mr-2 accent-green-600" />
                <label className="text-[11px] font-bold text-slate-700">POSSUI FUNCIONÁRIOS?</label>
            </div>
             <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">MUNICÍPIO</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>

             <div className="md:col-span-6">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">CNPJ</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
             <div className="md:col-span-6">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NÚMERO DO INCRA</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>

             <div className="md:col-span-8">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">ENDEREÇO</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
             <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">QTD DE HA TOTAIS DA PROPRIEDADE</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>

             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">CCIR</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">QTD DE MÓD. RURAIS</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">1º PRODUTO</label>
                <select className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"><option></option></select>
            </div>
             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">QTD HA 1ºPRO</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>

            <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">MATRÍCULA</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">COMARCA</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">2º PRODUTO</label>
                <select className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"><option></option></select>
            </div>
             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">QTD HA 2ºPRO</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>

            <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Nº DO NIRF</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">INSCRIÇÃO CEI-INSS</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">3º PRODUTO</label>
                <select className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"><option></option></select>
            </div>
             <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">QTD HA 3ºPRO</label>
                <input type="text" className="w-full px-2 py-1 border border-slate-400 rounded-sm text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-green-600 text-white text-center font-bold py-1 uppercase tracking-wider mt-2 text-sm rounded-sm shadow-sm">
           CADASTRO DE INFORMAÇÕES ADICIONAIS
        </div>
        <div className="flex flex-wrap gap-4 justify-center py-6">
             <button onClick={() => setShowContador(true)} className="bg-white border-2 border-slate-300 text-slate-700 px-6 py-4 rounded font-bold text-xs hover:bg-slate-50 uppercase shadow-sm transition-transform active:scale-95">Cadastro de Contador</button>
             <button onClick={() => setShowDependentes(true)} className="bg-white border-2 border-slate-300 text-slate-700 px-6 py-4 rounded font-bold text-xs hover:bg-slate-50 uppercase shadow-sm transition-transform active:scale-95">Cadastro de Dependentes</button>
             <button onClick={() => setShowUtilizacao(true)} className="bg-white border-2 border-slate-300 text-slate-700 px-6 py-4 rounded font-bold text-xs hover:bg-slate-50 uppercase shadow-sm transition-transform active:scale-95">Utilização do Móvel<br/>Principal</button>
             <button onClick={() => setShowOutras(true)} className="bg-white border-2 border-slate-300 text-slate-700 px-6 py-4 rounded font-bold text-xs hover:bg-slate-50 uppercase shadow-sm transition-transform active:scale-95">Cadastro de Outras<br/>Propriedades</button>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-between items-center border-t border-slate-300 pt-4 mt-2">
            <div className="flex gap-3">
                <button className="bg-white border border-slate-400 px-4 py-2 rounded text-[11px] font-bold uppercase hover:bg-slate-100 shadow-sm">Certificado de Associação</button>
                <button className="bg-white border border-slate-400 px-4 py-2 rounded text-[11px] font-bold uppercase hover:bg-slate-100 shadow-sm">Ficha de Afiliação</button>
                <button className="bg-green-200 border border-green-500 text-green-900 px-4 py-2 rounded text-[11px] font-bold uppercase hover:bg-green-300 shadow-sm">Carteirinha</button>
            </div>
            
            <AccessToolbar />

            <div className="flex gap-3">
                <button onClick={onBack} className="p-2 border border-slate-400 rounded bg-white hover:bg-slate-100 text-slate-600 shadow-sm" title="Voltar">
                     <ArrowLeft className="w-5 h-5" />
                </button>
            </div>
        </div>
        
        {/* Status Bar Mockup */}
        <div className="text-[10px] text-slate-500 border-t border-slate-200 mt-2 pt-1 flex justify-between">
            <span>Registro: 1 de 1</span>
            <span>Sem Filtro</span>
            <span>Pesquisar</span>
        </div>
      </div>

      {/* Modals */}
      {showContador && <ContadorForm onClose={() => setShowContador(false)} />}
      {showDependentes && <DependentesForm onClose={() => setShowDependentes(false)} />}
      {showOutras && <OutrasPropriedadesForm onClose={() => setShowOutras(false)} />}
      {showUtilizacao && <UtilizacaoImovelForm onClose={() => setShowUtilizacao(false)} />}
    </div>
  );
};

// --- Fix: Added missing view components to resolve compilation errors ---

const DashboardView = ({ onViewChange }: { onViewChange: (view: ViewState, data?: any) => void }) => {
  const totalReceitas = useMemo(() => mockReceitas.reduce((acc, r) => acc + r.Valor, 0), []);
  const totalDespesas = useMemo(() => mockDespesas.reduce((acc, d) => acc + d.Valor, 0), []);
  const saldo = totalReceitas - totalDespesas;
  
  const eventosFuturos = useMemo(() => mockEventos.filter(e => new Date(e.Data_Inicio) > new Date()).length, []);

  const data = [
    { name: 'Jan', Receitas: 4000, Despesas: 2400 },
    { name: 'Fev', Receitas: 3000, Despesas: 1398 },
    { name: 'Mar', Receitas: 2000, Despesas: 9800 },
    { name: 'Abr', Receitas: 2780, Despesas: 3908 },
    { name: 'Mai', Receitas: 1890, Despesas: 4800 },
    { name: 'Jun', Receitas: 2390, Despesas: 3800 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Cards */}
        <div className="bg-white p-5 rounded-lg shadow border border-slate-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Saldo Atual</p>
              <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-700' : 'text-red-700'}`}>{saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border border-slate-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Associados Ativos</p>
              <p className="text-2xl font-bold text-slate-800">{mockAssociados.filter(a => a.Status === 'ATIVO(A)').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border border-slate-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Próximos Eventos</p>
              <p className="text-2xl font-bold text-slate-800">{eventosFuturos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border border-slate-200">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Colaboradores</p>
              <p className="text-2xl font-bold text-slate-800">{mockColaboradores.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Visão Geral Financeira (Últimos 6 Meses)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/>
              <Legend />
              <Bar dataKey="Receitas" fill="#16a34a" />
              <Bar dataKey="Despesas" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
           <h2 className="text-lg font-semibold text-slate-800 mb-4">Acessos Rápidos</h2>
           <div className="grid grid-cols-2 gap-4">
              <DashboardButton label="Cadastrar Associado" icon={UserPlus} onClick={() => onViewChange('associado-form')} />
              <DashboardButton label="Novo Evento" icon={Calendar} onClick={() => onViewChange('evento-form')} />
              <DashboardButton label="Lançar Receita" icon={TrendingUp} onClick={() => { /* needs modal */ }} />
              <DashboardButton label="Lançar Despesa" icon={TrendingDown} onClick={() => { /* needs modal */ }} />
              <DashboardButton label="Dados do Sindicato" icon={Building2} onClick={() => onViewChange('sindicato-form')} />
              <DashboardButton label="Assistente AI" icon={BrainCircuit} onClick={() => onViewChange('ai-chat')} highlight />
           </div>
        </div>
      </div>
    </div>
  );
};

const AssociadosView = ({ onViewChange }: { onViewChange: (view: ViewState, data?: any) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredAssociados = mockAssociados.filter(a =>
    a.Nome_Produtor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.CPF.includes(searchTerm) ||
    a.Municipio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Associados</h1>
        <button
          onClick={() => onViewChange('associado-form')}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Associado
        </button>
      </div>
      <div className="mb-4 relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Pesquisar por nome, CPF ou município..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3">Matrícula</th>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">CPF</th>
              <th scope="col" className="px-6 py-3">Município</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssociados.map(associado => (
              <tr key={associado.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{associado.Matricula}</td>
                <td className="px-6 py-4">{associado.Nome_Produtor}</td>
                <td className="px-6 py-4">{associado.CPF}</td>
                <td className="px-6 py-4">{associado.Municipio}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${associado.Status === 'ATIVO(A)' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {associado.Status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onViewChange('associado-form', associado)} className="font-medium text-green-600 hover:underline">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SindicatoFormView = ({ onBack }: { onBack: () => void }) => {
    const [sindicato, setSindicato] = useState(mockSindicato);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSindicato(prev => ({...prev, [name]: value}));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold text-slate-800">Dados do Sindicato</h1>
                 <button onClick={onBack} className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-100 text-slate-600 shadow-sm" title="Voltar">
                     <ArrowLeft className="w-5 h-5" />
                </button>
            </div>
            
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Nome</label>
                        <input type="text" name="Nome" value={sindicato.Nome} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">CNPJ</label>
                        <input type="text" name="CNPJ" value={sindicato.CNPJ} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Presidente</label>
                        <input type="text" name="Presidente" value={sindicato.Presidente} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Gerente</label>
                        <input type="text" name="Gerente" value={sindicato.Gerente} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700">Endereço</label>
                    <input type="text" name="Endereco" value={sindicato.Endereco} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Cidade</label>
                        <input type="text" name="Cidade" value={sindicato.Cidade} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Estado</label>
                        <input type="text" name="Estado" value={sindicato.Estado} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">CEP</label>
                        <input type="text" name="CEP" value={sindicato.CEP} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Telefone</label>
                        <input type="text" name="Telefone" value={sindicato.Telefone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" name="Email" value={sindicato.Email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                 </div>

                <div className="pt-4 flex justify-end">
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        <Save className="w-5 h-5" />
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

const EventosView = ({ onViewChange }: { onViewChange: (view: ViewState, data?: any) => void }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Eventos</h1>
        <button
          onClick={() => onViewChange('evento-form')}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Evento
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEventos.map(evento => (
          <div key={evento.id} className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex justify-between items-start">
                  <h2 className="font-bold text-lg text-slate-800">{evento.Nome}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${evento.Status === 'Concluído' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {evento.Status}
                  </span>
              </div>
              <p className="text-sm text-slate-500">{evento.Tipo}</p>
              <p className="text-sm text-slate-600 mt-2">{new Date(evento.Data_Inicio).toLocaleDateString()} - {new Date(evento.Data_Fim).toLocaleDateString()}</p>
              <p className="text-sm text-slate-600">{evento.Local_Realizacao}</p>
              {evento.Descricao && <p className="text-xs text-slate-500 mt-2 italic">"{evento.Descricao}"</p>}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => onViewChange('evento-form', evento)} className="text-sm font-semibold text-green-600 hover:text-green-800">
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventosFormView = ({ onBack, evento }: { onBack: () => void, evento?: Evento }) => {
    const [formData, setFormData] = useState<Partial<Evento>>(evento || {
        Nome: '',
        Tipo: '',
        Data_Inicio: '',
        Data_Fim: '',
        Local_Realizacao: '',
        Responsavel: '',
        Status: 'Em Planejamento'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold text-slate-800">{evento ? 'Editar Evento' : 'Novo Evento'}</h1>
                 <button onClick={onBack} className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-100 text-slate-600 shadow-sm" title="Voltar">
                     <ArrowLeft className="w-5 h-5" />
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Nome do Evento</label>
                    <input type="text" name="Nome" value={formData.Nome} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Tipo</label>
                        <input type="text" name="Tipo" value={formData.Tipo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <select name="Status" value={formData.Status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm">
                            <option>Em Planejamento</option>
                            <option>Concluído</option>
                            <option>Cancelado</option>
                        </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Data de Início</label>
                        <input type="date" name="Data_Inicio" value={formData.Data_Inicio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Data de Fim</label>
                        <input type="date" name="Data_Fim" value={formData.Data_Fim} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                 </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Local de Realização</label>
                    <input type="text" name="Local_Realizacao" value={formData.Local_Realizacao} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Responsável</label>
                    <input type="text" name="Responsavel" value={formData.Responsavel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Descrição (Opcional)</label>
                    <textarea name="Descricao" value={formData.Descricao} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                </div>
                <div className="pt-4 flex justify-end">
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        <Save className="w-5 h-5" />
                        Salvar Evento
                    </button>
                </div>
            </div>
        </div>
    );
};

const FinanceiroView = ({ onViewChange }: { onViewChange: (view: ViewState, data?: any) => void }) => {
  const [activeTab, setActiveTab] = useState('geral');
  const [showReceitaForm, setShowReceitaForm] = useState(false);
  const [showDespesaForm, setShowDespesaForm] = useState(false);

  const totalReceitas = useMemo(() => mockReceitas.reduce((acc, r) => acc + r.Valor, 0), []);
  const totalDespesas = useMemo(() => mockDespesas.reduce((acc, d) => acc + d.Valor, 0), []);
  const saldo = totalReceitas - totalDespesas;
  
  const pieData = [
    { name: 'Estrutura', value: 5000 },
    { name: 'Marketing', value: 1500 },
    { name: 'Outros', value: 3000 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderGeral = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-sm text-green-700 font-semibold">Total de Receitas</p>
          <p className="text-2xl font-bold text-green-800">{totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-sm text-red-700 font-semibold">Total de Despesas</p>
          <p className="text-2xl font-bold text-red-800">{totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-700 font-semibold">Saldo</p>
          <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-800' : 'text-red-800'}`}>{saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4">Distribuição de Despesas por Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderTable = (data: any[], type: 'receita' | 'despesa') => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
          <tr>
            <th className="px-6 py-3">Descrição</th>
            <th className="px-6 py-3">Valor</th>
            <th className="px-6 py-3">{type === 'receita' ? 'Data Receb.' : 'Data Pag.'}</th>
            <th className="px-6 py-3">{type === 'receita' ? 'Receber De' : 'Pagar Para'}</th>
            <th className="px-6 py-3">{type === 'despesa' ? 'Centro de Custo' : 'Forma Receb.'}</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">{item.Descricao}</td>
              <td className={`px-6 py-4 font-bold ${type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>{item.Valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td className="px-6 py-4">{new Date(type === 'receita' ? item.Data_Recebimento : item.Data_Pagamento).toLocaleDateString()}</td>
              <td className="px-6 py-4">{type === 'receita' ? item.Receber_De : item.Pagar_Para}</td>
              <td className="px-6 py-4">{type === 'despesa' ? item.Centro_Custo : item.Forma_Recebimento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Painel Financeiro</h1>
        <div className="flex gap-2">
           <button onClick={() => setShowReceitaForm(true)} className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-semibold">
              <ArrowUp className="w-4 h-4" /> Nova Receita
           </button>
           <button onClick={() => setShowDespesaForm(true)} className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold">
             <ArrowDown className="w-4 h-4" /> Nova Despesa
           </button>
           <button onClick={() => onViewChange('contas-form')} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold">
              <Landmark className="w-4 h-4" /> Contas Bancárias
           </button>
        </div>
      </div>
      
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('geral')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'geral' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Visão Geral</button>
          <button onClick={() => setActiveTab('receitas')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'receitas' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Receitas</button>
          <button onClick={() => setActiveTab('despesas')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'despesas' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Despesas</button>
        </nav>
      </div>

      <div>
        {activeTab === 'geral' && renderGeral()}
        {activeTab === 'receitas' && renderTable(mockReceitas, 'receita')}
        {activeTab === 'despesas' && renderTable(mockDespesas, 'despesa')}
      </div>

      {showReceitaForm && <ReceitaForm onClose={() => setShowReceitaForm(false)} />}
      {showDespesaForm && <DespesaForm onClose={() => setShowDespesaForm(false)} />}
    </div>
  );
};

const AIChatView = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [response]);

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');
    
    const financialData = {
      receitas: mockReceitas,
      despesas: mockDespesas
    };

    try {
      const result = await analyzeFinancialData(JSON.stringify(financialData, null, 2), query);
      setResponse(result);
    } catch (err: any) {
      setError('Ocorreu um erro ao comunicar com a IA. Verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 flex flex-col h-[75vh]">
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BrainCircuit className="text-green-600" />
          Assistente Financeiro IA (Gemini)
        </h1>
        <p className="text-sm text-slate-500">Faça perguntas sobre os dados financeiros do sistema.</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0">
            <BrainCircuit size={18}/>
          </div>
          <div className="bg-green-100 p-3 rounded-lg rounded-tl-none">
            <p className="text-sm text-slate-800">Olá! Eu sou o assistente financeiro do GEFINE. Como posso ajudar a analisar suas receitas e despesas hoje?</p>
          </div>
        </div>

        {response && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0">
                <BrainCircuit size={18}/>
              </div>
              <div className="bg-green-100 p-3 rounded-lg rounded-tl-none">
                <p className="text-sm text-slate-800 whitespace-pre-wrap">{response}</p>
              </div>
            </div>
        )}

        {isLoading && (
            <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0">
                <BrainCircuit size={18}/>
              </div>
              <div className="bg-green-100 p-3 rounded-lg rounded-tl-none">
                <p className="text-sm text-slate-800 italic">Analisando...</p>
              </div>
            </div>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Ex: Qual foi o total de despesas com marketing?"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ArquivoView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-slate-800">Arquivo e Gestão de Documentos</h1>
           <button onClick={onBack} className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-100 text-slate-600 shadow-sm" title="Voltar">
               <ArrowLeft className="w-5 h-5" />
          </button>
      </div>
      <p className="text-slate-600">Esta seção é para gerenciamento de arquivos e documentos do sindicato. (Em desenvolvimento)</p>
    </div>
  );
};

const RelatoriosView = ({ onViewChange }: { onViewChange: (view: ViewState, data?: any) => void }) => {
    const [associadosFilter, setAssociadosFilter] = useState<'TODOS' | 'ATIVOS' | 'INATIVOS' | 'APTOS'>('TODOS');
    const [associadosSort, setAssociadosSort] = useState<'ALFA' | 'MATRICULA'>('ALFA');

    const reportItems = [
        { title: "Dados do Sindicato", icon: Building2, action: generateSindicatoReport },
        { title: "Relação de Colaboradores", icon: UserCog, action: generateColaboradoresReport },
        { title: "Histórico de Chapas", icon: History, action: generateChapasReport },
        { title: "Relatório de Eventos", icon: Calendar, action: generateEventosReport },
        { title: "Balanço Financeiro", icon: PieIcon, action: () => generateGenericReport("Balanço Financeiro") },
        { title: "Livro Caixa", icon: Book, action: () => generateGenericReport("Livro Caixa") }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Central de Relatórios</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-green-600"/>Relatório de Associados</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600 mr-2">Filtrar por:</label>
                        <select value={associadosFilter} onChange={e => setAssociadosFilter(e.target.value as any)} className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm">
                            <option value="TODOS">Todos</option>
                            <option value="ATIVOS">Ativos</option>
                            <option value="INATIVOS">Inativos</option>
                            <option value="APTOS">Aptos a Votar</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-600 mr-2">Ordenar por:</label>
                        <select value={associadosSort} onChange={e => setAssociadosSort(e.target.value as any)} className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm">
                            <option value="ALFA">Ordem Alfabética</option>
                            <option value="MATRICULA">Matrícula</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => generateAssociadosReport(associadosFilter, associadosSort)}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <FileBarChart className="w-5 h-5"/>
                        Gerar Relatório
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                 <h2 className="text-xl font-semibold text-slate-700 mb-4">Outros Relatórios</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {reportItems.map(item => (
                        <button key={item.title} onClick={item.action} className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-green-300 transition-colors">
                            <item.icon className="w-8 h-8 text-slate-500 mb-2" />
                            <span className="text-sm text-center font-medium text-slate-700">{item.title}</span>
                        </button>
                    ))}
                 </div>
            </div>

        </div>
    );
};

// --- Main Layout ---

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedData, setSelectedData] = useState<any>(null);

  const handleViewChange = (view: ViewState, data: any = null) => {
    setSelectedData(data);
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView onViewChange={handleViewChange} />;
      case 'associados': return <AssociadosView onViewChange={handleViewChange} />;
      case 'associado-form': return <AssociadoFormView onBack={() => handleViewChange('associados')} />;
      case 'sindicato-form': return <SindicatoFormView onBack={() => handleViewChange('dashboard')} />;
      case 'eventos': return <EventosView onViewChange={handleViewChange} />;
      case 'evento-form': return <EventosFormView onBack={() => handleViewChange('eventos')} evento={selectedData} />;
      case 'financeiro': return <FinanceiroView onViewChange={handleViewChange} />;
      case 'contas-form': return <ContasForm onClose={() => handleViewChange('financeiro')} />;
      case 'ai-chat': return <AIChatView />;
      case 'colaboradores': return <ColaboradorForm onClose={() => handleViewChange('dashboard')} />;
      case 'chapas-form': return <ChapasForm onClose={() => handleViewChange('dashboard')} />;
      case 'diretoria-form': return <DiretoriaForm onClose={() => handleViewChange('dashboard')} />;
      case 'agenda-form': return <AgendaForm onClose={() => handleViewChange('dashboard')} />;
      case 'arquivo-gestao': return <ArquivoView onBack={() => handleViewChange('dashboard')} />;
      case 'relatorios': return <RelatoriosView onViewChange={handleViewChange} />;
      default: return <DashboardView onViewChange={handleViewChange} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 -ml-4'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wide text-green-400">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="whitespace-nowrap text-green-50">FAPERON</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => handleViewChange('dashboard')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Associados" 
            active={currentView === 'associados' || currentView === 'associado-form'} 
            onClick={() => handleViewChange('associados')} 
          />
           <SidebarItem 
            icon={Calendar} 
            label="Eventos" 
            active={currentView === 'eventos' || currentView === 'evento-form'} 
            onClick={() => handleViewChange('eventos')} 
          />
           <SidebarItem 
            icon={DollarSign} 
            label="Financeiro" 
            active={currentView === 'financeiro' || currentView === 'contas-form'} 
            onClick={() => handleViewChange('financeiro')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Relatórios" 
            active={currentView === 'relatorios'} 
            onClick={() => handleViewChange('relatorios')} 
          />
          <div className="pt-4 pb-2">
             <p className="px-4 text-xs font-bold text-slate-500 uppercase">Inteligência</p>
          </div>
          <SidebarItem 
            icon={BrainCircuit} 
            label="Assistente AI" 
            active={currentView === 'ai-chat'} 
            onClick={() => handleViewChange('ai-chat')} 
          />
        </nav>

        <div className="p-4 bg-slate-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">A</div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white">Admin</p>
                    <p className="text-xs text-slate-400 truncate">admin@faperon.org.br</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
                <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-700 hidden sm:block">
                GEFINE - SISTEMA FAPERON
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Pesquisar no sistema..." 
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none w-64"
                />
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {renderContent()}
            </div>
        </div>
        
        <footer className="bg-white border-t border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500">
                Desenvolvimento Trinidad Tecnologida Ltda - Todos os direitos reservados.
            </p>
        </footer>
      </main>
    </div>
  );
}

export default App;