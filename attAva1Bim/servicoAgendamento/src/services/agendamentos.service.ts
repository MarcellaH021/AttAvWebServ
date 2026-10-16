import { AppError } from '../errors/AppError';
import { Agendamento } from '../controllers/agendamentos.controller';

export async function criarAgendamentoService(dados: any, novoId: number) {
  let respostaCatalogo;
  
  try {
    //faze o fetch ao Serviço de Catálogo
    respostaCatalogo = await fetch(`http://localhost:3001/recursos/${dados.recursoId}`);
  } catch (erro) {
    throw new AppError("Falha de integração com o catálogo (Serviço indisponível)", 502, "servico-agendamentos");
  }

  //trata as respostas de erro do Catálogo
  if (respostaCatalogo.status === 404) {
    throw new AppError("Recurso não existe no catálogo", 404, "servico-agendamentos");
  }
  if (!respostaCatalogo.ok) {
    throw new AppError("Falha ao consultar catálogo", 502, "servico-agendamentos");
  }

  //obtem os dados do recurso
  const recurso = await respostaCatalogo.json();

  //aplica a Regra de Negócio (Conflito)
  if (recurso.status === "manutencao" || recurso.status === "indisponivel") {
    throw new AppError(`O recurso está ${recurso.status} e não pode ser reservado.`, 409, "servico-agendamentos");
  }

  //estrutura o agendamento para guardar em memória
  const agendamentoInterno: Agendamento = {
    id: novoId,
    solicitante: dados.solicitante,
    curso: dados.curso,
    recursoId: dados.recursoId,
    data: dados.data,
    horario: dados.horario,
    finalidade: dados.finalidade,
    status: "confirmado" //assume que confirmado se o recurso estava disponível
  };

  //estrutura a resposta final organizada exigida no contrato
  const respostaCliente = {
    id: agendamentoInterno.id,
    solicitante: agendamentoInterno.solicitante,
    curso: agendamentoInterno.curso,
    recurso: {
      id: recurso.id,
      nome: recurso.nome,
      local: recurso.local
    },
    data: agendamentoInterno.data,
    horario: agendamentoInterno.horario,
    status: agendamentoInterno.status
  };

  return { agendamentoInterno, respostaCliente };
}