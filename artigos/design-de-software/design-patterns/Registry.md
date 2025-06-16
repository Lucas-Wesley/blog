---
title: "Design Pattern: Registry"
date: "2025-05-17"
status: "draft"
description: ""
autor: "Lucas Wesley Moreira Tinta"
category: "Design Patterns"
slug: "design-pattern-registry-criacional"
---

## Definição:

O padrão Registry é um padrão de design que fornece uma maneira de registrar e acessar objetos ou serviços em um sistema. Ele atua como um repositório central onde os objetos podem ser registrados e recuperados por meio de chaves ou identificadores. Esse padrão é útil para gerenciar dependências e facilitar a comunicação entre diferentes partes de um sistema, promovendo a reutilização de código e a separação de preocupações.
O padrão Registry é frequentemente utilizado em sistemas que envolvem a criação e o gerenciamento de objetos complexos, onde a criação direta de instâncias pode ser difícil ou indesejável. Ele permite que os desenvolvedores registrem objetos em um repositório central e os recuperem conforme necessário, sem precisar conhecer os detalhes de implementação de cada objeto.