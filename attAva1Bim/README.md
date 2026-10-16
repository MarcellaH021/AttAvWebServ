# Sistema de Reservas de Equipamentos e Laboratórios — IFMS

## Sobre o projeto

Este projeto foi desenvolvido para a atividade avaliativa do primeiro bimestre da disciplina de Web Services do Instituto Federal de Mato Grosso do Sul (IFMS).

A aplicação permite consultar recursos disponíveis para aulas práticas e realizar reservas de equipamentos e laboratórios. O sistema foi desenvolvido utilizando dois serviços independentes que se comunicam por meio de requisições HTTP.

O **Serviço de Catálogo** é responsável por cadastrar, consultar e atualizar os recursos. Já o **Serviço de Agendamentos** recebe as solicitações de reserva e consulta o catálogo antes de confirmar um agendamento. Dessa forma, uma reserva só é criada quando o recurso existe e está disponível.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- HTTP e arquitetura REST
- Fetch API para comunicação entre serviços
- JSON para envio e recebimento de dados
- Middlewares para validação, autenticação e tratamento de erros
- Thunder Client para realizar os testes das APIs

## Estrutura do projeto

```text
attAva1Bim/
├── servicoCatalogo/
│   ├── src/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── servicoAgendamento/
│   ├── src/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── evidencias/
└── README.md
```

## Como executar a aplicação

### 1. Pré-requisitos

Antes de iniciar, instale o [Node.js](https://nodejs.org/) e tenha um editor de código, como o Visual Studio Code.

Após baixar ou clonar o repositório, abra a pasta principal do projeto no terminal.

### 2. Iniciar o Serviço de Catálogo

Abra um terminal e execute:

```bash
cd servicoCatalogo
npm install
npm run dev
```

O serviço será iniciado no endereço:

`http://localhost:3001`

### 3. Iniciar o Serviço de Agendamentos

Abra um **segundo terminal**, mantendo o primeiro em execução, e execute:

```bash
cd servicoAgendamento
npm install
npm run dev
```

O serviço será iniciado no endereço:

`http://localhost:3000`

**Importante:** os dois serviços precisam permanecer em execução simultaneamente para que a criação de agendamentos funcione corretamente.

## Endpoints disponíveis

Todas as requisições que enviam dados devem utilizar o formato JSON.

### Serviço de Catálogo — porta 3001

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/recursos` | Lista os recursos cadastrados |
| GET | `/recursos/:id` | Busca um recurso pelo ID |
| POST | `/recursos` | Cadastra um novo recurso |
| PATCH | `/recursos/:id/status` | Atualiza o status de um recurso |

É possível filtrar os recursos utilizando parâmetros de consulta:

```text
GET http://localhost:3001/recursos?status=disponivel
GET http://localhost:3001/recursos?tipo=laboratorio
```

Exemplo de corpo JSON para cadastrar um recurso:

```json
{
  "nome": "Projetor",
  "tipo": "equipamento",
  "local": "Bloco B",
  "status": "disponivel"
}
```

Os tipos aceitos são `laboratorio` e `equipamento`. Os status aceitos são `disponivel`, `manutencao` e `indisponivel`.

### Serviço de Agendamentos — porta 3000

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/agendamentos` | Lista os agendamentos |
| GET | `/agendamentos/:id` | Busca um agendamento pelo ID |
| POST | `/agendamentos` | Cria uma reserva após consultar o catálogo |
| PATCH | `/agendamentos/:id/status` | Atualiza o status de um agendamento |
| DELETE | `/agendamentos/:id` | Remove um agendamento |

Também é possível filtrar os agendamentos:

```text
GET http://localhost:3000/agendamentos?curso=TSI
GET http://localhost:3000/agendamentos?status=confirmado
GET http://localhost:3000/agendamentos?curso=TSI&status=confirmado
```

Exemplo de corpo JSON para criar um agendamento:

```json
{
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 1,
  "data": "2026-10-20",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes"
}
```

O campo `recursoId` identifica o recurso que será consultado no catálogo. Se ele existir e estiver disponível, o sistema registra o agendamento com status `confirmado`.

Os status possíveis para um agendamento são `pendente`, `confirmado` e `cancelado`.

## Autenticação das rotas

Algumas operações exigem um token de autorização enviado no cabeçalho HTTP.

As rotas protegidas são:

- `PATCH /recursos/:id/status`
- `PATCH /agendamentos/:id/status`
- `DELETE /agendamentos/:id`

No Thunder Client, acesse a aba **Headers** e adicione:

| Key | Value |
|---|---|
| Authorization | `Bearer ifms2026` |

Sem o token correto, a API retorna o status HTTP `401 Unauthorized`.

## Comunicação entre os serviços

Quando uma solicitação de reserva é recebida, o Serviço de Agendamentos valida os dados e utiliza a função `fetch` para consultar o Serviço de Catálogo.

A aplicação trata os seguintes cenários:

- **201 Created:** reserva criada com sucesso.
- **400 Bad Request:** dados inválidos ou obrigatórios ausentes.
- **404 Not Found:** recurso ou agendamento não encontrado.
- **409 Conflict:** recurso em manutenção ou indisponível.
- **502 Bad Gateway:** falha na comunicação com o catálogo.
- **401 Unauthorized:** token ausente ou inválido em uma rota protegida.

Os erros são organizados em respostas JSON, facilitando a identificação dos problemas durante os testes.

## Como testar a aplicação

Os testes podem ser realizados com a extensão Thunder Client do Visual Studio Code.

1. Inicie os dois serviços.
2. Envie uma requisição `GET` para `http://localhost:3001/recursos` e confira os recursos cadastrados.
3. Envie uma requisição `GET` para `http://localhost:3001/recursos/1` para consultar um recurso específico.
4. Crie um agendamento com `POST http://localhost:3000/agendamentos`, utilizando o corpo JSON apresentado anteriormente.
5. Consulte `GET http://localhost:3000/agendamentos` para verificar a reserva.
6. Teste cenários de erro, como enviar dados incompletos, utilizar um ID inexistente e tentar reservar um recurso indisponível.
7. Teste as rotas protegidas com e sem o token de autorização.
8. Desligue temporariamente o Serviço de Catálogo e tente criar uma reserva para verificar o tratamento da falha de integração.

Os resultados dos testes podem ser registrados na pasta `evidencias/`, contendo capturas de tela das requisições e das respectivas respostas.

## Vídeo de demonstração e testes

Nesta seção será disponibilizado o vídeo demonstrando a execução da aplicação e os principais testes realizados.

**Link do vídeo:** [Inserir aqui o link do vídeo de demonstração]

O vídeo deverá apresentar:

- Inicialização dos dois serviços em terminais separados.
- Consulta e cadastro de recursos no catálogo.
- Criação de um agendamento válido.
- Consulta da reserva criada.
- Testes de validação e tratamento de erros.
- Testes de autenticação com e sem o token.
- Demonstração da comunicação HTTP entre os dois serviços.

## Observações

Os dados são armazenados em memória durante a execução da aplicação. Portanto, os recursos cadastrados e os agendamentos criados durante os testes não são persistidos após o encerramento ou reinício dos respectivos serviços.

O projeto utiliza dois serviços independentes, cada um com suas próprias responsabilidades, rotas, controladores e middlewares.

O diretório `node_modules` não deve ser enviado ao GitHub. As dependências podem ser instaladas novamente utilizando o comando `npm install` em cada serviço.

## Autor

**Marcella Hernandes de Souza**

Projeto acadêmico desenvolvido para a disciplina de Web Services — IFMS.

