---
title: "Design Pattern: Liskov Substitution"
date: "2025-05-17"
status: "draft"
description: "Entenda o Princípio da Substituição de Liskov (LSP) dos SOLID: como garantir que subclasses sejam intercambiáveis sem quebrar o comportamento esperado."
autor: "Lucas Wesley Moreira Tinta"
category: "Design Patterns"
slug: "design-pattern-liskov-substitution-principle-solid"
tags: ["Design Patterns", "SOLID", "LSP", "OOP", "Herança", "Polimorfismo"]
---

## Definição:

O princípio da substituição de Liskov (Liskov Substitution Principle - LSP) é um dos cinco princípios SOLID da programação orientada a objetos. Ele estabelece que objetos de uma classe derivada devem poder substituir objetos da classe base sem alterar o comportamento desejado do programa. Em outras palavras, se S é um subtipo de T, então os objetos de tipo T devem poder ser substituídos por objetos de tipo S sem afetar a correção do programa.


### Situações que quebram o LSP:

- Pré-condições não pode ser fortacelidas: 
Pré-condições são parametros na prática. Fortalecer quer dizer que voce foi mais restritivo.

- Po´s-condições não pode ser enfraquecidas:
Pós-condições são os retornos na prática. Enfraquecer quer dizer que você está permitindo retornar mais do que 

- INvariancias devem ser preservadas:


A ideia é garantir que as subclasses possam ser intercambiadas sem causar problemas durante a execução do programa.

 