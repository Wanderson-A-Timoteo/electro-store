# ElectroStore - Sistema de Gestão de Estoque e Vendas

Projeto desenvolvido como requisito para a **Avaliação Prática 01** da disciplina de Desenvolvimento Web, focado na aplicação da arquitetura MVC, autenticação segura e autorização baseada em perfis (Role-Based Access Control).

## 🚀 Tecnologias Utilizadas
* **Back-end:** Node.js, Express.js
* **Banco de Dados:** MySQL com Sequelize (ORM)
* **View Engine:** Handlebars (HBS) com Partials
* **Segurança:** Passport.js (Sessões locais) e Bcrypt (Criptografia de senhas)
* **Front-end:** Bootstrap 5 e Bootstrap Icons (Instalação 100% Offline)

## ⚙️ Instruções de Instalação e Execução

1. **Configuração do Banco de Dados:**
   Certifique-se de ter o MySQL em execução (XAMPP ou instalação isolada).
   Crie um banco de dados chamado `produtos`:
   ```sql
   CREATE DATABASE produtos;
   ```

Nota: As configurações de acesso, como porta e senha, estão definidas no arquivo de configuração do Sequelize).

2. **Instalação das Dependências:**
Abra o terminal na pasta raiz do projeto e execute:
```bash
npm install
```

3. **Iniciando o Servidor::**
```bash
npm start
```
Acesse a aplicação no navegador através do endereço: http://localhost:3000

## 🥚 Povoamento Inicial
Para que a avaliação do sistema seja rápida e não exija inserções manuais no banco de dados, o sistema conta com uma rota de "Povoamento". Ela gera automaticamente as categorias padrão do sistema e os usuários de testes com seus respectivos perfis.

Passo Obrigatório: Antes de tentar fazer o login pela primeira vez, acesse a rota abaixo no seu navegador para sincronizar e popular as tabelas:

👉 http://localhost:3000/povoamento

## 🔐 Credenciais de Acesso para Avaliação
Após executar a rota de povoamento, utilize as credenciais abaixo para testar as travas de segurança (Autorização) do Padrão MVC:

| Perfil | E-mail de Acesso | Senha | Permissões / Visão no Sistema |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@electrostore.com` | `123456` | Acesso total. Pode visualizar, cadastrar, editar e excluir produtos. |
| **Lojista** | `lojista@electrostore.com` | `123456` | Acesso operacional. Visualiza o acervo e pode Registrar Compra (+1 estoque) ou Venda (-1 estoque). |
| **Visitante** | *(Acesso sem login)* | - | Apenas visualiza produtos com status "Ativo". |
| **Usuário Comum** | *(Criar via tela de Cadastro)* | *(Sua escolha)* | Mesma visão do visitante. Não possui acesso a manipulação de estoque. |


## 🛡️ Destaques da Implementação
**Segurança no Controller:** Todas as rotas sensíveis estão protegidas por middlewares (isAdmin, isLojistaOrAdmin), impedindo acessos forçados via URL.

**Validações de Regra de Negócio:** Tratamento de erros e validações (ex: impedir cadastro com senhas divergentes, bloquear vendas de produtos sem estoque e barrar cadastro de produtos sem nome/preço válido) implementados com Flash Messages.

**Empty State:** Interface tratada para lidar elegantemente com a ausência de produtos no banco de dados.