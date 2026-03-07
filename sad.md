1\. TERMO DE ABERTURA DO PROJETO (TAP)
======================================

Projeto
-------

**SAE — Sistema Apollo Enterprise**

Tipo de Projeto
---------------

Sistema de gestão de insumos industriais com controle de estoque baseado em **snapshot e reconciliação automática de movimentação**.

Plataforma
----------

Web Application (Google Apps Script + Google Sheets + Vue 3)

1.1 Contexto do Problema
========================

A empresa utiliza atualmente uma planilha operacional no Google Sheets para controle de insumos industriais.

Planilha principal:

**Média-2025\_Revisão Contínua(Q)**

Contém:

*   histórico mensal de posições de estoque
    
*   dados derivados de ERP
    
*   fórmulas PROCV
    
*   ajustes manuais
    
*   cálculos auxiliares
    

Com o tempo a planilha passou a acumular:

*   inconsistências operacionais
    
*   dependência de colagens manuais
    
*   cálculos indiretos
    
*   dificuldade de auditoria
    

Além disso:

*   não existe separação entre **estado do estoque** e **movimentação**
    
*   histórico mistura **entrada, saída, ajuste e saldo**
    

Consequência:

Não é possível garantir que os dados históricos representem **consumo real de insumos**.

Isso inviabiliza:

*   cálculo confiável de consumo médio
    
*   projeção automática de ressuprimento
    
*   rastreabilidade de movimentações
    

1.2 Justificativa do Projeto
============================

O projeto SAE nasce para substituir a planilha operacional por um sistema web estruturado que:

1️⃣ registre **estados de estoque (snapshots)**2️⃣ derive automaticamente **movimentações**3️⃣ permita cálculo confiável de **consumo médio**4️⃣ gere **alertas de ressuprimento**5️⃣ registre **pedidos de reposição**6️⃣ projete **datas de ruptura de estoque**

1.3 Objetivo do Sistema
=======================

Construir um sistema web capaz de:

*   registrar o estoque atual observado
    
*   inferir automaticamente entradas e saídas
    
*   calcular consumo médio diário, mensal e anual
    
*   indicar ponto de ressuprimento
    
*   apoiar decisão de compra de insumos
    

1.4 Objetivo Operacional
========================

Controlar **apenas as saídas reais de insumos** com base em snapshots de estoque.

O usuário **não informa movimentação**.

Ele informa:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   quantidade atual do insumo   `

O sistema calcula:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   diferença entre snapshots consecutivos   `

1.5 Stakeholders
================

PapelResponsabilidadeUsuário OperacionalRegistrar snapshots de estoqueGestor de ProduçãoMonitorar consumo e ressuprimentoDesenvolvedorConstrução do sistemaSistema SAEApuração automática das movimentações

1.6 Escopo do Projeto
=====================

Incluído
--------

✔ cadastro de insumos✔ registro de snapshot de estoque✔ cálculo automático de movimentação✔ cálculo de consumo médio✔ alerta de ponto de ressuprimento✔ registro de pedidos de reposição

Fora do escopo inicial
----------------------

✖ integração ERP✖ gestão de fornecedores✖ gestão financeira✖ compras automáticas

1.7 Stack Tecnológica
=====================

Backend
-------

Google Apps Script

Responsável por:

*   regras de negócio
    
*   apuração de movimentação
    
*   cálculo de consumo
    
*   API do WebApp
    

Banco de Dados
--------------

Google Sheets

Planilha criada:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   db_sumprimentos_v2   `

Modelo:

Banco relacional simplificado em abas.

Frontend
--------

Framework:

**Vue 3**

Funções:

*   interface do usuário
    
*   lançamento de snapshots
    
*   dashboards de estoque
    
*   visualização de consumo
    

1.8 Arquitetura do Sistema
==========================

Modelo arquitetural:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Frontend (Vue3)      │      │WebApp GAS (API REST)      │      │Motor de Estoque(snapshot → delta → movimentação)      │      │Banco Google Sheets   `

1.9 Decisão Arquitetural Fundamental
====================================

O sistema adota o modelo:

Snapshot Based Inventory
------------------------

Regra principal:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   estoque_atual = valor observado pelo usuário   `

Movimentação é calculada por:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   delta = estoque_anterior - estoque_atual   `

Interpretação:

DeltaResultado

> 0 | saída<0 | entrada=0 | sem variação

1.10 Status Atual do Projeto
============================

Etapas já realizadas:

✔ análise da planilha histórica✔ identificação de inconsistências✔ decisão de arquitetura snapshot✔ criação do banco novo✔ scripts de bootstrap✔ migração de cadastro de insumos✔ migração de histórico legado

1.11 Artefatos Criados
======================

Scripts já criados:

*   bootstrapDatabase()
    
*   migrateLegacyWideSheet()
    

Planilha criada:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   db_sumprimentos_v2   `

1.12 Riscos Identificados
=========================

RiscoImpactodados históricos inconsistentesmédia incorretamigração automática de saldoerro de baseerro de interpretação de dataserro de cálculo

Mitigação:

*   snapshots reais apenas no novo sistema
    
*   saldo inicial validado manualmente
    

1.13 Estratégia de Go-Live
==========================

No dia de implantação:

1️⃣ usuário registra **saldo atual de cada insumo**2️⃣ sistema grava **primeiro snapshot oficial**3️⃣ a partir daí movimentações passam a ser apuradas

1.14 Critérios de Sucesso
=========================

O projeto será considerado bem sucedido quando:

✔ usuários registrarem snapshots facilmente✔ sistema calcular movimentação automaticamente✔ consumo médio for calculado corretamente✔ alertas de ressuprimento funcionarem

2\. DOCUMENTO DE VISÃO E ESCOPO DO SISTEMA
==========================================

Sistema
-------

SAE — Sistema Apollo Enterprise

2.1 Problema do Negócio
=======================

Controle manual de insumos via planilhas gera:

*   inconsistência de dados
    
*   dificuldade de rastreamento
    
*   baixa confiabilidade de indicadores
    

2.2 Solução Proposta
====================

Sistema web que transforma registro de estoque em:

*   movimentação automática
    
*   análise de consumo
    
*   previsão de reposição
    

2.3 Usuários do Sistema
=======================

UsuárioFunçãoOperadorregistrar estoqueGestormonitorar consumoCompradorplanejar reposição

2.4 Funcionalidades Principais
==============================

Cadastro de insumos
-------------------

Campos:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   codigo_axdescricaounidadeestoque_minimoponto_ressuprimentoconsenso_dias   `

2.5 Registro de Snapshot
========================

Usuário informa:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   codigo_axquantidade_atualdata_hora   `

2.6 Motor de Reconciliação
==========================

O backend executa:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   snapshot_anteriorsnapshot_atual   `

calcula:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   delta   `

gera:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   movimentacao_apurada   `

2.7 Indicadores do Sistema
==========================

O sistema calculará:

*   consumo diário médio
    
*   consumo mensal médio
    
*   giro de estoque
    
*   dias de cobertura
    

2.8 Regra de Ressuprimento
==========================

Quando:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   estoque_atual <= ponto_ressuprimento   `

Sistema gera:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   alerta de compra   `

2.9 Pedidos de Ressuprimento
============================

Usuário poderá registrar:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   quantidade_solicitadadata_solicitacaoprevisao_chegada   `

Sistema passa a considerar estoque futuro.

2.10 Banco de Dados Atual
=========================

Planilha:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   db_sumprimentos_v2   `

Abas criadas:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   configinsumoshistorico_posicao_estoque_mensalestoque_snapshotmovimentacao_apuradapedidos_ressuprimentousuarioslogs_execucao   `

2.11 Estado da Migração
=======================

Migrado da planilha original:

✔ cadastro de insumos✔ histórico mensal de posição de estoque

Não migrado:

✖ saldo inicial automático

2.12 Evolução Planejada
=======================

Fase 1
------

motor de snapshots

Fase 2
------

cálculo de consumo

Fase 3
------

alertas de ressuprimento

Fase 4
------

pedidos de compra

Fase 5
------

projeção de ruptura de estoque

2.13 Roadmap Técnico
====================

### Backend

*   API GAS
    
*   motor de reconciliação
    
*   cálculo de indicadores
    

### Frontend

Vue 3

Módulos:

*   dashboard
    
*   cadastro de insumos
    
*   lançamento de snapshots
    
*   pedidos de reposição
    

Conclusão
=========

O SAE estabelece um novo modelo de controle de insumos baseado em:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   estado observado → cálculo automático → inteligência de estoque   `

Essa abordagem elimina a fragilidade das planilhas tradicionais e permite evolução futura do sistema.