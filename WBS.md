1\. WBS — Work Breakdown Structure
==================================

Projeto SAE — Sistema Apollo Enterprise
---------------------------------------

Estrutura de decomposição do trabalho técnico.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   SAE│├── 1. Arquitetura e Base Técnica│├── 2. Banco de Dados (Google Sheets)│├── 3. Backend GAS│├── 4. Motor de Estoque│├── 5. Analytics e Consumo│├── 6. Ressuprimento│├── 7. API WebApp│├── 8. Frontend Vue3│├── 9. Segurança e Auditoria│└── 10. Deploy e Operação   `

2\. WBS DETALHADO
=================

1 — Arquitetura e Base Técnica
==============================

### 1.1 Estrutura do projeto GAS

Definir estrutura interna:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   /api/application/domain/repositories/shared   `

### 1.2 Convenções do projeto

Definir padrões:

*   nomenclatura
    
*   padronização JSON
    
*   formatação datas ISO
    
*   controle de UUID
    
*   padrões de erro
    

### 1.3 Configuração global

Criar sistema de configuração:

tabela:

config

Parâmetros iniciais:

*   timezone
    
*   janela média
    
*   contexto padrão
    
*   modo debug
    

2 — Banco de Dados (Sheets)
===========================

Banco:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   db_sumprimentos_v2   `

### 2.1 Estrutura das abas

Criar e validar:

Abaconfiginsumoshistorico\_posicao\_estoque\_mensalestoque\_snapshotmovimentacao\_apuradapedidos\_ressuprimentousuarioslogs\_execucao

### 2.2 Validação do schema

Garantir:

*   cabeçalhos corretos
    
*   tipos de dados
    
*   consistência de campos
    
*   normalização de datas
    

### 2.3 Migração do legado

Executar scripts de:

*   leitura planilha antiga
    
*   transformação wide → long
    
*   carga em historico\_posicao\_estoque\_mensal
    

### 2.4 Indexação lógica

Criar índices por:

*   codigo\_ax
    
*   insumo\_id
    
*   data\_hora\_lancamento\_iso
    

3 — Backend GAS
===============

3.1 Router API
--------------

Criar controlador central:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   doPost()   `

Responsável por:

*   receber request
    
*   validar payload
    
*   despachar ação
    

3.2 Padronização de respostas
-----------------------------

Criar utilitário:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   { ok:true message:"" data:{}}   `

3.3 Middleware de validação
---------------------------

Funções:

*   validar payload
    
*   validar ação
    
*   validar parâmetros obrigatórios
    

4 — Motor de Estoque
====================

Esse é o **cérebro do SAE**.

4.1 Serviço Snapshot
--------------------

Função:

registrar snapshot

Entradas:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   codigo_axquantidade_atualtimestampcontexto   `

Saídas:

snapshot gravado

4.2 Busca snapshot anterior
---------------------------

Buscar:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   último snapshot válido   `

Ordenação:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   timestamp   `

4.3 Motor de reconciliação
--------------------------

Calcular:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   delta = anterior - atual   `

4.4 Classificação da movimentação
---------------------------------

Tipos:

tipoENTRADASAIDASEM\_VARIACAOAJUSTE

4.5 Registro de movimentação
----------------------------

Gravar na tabela:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   movimentacao_apurada   `

5 — Analytics e Consumo
=======================

5.1 Cálculo de consumo médio
----------------------------

Base:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   movimentacao_apurada   `

Filtrar:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   tipo_movimento = SAIDA   `

5.2 Média diária
----------------

Fórmula:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   soma_saidas / dias   `

5.3 Média mensal
----------------

Agrupar:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   competência   `

5.4 Cobertura de estoque
------------------------

Calcular:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   estoque_atual / consumo_medio_diario   `

6 — Ressuprimento
=================

6.1 Verificação de ponto de ressuprimento
-----------------------------------------

Regra:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   estoque_atual <= ponto_ressuprimento   `

6.2 Sistema de alerta
---------------------

Status possíveis:

statusOKATENÇÃORESSUPRIR

6.3 Pedidos de reposição
------------------------

CRUD:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   pedidos_ressuprimento   `

Campos:

*   quantidade
    
*   previsão chegada
    
*   status
    

7 — API WebApp
==============

Endpoints principais:

### Itens

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   item.createitem.updateitem.listitem.softDelete   `

### Snapshot

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   inventory.snapshot.createinventory.snapshot.list   `

### Movimentação

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   inventory.movement.list   `

### Analytics

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   analytics.consumptionanalytics.coverage   `

### Ressuprimento

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   supply.order.createsupply.order.update   `

8 — Frontend Vue3
=================

Framework:

Vue3

Arquitetura:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Composition APIPiniaAxios   `

8.1 Módulos de interface
========================

Dashboard
---------

Mostra:

*   estoque atual
    
*   itens críticos
    
*   pedidos em aberto
    

Cadastro de insumos
-------------------

CRUD:

*   criar
    
*   editar
    
*   inativar
    

Lançamento de estoque
---------------------

Formulário:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   codigo_axquantidadeobservação   `

Histórico de movimentação
-------------------------

Lista:

*   entradas
    
*   saídas
    
*   ajustes
    

Consumo
-------

Gráficos:

*   consumo mensal
    
*   tendência
    

Pedidos de reposição
--------------------

Interface para:

*   registrar pedido
    
*   atualizar status
    

9 — Segurança e Auditoria
=========================

9.1 Registro de ações
---------------------

Toda ação relevante deve gerar:

registro em:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   logs_execucao   `

9.2 Controle de usuários
------------------------

Tabela:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   usuarios   `

Perfis possíveis:

perfilADMINOPERADORGESTOR

10 — Deploy e Operação
======================

10.1 Deploy WebApp
------------------

Publicar:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Apps Script WebApp   `

10.2 Controle de versão
-----------------------

Versões do script GAS.

10.3 Monitoramento
------------------

Monitorar:

*   erros
    
*   latência
    
*   falhas de gravação
    

3\. BACKLOG TÉCNICO POR MÓDULO
==============================

Agora transformamos a WBS em backlog executável.

BACKLOG — BANCO
===============

### B1

Criar planilha db\_sumprimentos\_v2

### B2

Criar abas base

### B3

Definir cabeçalhos padrão

### B4

Migrar cadastro de insumos

### B5

Migrar histórico legado

### B6

Validar integridade dos dados

BACKLOG — BACKEND
=================

### BE1

Criar router API

### BE2

Criar sistema de resposta JSON

### BE3

Criar utilidades de data

### BE4

Criar utilidades de ID

### BE5

Criar repositórios Sheets

### BE6

Criar serviço Snapshot

### BE7

Criar motor de reconciliação

### BE8

Criar serviço Analytics

### BE9

Criar serviço Ressuprimento

### BE10

Criar logs

BACKLOG — FRONTEND
==================

### FE1

Setup projeto Vue3

### FE2

Criar layout base

### FE3

Criar store global

### FE4

Criar cliente API

### FE5

Tela cadastro insumos

### FE6

Tela snapshot estoque

### FE7

Tela dashboard

### FE8

Tela consumo

### FE9

Tela pedidos

4\. ORDEM REAL DE CONSTRUÇÃO
============================

Sequência recomendada:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   1 Banco2 Backend base3 Motor estoque4 API5 Frontend mínimo6 Analytics7 Ressuprimento8 Dashboard   `

5\. MILESTONES DO PROJETO
=========================

### M1

Banco funcional

### M2

Motor snapshot funcionando

### M3

API completa

### M4

Frontend MVP

### M5

Analytics

### M6

Ressuprimento