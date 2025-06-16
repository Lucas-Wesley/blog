---
title: "Design Pattern: single responsibility"
date: "2025-05-17"
status: "draft"
description: ""
autor: "Lucas Wesley Moreira Tinta"
category: "Design Patterns"
slug: "design-pattern-single-responsibility-principle-solid"
---

## Definição:

O princípio da responsabilidade única (Single Responsibility Principle - SRP) é um dos cinco princípios SOLID da programação orientada a objetos. Ele estabelece que uma classe deve ter apenas uma razão para mudar, ou seja, deve ter apenas uma responsabilidade ou função específica.


## Atores 


### Stakeholders
Uma class employee que faz definirSalario, fazerPagamento, gerarRelatorioAuditoria, etc.
Atores que departamentos ou stakegolderes envolvidos na classe:
- financeiro - realizar pagamentop 
TH: Definição desario
Compilance: Geração de ralçtorios de auditoria.

### Desenvolvedores

Class Employee que tem as funções: salvarNODB(), enviarEmailDeConfirmação(), registrarLogAlterações(), etc.

Atores envolvidos na classe:
- Persistencia de dados
- Notificação por email

PQ está claro a multipla responsavbilidade? Pq os Atores mudam. 

=======================

-- Razões para mudança:
-- impacto da multiplicidade de atores:

-- E não é pq a classe orquesta varias tarefas que ela está violando o SRP. O problema é quando a implementação está atrelada a ela e não separada em uma classe separada.

-- DTO precisa prestar atenção também. Se ele tem diferentes razões para mudar, ele está violando o SRP. Uma bos pratica é não ter DTOs que vão para diferentes camadas, ou servicos.


-- 