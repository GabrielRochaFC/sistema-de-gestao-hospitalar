# Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS)

Sistema backend para gerenciamento de pacientes, profissionais de saúde, unidades hospitalares, leitos, internações, consultas (agendamentos), exames, histórico clínico e prescrições. Inclui autenticação JWT, controle de acesso baseado em papéis (ADMIN, PATIENT, PROFESSIONAL) e validação de dados com Zod.

> Projeto desenvolvido com fins educacionais para a realização de trabalho acadêmico da **Universidade Internacional (Centro Universitário Internacional Uninter)**.

## Sumário

- [Visão Geral](#visão-geral)
- [Stack & Principais Tecnologias](#stack--principais-tecnologias)
- [Requisitos de Ambiente](#requisitos-de-ambiente)
- [Variáveis de Ambiente (.env)](#variáveis-de-ambiente-env)
- [Banco de Dados, Docker & Prisma](#banco-de-dados-docker--prisma)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Rotas da API](#rotas-da-api)
  - [Autenticação](#autenticação)
  - [Usuários](#usuários)
  - [Pacientes](#pacientes)
  - [Profissionais](#profissionais)
  - [Unidades Hospitalares](#unidades-hospitalares)
  - [Leitos](#leitos)
  - [Internações (Admissions)](#internações-admissions)
  - [Agendamentos / Consultas (Appointments)](#agendamentos--consultas-appointments)
  - [Exames](#exames)
  - [Histórico Clínico](#histórico-clínico)
  - [Prescrições](#prescrições)
- [Padrão de Erros](#padrão-de-erros)
- [Aviso Educacional](#aviso-educacional)
- [Autenticação e Autorização](#autenticação-e-autorização)

---

## Visão Geral

O SGHSS provê endpoints REST para:

- Cadastro e autenticação de usuários com múltiplos papéis.
- Associação de perfis de Paciente e Profissional a um usuário.
- Gerenciamento de unidades hospitalares e seus profissionais.
- Controle de leitos, internações e altas.
- Agendamento, atualização e cancelamento de consultas (incluindo telemedicina via campo `telemedicineUrl`).
- Criação e fluxo de exames (solicitação, agendamento, início, conclusão, cancelamento).
- Registro de histórico clínico e prescrições médicas com itens.
- Listagens paginadas de recursos sensíveis por papel.

Segurança:

- JWT via header `Authorization: Bearer <token>`.
- Middleware `ensureAuthenticated` valida o token.
- Middleware `verifyUserAuthorization` restringe acesso por papéis.
- Validação de entrada com Zod; erros padronizados (`AppError`).

## Stack & Principais Tecnologias

| Categoria      | Tecnologias                              |
| -------------- | ---------------------------------------- |
| Runtime        | Node.js (TypeScript, ES Modules)         |
| Framework HTTP | Express                                  |
| ORM            | Prisma                                   |
| Banco de Dados | PostgreSQL (Docker)                      |
| Auth           | JSON Web Token (jsonwebtoken) + bcrypt   |
| Validação      | Zod                                      |
| Segurança      | Helmet, CORS                             |
| Utilidades     | dotenv, @brazilian-utils/brazilian-utils |

## Requisitos de Ambiente

- Node.js >= 18 (recomendado LTS)
- NPM >= 9 (ou Yarn/Pnpm equivalente)
- Docker + Docker Compose (PostgreSQL)

## Variáveis de Ambiente (.env)

Arquivo `.env` deve conter (exemplo):

```env
# Aplicação
PORT=3000
BASE_URL=http://localhost:3000

# Banco de Dados (usar config docker-compose)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sghss?schema=public"

# Autenticação
JWT_SECRET=uma_chave_segura_longa

# Seed (admin inicial)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=Master
ADMIN_CPF=00000000000
```

Validados em `src/env.ts`:

- `PORT` (coerção para number, default 3000)
- `BASE_URL` (URL obrigatória)
- `DATABASE_URL` (URL obrigatória)
- `JWT_SECRET` (string não vazia)

Para executar o seed de admin, todas as variáveis `ADMIN_*` são necessárias.

Veja o arquivo `.env.example` para mais detalhes.

## Banco de Dados, Docker & Prisma

Subir PostgreSQL:

```bash
docker-compose up -d
```

Migrations & client:

```bash
npx prisma migrate dev
npx prisma generate
```

Seed (cria usuário ADMIN se não existir):

```bash
npx prisma db seed
```

Caso erro de conexão: verifique `DATABASE_URL`, container ativo e repita comandos.

Migrations ficam em `prisma/migrations/` refletindo evolução (users, patients, professionals, appointments, hospital_units, beds, admissions, exams, clinical_notes, prescriptions, etc.).

## Como Rodar o Projeto

Instalar dependências:

```bash
npm install
```

Desenvolvimento (watch TS):

```bash
npm run dev
```

## Rotas da API

Montadas em `src/routes/index.ts`. Caso queira visualizar as rotas no insomnia, importe o arquivo `rotas_insomnia.yaml` no seu workspace do Insomnia.

### Convenções

- Exceto `/auth/login` e `/auth/register`, todas exigem JWT.
- Papel necessário indicado na coluna Acesso.
- Paginação via `page` e `limit` em listagens (quando suportado).

### Autenticação

| Método | Caminho        | Descrição         | Acesso  |
| ------ | -------------- | ----------------- | ------- |
| POST   | /auth/login    | Login e token JWT | Público |
| POST   | /auth/register | Registrar usuário | Público |

### Usuários

Prefixo: `/users`
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| GET | /users/me | Usuário autenticado | Autenticado |
| PUT | /users/me | Atualizar próprio perfil | Autenticado |
| GET | /users | Listar ativos | ADMIN |
| GET | /users/all | Listar todos (inclui inativos) | ADMIN |
| GET | /users/:id | Buscar por ID | ADMIN |
| PUT | /users/:id | Atualizar por ID | ADMIN |
| PATCH | /users/:id/status | Alterar status | ADMIN |
| DELETE | /users/:id | Remover usuário | ADMIN |

### Pacientes

Prefixo: `/patients`
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| POST | /patients | Criar perfil paciente | Autenticado |
| GET | /patients/appointments | Consultas do paciente | PATIENT |
| GET | /patients/appointments/telemedicine | Consultas telemedicina | PATIENT |
| GET | /patients/exams | Exames do paciente | PATIENT |
| GET | /patients/clinical-notes | Histórico clínico do paciente | PATIENT |
| GET | /patients/prescriptions | Prescrições do paciente | PATIENT |

### Profissionais

Prefixo: `/professionals`
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| POST | /professionals | Criar perfil profissional | Autenticado |
| GET | /professionals/appointments | Consultas do profissional | PROFESSIONAL |
| GET | /professionals/exams | Exames do profissional | PROFESSIONAL |

### Unidades Hospitalares

Prefixo: `/hospital-units`
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| POST | /hospital-units | Criar unidade | ADMIN |
| GET | /hospital-units | Listar unidades | Autenticado |
| PUT | /hospital-units/:id | Atualizar unidade | ADMIN |
| POST | /hospital-units/:id/professionals | Adicionar profissional | ADMIN |
| GET | /hospital-units/:id/professionals | Listar profissionais da unidade | ADMIN, PROFESSIONAL |
| GET | /hospital-units/:id/appointments | Listar consultas da unidade | ADMIN, PROFESSIONAL |
| GET | /hospital-units/:id/admissions | Listar internações da unidade | ADMIN |

### Leitos

Prefixo: `/beds`
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| POST | /beds | Criar leito | ADMIN |
| GET | /beds/:id | Obter leito | ADMIN |
| GET | /beds/unit/:unitId | Leitos por unidade | ADMIN |
| PUT | /beds/:id | Atualizar leito | ADMIN |
| DELETE | /beds/:id | Remover leito | ADMIN |

### Internações (Admissions)

Prefixo: `/admissions` (todas ADMIN)
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| POST | /admissions | Criar internação | ADMIN |
| GET | /admissions/:id | Obter internação | ADMIN |
| POST | /admissions/:id/discharge | Dar alta | ADMIN |
| POST | /admissions/:id/cancel | Cancelar internação | ADMIN |

### Agendamentos / Consultas (Appointments)

Prefixo: `/appointments`
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| POST | /appointments | Criar consulta | PATIENT |
| PATCH | /appointments/:appointmentId | Cancelar consulta | PATIENT |
| PUT | /appointments/:appointmentId | Atualizar consulta | PROFESSIONAL, ADMIN |

### Exames

Prefixo: `/exams` (ADMIN, PROFESSIONAL)
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| POST | /exams | Criar exame | ADMIN, PROFESSIONAL |
| GET | /exams/:id | Obter exame | ADMIN, PROFESSIONAL |
| GET | /exams/patient/:patientId | Exames por paciente | ADMIN, PROFESSIONAL |
| GET | /exams/unit/:unitId | Exames por unidade | ADMIN, PROFESSIONAL |
| POST | /exams/:id/schedule | Agendar exame | ADMIN, PROFESSIONAL |
| POST | /exams/:id/start | Iniciar exame | ADMIN, PROFESSIONAL |
| POST | /exams/:id/complete | Concluir exame | ADMIN, PROFESSIONAL |
| POST | /exams/:id/cancel | Cancelar exame | ADMIN, PROFESSIONAL |

### Histórico Clínico

Prefixo: `/clinical-notes`
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| POST | /clinical-notes | Criar registro de histórico clínico | PROFESSIONAL |
| GET | /clinical-notes/patient/:patientId | Histórico clínico por paciente | PROFESSIONAL, ADMIN |
| GET | /clinical-notes/professional/me | Histórico clínico do profissional | PROFESSIONAL |

### Prescrições

Prefixo: `/prescriptions`
| Método | Caminho | Descrição | Acesso |
|--------|---------|-----------|--------|
| POST | /prescriptions | Criar prescrição | PROFESSIONAL |
| POST | /prescriptions/:id/cancel | Cancelar prescrição | PROFESSIONAL, ADMIN |
| GET | /prescriptions/patient/:patientId | Prescrições por paciente | PROFESSIONAL, ADMIN |
| GET | /prescriptions/professional/me | Prescrições do profissional | PROFESSIONAL |

## Padrão de Erros

- `AppError`: `{ message }` com status específico.
- Erros Zod: 400 `{ message: "Validation error", issues: ... }`.
- Outros: 500 `{ message: "Internal Server Error" }` (ou mensagem original).

## Aviso Educacional

Projeto **exclusivamente educacional** (Uninter).

## Autenticação & Autorização (Resumo Técnico)

- Header: `Authorization: Bearer <token>`.
- Payload JWT: `sub` (id) + `role` (lista de papéis) preenchendo `request.user`.
- `ensureAuthenticated`: 401 se inválido/ausente.
- `verifyUserAuthorization([roles])`: 403 se papel não autorizado.
