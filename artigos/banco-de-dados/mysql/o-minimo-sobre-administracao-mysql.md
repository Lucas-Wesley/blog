---
title: "MySQL: O Mínimo sobre Administração do MySQL"
date: "2025-06-06"
status: "draft"
description: "O mínimo sobre administração de MySQL."
autor: "Lucas Wesley Moreira Tinta"
category: "Banco de Dados"
slug: "mysql-o-minimo-sobre-administracao"
---


DBA (Database Administrator) é uma aréa de atuação muito grande. E apesar de estudar bastante, gostar do assunto, eu não tenho tanta experiência profissional.
Minha especialidade é desenvolvimento de software, mas vou compartilhar e tentar explicar o mínimo que eu acho que todo desenvolvedor deveria saber sobre administração de Banco de Dados. 

O objetivo final é falar sobre Administrar um Banco de Dados, mas vou falar de vários outros assuntos e conceitos de SO, memória, armazemamento, redes, etc.

Nesse artigo vou usar o MySQL como exemplo, mas as informações são válidas para outros SGBDs.
Vamos começar deixando claro os conceitos. A singla SGBD é: Sistema Gerenciador de Banco de Dados. Exemplos: MySQL, PostgreSQL, Oracle, SQL Server, etc.
Já o "Banco de dados" é uma coleção de dados em si. Diferentes SGBDs possuem diferentes formas de armazenar e gerenciar esses dados.
Os exemplos citados de SGBDs foram os que possuem modelos de dados relacionais. Mas existe outro universo só de SGBDs que não são relacionais, como o MongoDB que temos o costume de chamar de NoSQL.

NoSQL é um termo que vem do inglês "Not Only SQL". SQL (Structured Query Language) é a linguaguem/protocolo de consulta de dados relacionais. Tem uma base comum de SQL em todos os SGBDs relacionais,
mas cada SGBD tem suas funcionalidades específicas. E além de comandos específicos, cada SGBD tem suas próprias características. Um simples exemplo é o PostgreSQL que tem uma propriedade para lidar com Booleans.
Na qual eu consigo salvar um boolean como true ou false em uma coluna do banco de dados. Já no MySQL, não é possível. Se eu quiser algo parecido, eu preciso salvar um 1 ou 0.

Conceitos explicadaos, vamos começar.

## TUNING (TUNAR)

Primeiro, trabalhando com os banco de dados e índices, são coisas que eu vou falar depois, nós temos tuning através das variáveis internas do MySQL, que a gente chama ali de MySQLD tuning e através do hardware e do sistema operacional que o MySQL está instalado.

Vou começar pelo hardware e depois o tuning do MySQLD. A primeira coisa básica é considerar sempre sistemas operacionais de 64bits. O MySQL tem uma gama de poder utilizar vários processadores em paralelo e de consumir realmente toda a capacidade de memória de hardware que a máquina possui.

Outra coisa importante é ver a configuração de RAM que está sendo utilizada, na verdade, existe um parâmetro interno no MySQL, que configuramos quanto de RAM os nossos processos vão poder consumir no máximo, é claro que eu não vou disponibilizar toda a RAM disponível dentro da minha máquina. Normalmente a dica é que você disponibilize, pelo menos, no máximo 50% da sua RAM existente. Então, se eu estiver usando, por exemplo, um servidor com 32G de RAM, a gente vai ter então disponível para o MySQL, preferencialmente metade disso ou 16G.

Aí, cabe a você definir se esses 16G é muita coisa ou não e há aí uma relação que a experiência mostra... direta, entre o tamanho da base e a quantidade de RAM que o processo vai gastar, um exemplo é o seguinte.

Um exemplo é o seguinte, uma base normalmente de 1GB de tamanho, não vai gastar mais do que 8GB de RAM para fazer qualquer coisa nessa sua base. Claro que um ambiente real, a gente não vai ter só uma conexão fazendo coisa na base, eu vou ter várias conexões.

Então, dependendo da forma com que o banco é usado, talvez, mesmo tendo um bando de 1GB, 8G de RAM vai ser pouco, porque eu posso ter muitos processos acessando a base ao mesmo tempo. Outro ponto importante que deve ser colocado é o tipo de leitura de disco, o “IO”, que esse banco vai ter.

E aí, claro, aonde estiver armazenado a base de dados, vai fazer uma enorme diferença. Hoje em dia, a gente tem diversos tipos de HDs de discos rígidos, onde nós podemos armazenar os nossos dados.

Claro que se você tiver dinheiro e capacidade de colocar tudo num disco SSD, que é um disco rígido de memória, iria ser imbatível, a velocidade de “IO” vai ter um ganho enorme, mas hoje os SSDs ainda são caros. Então, a gente sempre vai encontrar discos do tipo: SCSI, SATA e SAS.

Desses três, normalmente SCSI são muito velhos, a gente quase não encontra mais hoje em dia e entre disco SAS e SATA, de preferência aos discos SAS, porque eles são mais performáticos. Outra forma também é como é que você usa a sua controladora de disco RAID.

[05:59] Geralmente os discos RAID são usados, para a gente poder trazer segurança aos nossos dados. Existem vários tipos de RAID, os mais usados são RAID 0, RAID 1, RAID 5 e RAID 10, normalmente o seguinte, o RAID 0, ele vai dividir o seu dado e dois discos rígidos diferentes.

[06:22] Então, eu tenho dois discos rígidos físicos, mas logicamente, eu enxergo somente um drive e aí, o sistema operacional vai dividindo esse dado entre os discod. O RAID 1, normalmente é uma cópia, eu tenho dois discos rígidos, eu olho um só, mas a capacidade do que eu olho de discos normalmente é de um deles somente.

[06:51] E internamente, toda a vez que eu gravo, que eu incluo, altero ou excluo informações, essa operação é feita ao mesmo tempo nos dois discos, esse é o tipo RAID 1. Aí, você tem variantes do RAID 5 e RAID 10. RAID 5 seria a divisão dos dados, só que em mais discos.

[07:14] E o RAID 10, seria o espelhamento dos discos, usando mais discos rígidos. Claro que o RAID 10 e o RAID 1, eles gastam metade do espaço físico fazendo redundância, mas com certeza, eles são mais seguros para suportar um bando de dados MySQL, porque se por acaso um dos discos quebrar ou tiver indisponível, eu tenho o meu dado no outro disco preservado.

[07:50] Claro que essas configurações de hardware, elas vem muito com a experiência do profissional e o pessoal de infraestrutura e de suporte, eles podem ajudar muito o DBA a desenhar o melhor ambiente para o banco de dados MySQL, mas aí, novamente falando sobre nuvens, hoje em dia, a gente usa muito a nuvem para criar uma instância do MySQL.

[08:22] E aí, quando a gente fala de nuvem, da mesma maneira que a gente não precisa mais estar se preocupando em configurações de backup de ambiente, também performance, a gente não se preocupa mais, porque a gente tem dentro da configuração do MySQL na nuvem, seja ela na Amazon, na Azure ou na Google, você tem configurações de recursos de hardware que você vai reservar para o seu banco de dados MySQL.

[08:55] E aí, você consegue em maneira lógica, ir aumentando esses recursos, na medida em que seu banco vai sendo usado e aí, internamente, se eu estou usando RAID, quanto te RAM, se é RAID 0, RAID 1, RAID 5, isso tudo é transparente para mim, que na parametrização da nuvem está pedindo para que aquele MySQL utilize mais recursos.




## Mecanismo de armazenamento - MyISAM:

[00:00] Vamos falar um pouquinho sobre mecanismos de armazenamento, esses mecanismos de armazenamento que existem no MySQL, são um dos recursos mais exclusivos do banco de dados, ele tem a ver com a forma com que o dado é guardado dentro das tabelas e o MySQL disponibiliza cerca de 20 diferentes tipos de mecanismos de armazenamento.

[00:31] Então, como eu falei, ele é um mecanismo que gerencia a forma com que o dado é gravado em tabelas e a gente pode ter num mesmo banco de dados, diferentes tipos de mecanismos diferentes, como ele é aplicado a nível de tabela, as vezes a gente confunde muito o mecanismo de armazenamento com um tipo de tabela.

[00:57] A gente pode chamar assim mesmo, quando a gente se refere a um mecanismo de armazenamento, na verdade, nós estamos falando de um tipo de tabela diferente do meu banco de dados.

[01:08] Nas instruções de criação de tabela e de alteração de tabela, respectivamente os create tables e os alter tables, nós temos uma opção chamada engine, onde eu posso definir ou alterar o mecanismo de armazenamento que aquela tabela respectiva vai ter.

[01:33] Uma outra característica interessante é que o mecanismo de armazenamento da tabela, ela está... não está associada com a arquitetura interna do MySQL, separando, justamente a forma com que eu tenho o (core) do banco de dados, com a forma com que eu vou armazenar a informação dentro da tabela.

[02:02] Apesar de a gente ter esses 20 diferentes tipos de mecanismos de armazenamento, normalmente a gente trabalha com três principais, é o MyISAM, o InnoDB e o MEMORY. Vamos falar então um pouquinho do que que é o MyISAM.

[02:23] O MyISAM, ele é, na verdade, o mecanismo padrão do MySQL, inclusive, as tabelas internas do MySQL são armazenadas usando MyISAM. Ele é um mecanismo bem confiável e ele herdou do mecanismo original, que foi implementado nas primeiras versões do MySQL, que era o mecanismo chamado de ISAM.

[02:54] E a partir da versão, crio que 3.2 do MySQL, eles substituíram o padrão original ISAM, para o MyISAM, qual é a característica principal do mecanismo MyISAM? Ele não é um mecanismo puramente transacional, ele não implementa mecanismos de bloqueio dos registros dentro das tabelas.

[03:25] O tipo de bloqueio que o MyISAM faz quando uma tabela está sendo atualizada, é um (lock) na tabela como um todo, isso permite com que a tabela seja muito mais rápida, se eu quiser, por exemplo, usá-la para efetuar somente leituras, mas aí, você tem um problema.

[03:49] Se você tiver muita gravação simultânea, por diferentes usuários, diferentes sessões dentro do banco, como esse controle não é tão específico, a gente pode ter problemas usando tabelas MyISAM, por isso nós temos que tomar cuidado.

[04:11] Então, algumas características específicas do MyISAM, para a gente decidir que tipo de forma de tabela a gente vai utilizar, por exemplo... Então, se eu tiver uma tabela que não vai ter muitas transações, eu posso usar MyISAM.

[04:29] O MyISAM tem uma característica que a chave estrangeira não suporta o tipo FULLTEXT, que é um tipo de dado específico da tabela. Quando a gente cria um cache de dados ou um cache de índice, a gente nunca pode se referenciar a ele através do nome.

[04:49] Nós temos uma vantagem que o MyISAM implementa dois tipos de forma de índice, que é o HASH e o BTREE, a gente vai falar um pouquinho sobre eles mais a frente, como eu já falei, o MyISAM, ele implementa bloqueio a nível de tabela, isso faz com que a atividade de leitura seja muito rápida, quando você usa o MyISAM.

[05:10] Então ela é muito específica para bancos de dados, que nós chamamos de Data Warehouse, ou seja, bancos de dados gerenciais de consulta e internamente, os dados que são armazenados dentro das tabelas do MyISAM, já são automaticamente armazenados de forma compacta, melhorando o tamanho do banco de dados, quando eu tenho muita informação.

[05:38] Lembra que a gente falou sobre variáveis de ambiente? Existe algumas variáveis de ambiente que são diretamente ligadas ao MyISAM. A primeira variável é o key_buffer_size, o key_buffer_size, ele determina, esse parâmetro, o tamanho de cache que a gente vai usar para armazenar os índices do MyISAM.

[06:07] Dependendo do sistema operacional, se eu estiver usando 32 bits ou 64 bits, esse padrão pode ir desde 8MB, até 4GB. Um outro parâmetro importante é o concurrent_insert, é outro parâmetro que a gente pode estar especificando lá no my.cnf ou no my.ini, que é o arquivo de inicialização do MySQL.

[06:36] Esse parâmetro determina o comportamento das inserções concorrentes dentro de uma tabela MyISAM. Existe uma variável chamada: intervalo de dados, que é uma espera que MySQL faz entre a inserção de um dado e de outro dado. Se essa variável concurrent_insert for igual a 1, você consegue fazer inserções simultâneas, sem intervalo de dados.

[07:06] Se a configuração for igual a 0, a gente desativa as inserções simultâneas, ou seja, uma inserção sempre vai esperar a tabela ser liberada para funcionar e quando tiver a configuração número 2, eu permito a inserção simultâneas com um intervalo de dados ativado.

[07:28] Outra variável é a delay_key_write, a gente usa essa variável para criar um atraso entre a atualização dos índices e o momento que a tabela é fechada, por exemplo, quando eu faço uma inserção de dados, se eu usar o delay_key_write, o MySQL vai esperar todas as inserções serem efetuadas, para depois fazer uma atualização dos índices.

[08:02] Isso cria, claro, uma melhor consistência no dado dentro do banco de dados, porém, isso cria uma lentidão um pouco maior no momento da atualização da informação. O padrão do MyISAM é essa variável delay_key_write, com o valor igual a 1.

[08:28] Então, quando eu crio automaticamente uma tabela do tipo MyISAM, automaticamente o delay_key_write vai estar ativado, se eu quiser melhorar um pouco a performance dos inserts, eu devo ir lá na configuração e colocar essa variável delay_key_write como off.

[08:50] Nós temos também a variável max_write_lock_count, essa variável de ambiente, ela determina quantas gravações em uma tabela vão ter precedências às leituras, ou seja, quando tiver gravações e leituras ao mesmo tempo, qual vai ser a prioridade da inclusão de dados na tabela, em relação às leituras.

[09:28] E a gente tem uma outra variável, que é a preload_buffer_size, essa variável, ela determina o tamanho do buffer que vai ser usado no pré carregamento do índice de caches de chaves da tabela. O padrão dessa variável, normalmente, é 32KB.

[09:55] Claro que o uso dessas variáveis de ambiente vai vir com o tempo, na medida em que o administrador do MySQL começa a entender melhor o seu ambiente, entente melhor os mecanismos de MyISAM e pode mexer com essas variáveis.

[10:15] Mas a minha experiência diz o seguinte, use sempre o padrão, quando você cria uma tabela do tipo MyISAM, você deve apenas levar em consideração se o seu caso, ele está dentro dessa opções aqui, específicas, para determinar se você vai usar o MyISAM ou não como tipo de tabela.

[10:44] O que nós estamos vendo aqui, são três utilitários que existem dentro do MySQL, para a gente poder manipular tabelas do tipo MyISAM. A gente tem um primeiro aplicativo que é o myisamchk, ele é usado para a gente poder analisar, otimizar e reparar tabelas MyISAM, pode ser que as tabelas estejam mal construídas, algum problema no seu armazenamento interno.

[11:16] Então o myisamchk, reconstrói essas tabelas. O myisampack, ele é usado para a gente poder criar tabelas MyISAM compactadas, que vão ser só usadas para leitura, nada mais. São tabelas que a gente, durante o uso do aplicativo, a gente cria elas, coloca informação e elas não vão poder sofrer nenhum tipo de insert.

[11:43] Claro que essas tabelas vão ter mecanismos de controle de escrita, praticamente nulos, praticamente inexistentes, fazendo com que a performance da leitura seja muito rápida.

[11:57] E um outro aplicativo é o myisam_ftdump, que é usado para a gente poder exibir informações sobre os campos do tipo texto, que eu tenho dentro do MyISAM, ele fornece uma informação mais completa sobre esses campos.

[12:14] Então, tá, era mais ou menos isso que eu gostaria de falar para vocês, sobre os tipos de tabela MyISAM. Valeu.