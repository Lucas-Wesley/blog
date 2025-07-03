---
titule: "MySQL: O mínimo sobre administração do MySQL"
date: "2025-06-06"
status: "draft"
description: "O mínimo sobre administração de MySQL."
autor: "Lucas Wesley Moreira Tinta"
categoria: "Banco de Dados"
seu: "mysql-o-minimo-sobre-administracao"
---

DBA (Database Administrator) é uma área de atuação muito grande. E apesar de estudar bastante, gostar do assunto, eu não tenho tanta experiência profissional.

Minha especialidade é desenvolvimento de software, mas vou compartilhar e tentar explicar o mínimo que eu acho que todo desenvolver deveria saber sobre administração de Banco de Dados.

O objetivo final é falar sobre Administrar um Banco de Dados, mas vou falar de vários outros assuntos e conceitos de SO, memória, armazenamento, redes, etc.

Nesse artigo vou usar o MySQL como exemplo, mas as informações são válidas para outros SGBDs.

Vamos começar deixando claro os conceitos. A sigla SGBD é: Sistema Gerenciador de Banco de Dados. Exemplos: MySQL, PostgreSQL, Oracle, SQL Server, etc.

Já o "Banco de dados" é uma coleção de dados em si. Diferentes SGBDs possuem diferentes formas de armazenar e gerenciar esses dados.

Os exemplos citados de SGBDs foram os que possuem modelos de dados relacionais. Mas existe outro universo só de SGBDs que não são relacionais, como o MongoDB que temos o costume de chamar de NoSQL.

NoSQL é um termo que vem do inglês "Not Only SQL". SQL (Structured Query Language) é a linguagem/protocolo de consulta de dados relacionais. Tem uma base comum de SQL em todos os SGBDs relacionais,

mas cada SGBD tem suas funcionalidades específicas. E além de comandos específicos, cada SGBD tem suas próprias características. Um simples exemplo é o PostgreSQL que tem uma propriedade para lidar com Booleano.

Na qual eu consigo salvar um booleano como true ou false em uma coluna do banco de dados. Já no MySQL, não é possível. Se eu quiser algo parecido, eu preciso salvar um 1 ou 0.

Conceitos explicados, vamos começar.

## TUNING (LUNAR)

Primeiro, trabalhando com os banco de dados e índices, são coisas que eu vou falar depois, nós temos tuning através das variáveis internas do MySQL, que a gente chama ali de MySQLD tuning e através do hardware e do sistema operacional que o MySQL está instalado.

Vou começar pelo hardware e depois o tuning do MySQLD. A primeira coisa básica é considerar sempre sistemas operacionais de 64 bits. O MySQL tem uma gama de poder utilizar vários processadores em paralelo e de consumir realmente toda a capacidade de memória de hardware que a máquina possui.

Outra coisa importante é ver a configuração de RAM que está sendo utilizada, na verdade, existe um parâmetro interno no MySQL, que configuramos quanto de RAM os nossos processos vão poder consumir no máximo, é claro que eu não vou disponibilizar toda a RAM disponível dentro da minha máquina. Normalmente a dica é que você disponibilize, pelo menos, no máximo 50% da sua RAM existente. Então, se eu estiver usando, por exemplo, um servidor com 32GB de RAM, a gente vai ter então disponível para o MySQL, preferencialmente metade disso ou 16GB.

Aí, cabe a você definir se esses 16GB é muita coisa ou não e há aí uma relação que a experiência mostra... direta, entre o tamanho da base e a quantidade de RAM que o processo vai gastar, um exemplo é o seguinte.

Um exemplo é o seguinte, uma base normalmente de 1GB de tamanho, não vai gastar mais do que 8GB de RAM para fazer qualquer coisa nessa sua base. Claro que um ambiente real, a gente não vai ter só uma conexão fazendo coisa na base, eu vou ter várias conexões.

Então, dependendo da forma com que o banco é usado, talvez, mesmo tendo um bando de 1GB, 8GB de RAM vai ser pouco, porque eu posso ter muitos processos acessando a base ao mesmo tempo. Outro ponto importante que deve ser colocado é o tipo de leitura de disco, o "IO", que esse banco vai ter.

E aí, claro, aonde estiver armazenado a base de dados, vai fazer uma enorme diferença. Hoje em dia, a gente tem diversos tipos de HDs de discos rígidos, onde nós podemos armazenar os nossos dados.

Claro que se você tiver dinheiro e capacidade de colocar tudo num disco SSD, que é um disco rígido de memória, iria ser imbatível, a velocidade de "IO" vai ter um ganho enorme, mas hoje os seus ainda são caros. Então, a gente sempre vai encontrar discos do tipo: SEI, SALA e SAS.

Desses três, normalmente SEI são muito velhos, a gente quase não encontra mais hoje em dia e entre disco SAS e SALA, de preferência aos discos SAS, porque eles são mais performáticos. Outra forma também é como é que você usa a sua controladora de disco RAID.

[05:59] Geralmente os discos RAID são usados, para a gente poder trazer segurança aos nossos dados. Existem vários tipos de RAID, os mais usados são RAID 0, RAID 1, RAID 5 e RAID 10, normalmente o seguinte, o RAID 0, ele vai dividir o seu dado e dois discos rígidos diferentes.

[06:22] Então, eu tenho dois discos rígidos físicos, mas logicamente, eu enxergo somente um drive e aí, o sistema operacional vai dividindo esse dado entre os disco. O RAID 1, normalmente é uma cópia, eu tenho dois discos rígidos, eu olho um só, mas a capacidade do que eu olho de discos normalmente é de um deles somente.

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

[02:23] O MyISAM, ele é, na verdade, o mecanismo padrão do MySQL, inclusive, as tabelas internas do MySQL são armazenadas usando MyISAM. Ele é um mecanismo bem confiável e ele herdou do mecanismo original, que foi implementado nas primeiras versões do MySQL, que era o mecanismo chamado de IAM.

[02:54] E a partir da versão, creio que 3.2 do MySQL, eles substituíram o padrão original IAM, para o MyISAM, qual é a característica principal do mecanismo MyISAM? Ele não é um mecanismo puramente transacional, ele não implementa mecanismos de bloqueio dos registros dentro das tabelas.

[03:25] O tipo de bloqueio que o MyISAM faz quando uma tabela está sendo atualizada, é um (lock) na tabela como um todo, isso permite com que a tabela seja muito mais rápida, se eu quiser, por exemplo, só usá-la para efetuar somente leituras, mas aí, você tem um problema.

[03:49] Se você tiver muita gravação simultânea, por diferentes usuários, diferentes sessões dentro do banco, como esse controle não é tudo específico, a gente pode ter problemas usando tabelas MyISAM, por isso nós temos que tomar cuidado.

[04:11] Então, algumas características específicas do MyISAM, para a gente decidir que tipo de forma de tabela a gente vai utilizar, por exemplo... Então, se eu tiver uma tabela que não vai ter muitas transações, eu posso usar MyISAM.

[04:29] O MyISAM tem uma característica que a chave estrangeira não suporta o tipo FULLTEXT, que é um tipo de dado específico da tabela. Quando a gente cria um hash de dados ou um hash de índice, a gente nunca pode se referenciar a ele através do nome.

[04:49] Nós temos uma vantagem que o MyISAM implementa dois tipos de forma de índice, que é o HASH e o BTREE, a gente vai falar um pouquinho sobre eles mais a frente, como eu já falei, o MyISAM, ele implementa bloqueio a nível de tabela, isso faz com que a atividade de leitura seja muito rápida, quando você usa o MyISAM.

[05:10] Então ela é muito específica para bancos de dados, que nós chamamos de Data Warehouse, ou seja, bancos de dados gerenciais de consulta e internamente, os dados que são armazenados dentro das tabelas do MyISAM, já são automaticamente armazenados de forma compacta, melhorando o tamanho do banco de dados, quando eu tenho muita informação.

[05:38] Lembra que a gente falou sobre variáveis de ambiente? Existe algumas variáveis de ambiente que são diretamente ligadas ao MyISAM. A primeira variável é o key_buffer_size, o key_buffer_size, ele determina, esse parâmetro, o tamanho de cache que a gente vai usar para armazenar os índices do MyISAM.

[06:07] Dependendo do sistema operacional, se eu estiver usando 32 bits ou 64 bits, esse padrão pode ir desde 8MB, até 4GB. Um outro parâmetro importante é o concurrent_insert, é outro parâmetro que a gente pode estar especificando lá no my.cnf ou no my.ini, que é o arquivo de inicialização do MySQL.

[06:36] Esse parâmetro determina o comportamento das inserções concorrentes dentro de uma tabela MyISAM. Existe uma variável chamada: intervalo de dados, que é uma espera que MySQL faz entre a instrução de um dado e de outro dado. Se essa variável concurrent_insert for igual a 1, você consegue fazer inserções simultâneas, sem intervalo de dados.

[07:06] Se a configuração for igual a 0, a gente desativa as inserções simultâneas, ou seja, uma instrução sempre vai esperar a tabela ser liberada para funcionar e quando tiver a configuração numero 2, eu permito a instrução simultâneas com um intervalo de dados ativado.

[07:28] Outra variável é a delay_key_write, a gente usa essa variável para criar um atraso entre a atualização dos índices e o momento que a tabela é fechada, por exemplo, quando eu faço uma instrução de dados, se eu usar o delay_key_write, o MySQL vai esperar todas as inserções serem efetuadas, para depois fazer uma atualização dos índices.

[08:02] Isso cria, claro, uma melhor consistência no dado dentro do banco de dados, porém, isso cria uma lentidão um pouco maior no momento da atualização da informação. O padrão do MyISAM é essa variável delay_key_write, com o valor igual a 1.

[08:28] Então, quando eu crio automaticamente uma tabela do tipo MyISAM, automaticamente o delay_key_write vai estar ativado, se eu quiser melhorar um pouco a performance dos inserts, eu devo ir lá na configuração e colocar essa variável delay_key_write como off.

[08:50] Nós temos também a variável max_write_lock_count, essa variável de ambiente, ela determina quantas gravações em uma tabela vão ter precedências às leituras, ou seja, quando tiver gravações e leituras ao mesmo tempo, qual vai ser a prioridade da inclusão de dados na tabela, em relação às leituras.

[09:28] E a gente tem uma outra variável, que é a preload_buffer_size, essa variável, ela determina o tamanho do buffer que vai ser usado no pré carregamento do índice de caches de chaves da tabela. O padrão dessa variável, normalmente, é KB.

[09:55] Claro que o uso dessas variáveis de ambiente vai vir com o tempo, na medida em que o administrador do MySQL começa a entender melhor o seu ambiente, entende melhor os mecanismos de MyISAM e pode mexer com essas variáveis.

[10:15] Mas a minha experiência diz o seguinte, use sempre o padrão, quando você cria uma tabela do tipo MyISAM, você deve apenas levar em consideração se o seu caso, ele está dentro dessa opções aqui, específicas, para determinar se você vai usar o MyISAM ou não como tipo de tabela.

[10:44] O que nós estamos vendo aqui, são três utilitários que existem dentro do MySQL, para a gente poder manipular tabelas do tipo MyISAM. A gente tem um primeiro aplicativo que é o myisamchk, ele é usado para a gente poder analisar, otimizar e reparar tabelas MyISAM, pode ser que as tabelas estejam mal construídas, algum problema no seu armazenamento interno.

[11:16] Então o myisamchk, reconstrói essas tabelas. O myisampack, ele é usado para a gente poder criar tabelas MyISAM compactadas, que vão ser só usadas para leitura, nada mais. São tabelas que a gente, durante o uso do aplicativo, a gente cria elas, coloca informação e elas não vão poder sofrer nenhum tipo de insert.

[11:43] Claro que essas tabelas vão ter mecanismos de controle de escrita, praticamente nulos, praticamente inexistentes, fazendo com que a performance da leitura seja muito rápida.

[11:57] E um outro aplicativo é o myisam_ftdump, que é usado para a gente poder exibir informações sobre os campos do tipo texto, que eu tenho dentro do MyISAM, ele fornece uma informação mais completa sobre esses campos.

[12:14] Então, tá, era mais ou menos isso que eu gostaria de falar para vocês, sobre os tipos de tabela MyISAM. Valeu.

## InnoDB e Memory

Transcrição

[00:00] Agora vamos falar do InnoDB. O InnoDB é um mecanismo de armazenamento usando quando eu vou realmente ter um banco de dados transacional.

[00:12] Quando eu falo banco de dados transacional, eu estou imaginando um banco de dados onde eu tenho uma aplicação, onde eu tenho dezenas, centenas ou milhares de usuários fazendo inclusões, alterações, exclusões e consulta de dados naquele banco ao mesmo tempo.

[00:32] É uma forma diferente, quando eu falo de bancos de dados gerenciais, onde durante um período, eu faço uma carga grande desse banco e depois os usuários apenas consultam as informações. Nesse caso, o MyISAM, ele é mais direcionado.

[00:51] Já para bancos de dados com várias transações, a gente aconselha usar o mecanismo de armazenamento InnoDB e foi o InnoDB que trouxe para o MySQL o suporte a transações relacionais, até versões anteriores, quando não utilizavam esse tipo de mecanismo, o MySQL não era full transacional.

[01:17] Então, claro, algumas características do mecanismo de armazenamento InnoDB. Claro, suporte completo ao banco de dados transacional, o bloqueio da tabela durante uma atualização, ele é feito a nível de linha.

[01:38] Ou seja, quando eu atualizo um informação, aquela linha está bloqueada, mas a tabela toda está liberada para sofrer outras alterações e também tem suporte completo a chaves estrangeiras.

[01:56] Em termos de índice, o InnoDB só utiliza índice do tipo BTREE, eu ainda não estou explicando para vocês o que é um índice e quais são os seus tipos, mas a gente já vai adiantando que InnoDB só suporta BTREE.

[02:13] Para a gente configurar um cache de buffer, para poder ele agilizar os seus processos internos, no caso de um banco de dados InnoDB, a configuração do cache, tanto para o banco, quanto para o índice, pode ser feita de formas separas, diferente, por exemplo, do MyISAM.

[02:35] E eu consigo, através de bancos InnoDB, fazer um backup do banco sem bloqueá-lo, sem precisar tirar ele do ar para fazer isso. Nós temos algumas variáveis de ambiente, as três primeiras, elas estão relacionadas com as tabelas.

[02:59] A gente tem o innodb_data_file_path, que determina o caminho dentro do sistema operacional, onde as informações serão armazenadas e o tamanho desses arquivos máximos. O InnoDB, ele armazena as informações através de um arquivo que vai crescendo e depois quando ele acaba, ele vai criando um outro arquivo com sufixo 1, 2, 3 e assim por diante.

[03:30] O local desse arquivo e o tamanho máximo de cada parte do arquivo é determinado através desse parâmetro. Um outro parâmetro é o innodb_data_home_dir, como o próprio nome diz, ele é feito para dizer qual é o caminho comum de diretório de todos os arquivos InnoDB.

[03:54] Se eu especificar esse cara, ele vai gravar tudo dentro desse diretório, diferente do default, o default, o padrão, ele vai gravar tudo dentro de um diretório chamado MySQL Data, que é o padrão do armazenamento de dados de um banco de dados MySQL.

[04:18] A gente tem o innodb_file_per_table, a gente pode especificar cada tabela de armazenamento InnoDB, os arquivos que armazenam as informações, eles tem uma extensão ".ibd". E aí, quando a gente usa esse parâmetro innodb_file_per_table, a gente consegue separar o armazenamento dos dados, com os índices.

[04:55] O padrão é que a gente armazene essas informações num espaço compartilhado, com essa variável de ambiente, a gente consegue separar o armazenamento do índice e também do dado. Já as três ultimas variáveis que estão aqui nesse slide, ele diz respeito a variáveis que estão relacionadas com performance.

[05:20] A primeira variável, que é a innodb_buffer_pool_size, ela determina o tamanho de buffer que o mecanismo de armazenamento InnoDB, vai estar usando para armazenar dados e índices em cache. Quando a gente utiliza cache, a gente está falando de coisas que ficam em memória que melhoram a performance.

[05:43] Já a variável de ambiente innodb_flush_log_at_trx_commit, nome grande, ela vai configurar a frequência com que o buffer de log é liberado para o disco. Na medida em que a gente vai usando o banco, esse buffer de log vai crescendo e de tempos em tempos, ele é descarregado para o disco rígido.

[06:11] Então essa variável vai dizer a frequência com que isso vai ser feito. Finalmente, a innodb_log_file_size, ele vai determinar o trabalho em bytes que cada um dos arquivos de log (InnoDB) vão ter. O padrão dessa variável, quando você não menciona nada, é ter um log de no máximo 5MB.

[06:38] Essa variável vai dizer se o tamanho desse log vai ser maior ou menor por arquivo, isso não significa que o log terá 5MB ou mais ou menos, significa que cada arquivo de log, será criado de 5 em 5MB.

[07:01] Vamos agora falar de outro mecanismo de armazenamento, que é o Memory e como o próprio nome diz, o Memory, ele é um mecanismo de armazenamento que cria tabelas apenas na memória, quando eu falo memória, eu estou falando apenas na memória RAM.

[07:24] E aí, claro, se a informação... se a tabela está lá na memória RAM, isso significa que o acesso a ela é super rápido, porém tem uma desvantagem, essa informação, ela não fica armazenada no disco. Os dados, eles precisam ser sempre reinicializados quando o servidor é inicializado.

[07:51] Ou seja, eu inicializei um servidor, as tabelas de Memory estão vazias, se eu for criar tabelas e colocar dados em membro, eles vão ficar lá até o servido ser reinicializado novamente. Se isso acontecer, se houver uma reinicialização, os dados são perdidos.

[08:12] Nós temos algumas características dos bancos em membro, das tabelas em membro. Não tem chave estrangeira. É claro, o ato de ler e escrever dados nas tabelas membro são muito rápidos.

[08:31] Claro, porque a informação está em memória e o bloqueio é muito parecido com o MyISAM, ou seja, quando eu vou bloquear algum registro, porque eu estou atualizando ele, eu bloqueio a tabela toda.

[08:48] Em termos de índices, o Memory, ele também utiliza os mecanismos de HASH e de BTREE, mas o padrão é o HASH, novamente, índices eu vou falar mais a frente o que significa.

[09:06] Mas a gente já viu, tanto nesse vídeo, quanto no anterior, que o padrão MyISAM, InnoDB e Memory, possuem alguns tipos de índices que são suportados e alguns tipos de índices que são padrões. As tabelas de Memory, elas tum uma característica específica para armazenar o dado.

[09:32] Eles usam um formato que no MySQL, nós chamamos de formato de linha de comprimento fixo, então, por causa disso, eu não posso ter tipos de campos muito grandes, como por exemplo, tipos Blob ou tipos Texto, ou seja, campos que são muito... são campos que tem tamanho muito grande, que armazenam muitos caracteres.

[09:58] Então era isso que eu queria falar para vocês sobre as tabelas do tipo InnoDB e Memory. Valeu.

## Usando os mecanismos de armazenamento

Transcrição

[00:00] Vamos ver na prática um pouquinho como é que funciona durante a manipulação de tabelas, os mecanismos de armazenamento. Então, eu vou criar aqui um script novo, eu entrei aqui no MySQL Workbench e eu vou usar esse banco aqui, o sakila, que é um banco de dados padrão que vem, quando a gente instala o MySQL.

[00:26] Eu vou criar uma tabela: "CREATE TABLE", é o comando para criar tabela, "Default_Table", vai ser o nome da tabela, a gente quando viu o curso de manipulação de dados ou curso de consulta avançada e até o curso de introdução, a SQL, usando o MySQL, a gente já viu o comando CREATE TABLE.

[00:54] Mas a gente não viu esse mecanismo de armazenamento, ou seja, especificar qual é o mecanismo de armazenamento que uma tabela vai usar. Estou criando a tabela, eu vou criar um campo ID que inteiro, "INTEGER" e um campo, nome, que eu vou colocar como "VARCHAR(100)".

[01:23] Não estou especificando nada, não estou falando qual é o mecanismo de armazenamento que essa tabela vai usar, eu simplesmente vou rodar o comando.

[01:33] Se eu vier aqui no meu banco sakila, botão direito do mouse dou um Refresh e vou ver aqui que eu tenho a minha default_table e aqui do lado, eu tenho um caminho que me dá a informação sobre essa tabela. Eu vejo os campos, os índices, as chaves, tudo mais.

[01:50] Bem, eu vou clicar aqui no "i" e aí note que ele tem esse parâmetro aqui: Engine InnoDB, o que significa? Significa que se eu não falar nada, automaticamente o MySQL vai criar uma tabela do tipo InnoDB.

[02:11] Ou seja, vai preparar a minha tabela para um banco de dados relacional, que vai suportar muitas transações, que vai fazer o controle da transação por linha, banco que está sendo preparado para ser usado numa aplicação que vai ter muitos usuários acessando ao mesmo tempo, incluindo, alterando, excluindo ou consultando informação.

[02:41] Mas eu posso, se quiser, alterar esse mecanismo da tabela, mesmo com a tabela criada a inclusive, mesmo com a tabela com dados. Se eu pegar esse comando aqui, vou colar aqui, só que... Não, não vou fazer isso, desculpe, vou alterar o mecanismo.

[03:04] Então, eu uso o "ALTER TABLE", coloco aqui o nome da tabela e aí, o parâmetro é engine, se eu botar aqui "engine = MyISAM", vamos olhar aqui, eu coloquei aqui "Engine = MyISAM", essa tabela default_table que originalmente é InnoDB, se eu rodar esse comando, vier aqui e olhar a informação da tabela, note que ela agora ficou MyISAM.

[03:39] Ou seja, agora é uma tabela que vai estar locando a tabela toda quando eu for alterar uma coisa nela, é uma tabela que fica mais rápido para leitura, mas que pode não se dar bem, quando a gente tiver muitas transações sobre ela, alterando ou incluindo coisas novas.

[04:04] Mas durante a criação da tabela, eu posso estar especificando o mecanismo de armazenamento, então agora sim, eu vou copiar aqui o comando de cima, vou criar uma tabela dois e aqui, depois da criação da tabela, eu posso colocar o engine, por exemplo, memory.

[04:29] Ou seja, eu estou forçando e especificando que durante a criação da tabela, essa tabela vai ser do tipo de memória, memory. Eu vou selecionar a linha, rodei, atualizo aqui o meu banco, as tabelas do meu banco, então eu tenho aqui o meu default_table 2, botão direito do mouse.

[04:52] Não, na verdade, não, clicando no table 2, eu vou clicar no "i" de informação e eu tenho aqui o meu padrão memory. A gente viu e eu falei sobre o InnoDB, o MyISAM e o Memory, que são os mais utilizados.

[05:11] Mas por exemplo, se eu clicar aqui em tables, botão direito do mouse e usar a opção create tables, ou seja, eu vou ver a caixa de diálogo, de criação de uma tabela, para eu poder criar tabela, não necessariamente por comando.

[05:28] Note que ao selecionar essa caixa de diálogo, a opção engine aqui em cima, ela já vem InnoDB selecionada, porque é o padrão, é o default do MySQL criar tabelas do tipo InnoDB, mas note, eu tenho uma gama de outras formas de... outros mecanismos de armazenamento que a gente pode estar utilizando.

[05:54] A gente viu o InnoDB, o MyISAM e o Memory, eu dei ênfase a esses três tipos, desse treinamento porque são os mais usados, mas eu tenho aqui uma série de outros tipos de mecanismos, que tem propriedades específicas.

[06:11] Claro que você tem uma vasta documentação no MySQL e você pode depois dar uma lida sobre o que significa cada um e a principal característica desses mecanismos de armazenamento, para ver qual é a situação que eles vão mais se adaptar ao seu caso.

[06:34] Então era isso que eu queria mostrar a vocês sobre o mecanismo de armazenamento. Valeu.

## MYSQLDUMP

Transcrição

[00:00] Vamos falar um pouquinho de uma coisa muito importante, quando a gente fala de administração de um banco de dados que é o backup.

[00:09] O backup nada mais é do que uma cópia do meu banco de dados, que eu faço periodicamente para poder depois recuperar num momento futuro, caso, por exemplo, eu tenha algum problema na minha base de dados ou algum processo que faz... acaba destruindo, por exemplo, a base de dados, algum processo errado que o analista executou.

[00:40] Então eu preciso voltar o estado do banco a um determinado momento, então a gente pega o backup que foi tirado periodicamente, digamos assim, toda a meia noite eu tiro um backup e aí, eu pego e ele recupero. E aí, eu tenho duas maneiras principais de se fazer um backup.

[01:05] Uma é o que nós chamamos do backup lógico, o backup lógico, ele exporta todas as estruturas, tabelas, dados, rotinas que estão armazenadas num banco de dados, para um script de instruções SQL, que depois, esse script pode ser executado para recriar o estado do banco de dados.

[01:36] O backup lógico, ele tem a vantagem que pode ser manipulado externamente, antes de eu recuperar as informações, ou seja, eu posso abrir aquele script.sql e editar os comandos. Já o backup lógico tem uma desvantagem, ele acaba sendo muito lento, já que eu tenho que executar comando a comando para poder recuperar o meu backup.

[02:05] O outro tipo de backup é o backup físico, o backup físico é uma cópia que contém todos os arquivos de sistema, que o banco de dados usa para armazenar as suas entidades, ele representa o backup dos arquivos binários do disco, os arquivos que representam o banco de dados, que estão armazenados no HD do servidor.

[02:32] Para tirar o backup físico é muito rápido, basta fazer uma cópia desses arquivos e a sua recuperação também, ela é mais rápida. Embora os arquivos do backup físico não sejam muito bem compactados, já que os arquivos binários originalmente, eu não consigo compactar muito essa informação.

[02:58] Normalmente, o tamanho do backup físico é menor do que o tamanho do backup lógico, já que no backup lógico, eu tenho todos os comandos dentro de um script, enquanto que o backup físico, eu tenho o arquivo onde a informação está armazenado.

[03:18] Normalmente a gente chama também os backup físicos de backup bruto. O MySQL tem um aplicativo chamado: mysqldump, ela é a ferramenta que nós usamos para executar os backups lógicos.

[03:41] Ele oferece uma variedade de opções para a gente incluir ou excluir banco de dados, selecionar dados específicos para o backup, fazer backup, por exemplo, somente do esquema, somente da estrutura ou somente dos dados, fazer backup de uma tabela específica, enfim.

[04:05] Eu posso selecionar pelo mysqldump tudo aquilo que eu quero utilizar para salvar dentro do meu backup. Então isso é um pouquinho da teoria que eu gostaria de falar para vocês sobre backup. Vamos fazer agora alguns exercícios práticos, tirando o backup, através do backup lógico, usando o mysqldump.

[04:33] Então eu vou fazer o seguinte, vou lá no Workbench, tenho o meu Workbench aqui aberto e eu vou olhar esse banco de dados aqui, o sucos_vendas, que é um banco de dados que a gente recuperou no início desse treinamento, que nós vamos usar como banco de exemplo, para a gente fazer os nossos exercícios.

[04:55] Eu vou fazer um backup desse banco, usando o mysqldump. Eu vou vir aqui e vou abrir aqui uma linha de comando e eu vou para o diretório onde o mysqldump está instalado, então ele está em Program Files, MySQL Server 8.0, bin.

[05:28] E se eu digitar aqui mysqldump, eu tenho o arquivo, claro que eu preciso colocar alguns parâmetros. Eu quero tirar o backup do banco de dados completo sucos_vendas.

[05:45] Então eu coloco: mysqldump -uroot, eu coloco bem junto mesmo do "-u" usuário, "-p" e dou um espaço, eu não coloco a senha, porque a senha vai ser requisitada quando eu rodar o comando, menos, menos, dois menos, databases e eu colocar o nome o database que eu quero tirar o backup, sucos_vendas.

[06:19] E aí, eu coloco o sinal de maior e aonde eu vou salvar o arquivo de backup? Eu previamente, já criei aqui no meu computador um diretório chamado: C:\mysqladmin, esse nome pode ser como qualquer um.

[06:39] Crie um diretório vazio na máquina de vocês, onde dentro desse diretório, a gente vai salvar tudo aquilo que a gente for fazer que exigir arquivos externos. Eu criei aqui no meu "C", um diretório mysqladmin, mas vocês podem criar aonde vocês quiserem, com o nome que vocês quiserem, desde que utilize esse nome dentro dos comandos.

[07:04] Então, voltando aqui, eu vou salvar o backup no C:\mysqladmin\ e vou colocar o nome de um arquivo, sucos_vendas_full.sql. Então está aqui, mysqldump, -uroot, -p vazio, a cláusula menos, menos databases, o nome da base, o sinal de maior e o arquivo externo.

[07:44] O nome do arquivo pode ser qualquer um, não precisa ser obrigatoriamente extensão ".sql", só que esse arquivo vai ser um arquivo texto, que depois, eu vou poder rodeá-lo com um script e aí, (igual) a todos os scripts de linguagem sql., a gente coloca como ".sql".

[08:05] Vou executar. Vou dar "Enter", ele vai me pedir a senha, coloquei aqui root e aí, pronto, executou. Vamos olhar lá no diretório, então eu tenho aqui no diretório mysqladmin, eu tenho esse arquivo sucos_vendas_full, sucos, underscore vendas, underscore full, ".sql", vamos abrir esse arquivo com o editor de texto.

[08:35] Então eu vou abri-lo aqui, então eu tenho aqui uma série de comandos, onde eu tenho o create database, onde eu crio aqui a base de dados sucos_vendas, eu dropo a tabela itens_notas_fiscais, depois eu crio a tabela. Aí, eu loco a tabela, ou seja, deixo a tabela fechada para escrita.

[09:08] E aí, eu faço os comandos de insert, esses comandos de insert estão um do lado do outro, tem vários comandos de insert aqui. Esses comandos aqui, eu estou inserindo os dados que estavam na base de dados quando eu tirei o backup.

[09:25] Então vocês imaginam, se eu tiver uma tabela de milhões, 10 milhões, 20 milhões de registros, ele vai escrever 20 milhões de linhas de insert. Claro que são inserts agrupados, mas isso vai ocupar espaço, esse arquivo ".sql", vai ser um arquivo muito grande, que as vezes, nem com editor de texto, a gente consegue abrir.

[09:52] Aí, eu tenho alguns comandos internos para estar variáveis internas, depois eu tenho a segunda tabela, notas fiscais, também tenho o comando create, tenho lá os inserts e assim por diante, ou seja, isso aqui foi criado automaticamente pelo meu processo de... por ter executado o mysqldump.

[10:23] Vamos voltar então aqui para o ambiente de prompt, eu falei para vocês que a gente pode pelo mysqldump, poder especificar que tipo de entidade a gente quer fazer o backup.

[10:40] Então, por exemplo, no comando que eu acabei de rodar, eu executei o backup, digamos assim, da base de dados toda, mas a gente pode executar um comando para fazer, por exemplo, o backup de apenas uma tabela. Então seria assim, mysqldump -uroot -p --, aí a cláusula é tables.

[11:13] Não, na verdade, desculpa, primeiro eu especifico a base, databases sucos_vendas, aí, agora sim, --tables, coloco o nome da tabela, então eu vou escolher a tabela de notas fiscais.

[11:34] E aí, eu coloco o sinal de menor e a saída, mysqladmin/sucos_vendas_ tab_notas_fiscais.sql, coloco aqui o root. Pronto, executei. Se eu olhar aqui, eu agora tenho um outro arquivo, note que esse arquivo é um pouco menor, porque claro, só tem informações de uma tabela e se eu abrir aqui ele com um editor de texto, eu só tenho aqui as informações de notas fiscais.

[12:21] Eu posso, por exemplo, gerar de todo mundo, menos de uma tabela específica, então aqui, mysqldump -uroot -p –databases sucos_vendas. Aí, eu uso, por exemplo, o comando ignore table. E aí, eu vou colocar aqui, por exemplo, sucos_vendas.notas_fiscais.

[13:01] Quando eu estou me referenciando a uma tabela que eu vou ignorar, eu tenho que colocar o nome do banco, ponto, o nome da tabela, diferente quando eu quero somente aquela tabela. Quando eu quero só a tabela, eu coloquei aqui só o nome da tabela.

[13:17] Quando eu quero ignorar, eu coloco o nome da base, ponto o nome da tabela. Vamos salvar no diretório mysqladmin\sucos_vendas_ig (ignore)_tab_notas_fiscais.sql, root. Escrevi errado notas fiscais aqui, mas não importa, a gente vai salvar um arquivo externo.

[13:55] Pronto, vamos voltar lá para o diretório, tem lá já um terceiro arquivo, só vou aqui renomear e colocar aqui: fiscais, para ficar pertinho. E eu posso, por exemplo, se eu quiser, eu posso salvar apenas as informações de, por exemplo, de dados, quero ignorar, por exemplo, toda a informação a respeito da estrutura da tabela.

[14:37] Então eu posso botar aqui mysqldump -uroot -p –databases sucos_vendas – no-create-db. Aí, ele já vai salvar um backup, lógico, que não criar base, -- no-create-info, não vai colocar as informações da base e por exemplo: --complete-insert, vou inserir todos os inserts das tabelas.

[15:23] E aí, vou salvar isso no c:\mysqladmin\sucos_vendas_somente_inserts .sql, root. Foi. Se eu olhar o arquivo, tenho mais um quarto arquivo que... somente inserts, se eu olhar, note que eu não tenho comando de create, eu simplesmente entro na base e insiro as informações de todas as tabelas.

[16:08] Eu poderia ficar aqui horas mostrando para vocês uma série de comandos que eu tenha para poder usar o mysqldump numa série de parâmetros, mas a documentação do MySQL que eu tenho na internet, ela é bem detalhada e bem vasta, eu vou até mostrar aqui para vocês.

[16:31] Se eu colocar aqui: http://dev.mysql.com/doc/refman – que é manual de referência – barra a versão, vou pegar aqui o inglês, mysqldump.html, eu acho que essa que é a URL. Eu tenho aqui todas as informações sobre o comando mysqldump.

[17:19] Se a gente arrastar aqui para baixo, olha só, eu tenho lá um montão de parâmetros, olha, "--add-drop-database", adiciona o drop database antes de criar o database; "--add-locks", coloca o comando lock tables. Se eu passar aqui o mouse, tem uma gama de parâmetros para o comando mysqldump.

[17:50] E é claro, a gente vai consultar a documentação, quando a gente quiser fazer alguma coisa específica, "Puxa, eu quero fazer um backup que somente tenha dados, mas também (lock) tabelas", então eu vou vir aqui e procurar uma combinação de parâmetros que me aquilo que eu estou interessado.

Observação IMPORTANTE sobre a instrução de Rotinas e Atores Procederes em Backups de BDs, a partir em versões mais recentes do MySQL(a partir da 8.0)

![imagem](/publico/mysql/imagem.png)

## Recuperando um backup

Transcrição

[00:00] Então, a gente já aprendeu a fazer backup usando o mysqldump, usando o Workbench e copiando os arquivos fisicamente. Agora, a gente vai aprender a recuperar o backup, a gente vai primeiro recuperar o backup a partir do arquivo que foi gerado pelo mysqldump.

[00:22] Então, novamente, se eu abrir aqui aquele meu diretório, onde eu estou salvando todos os backup, eu vou estar utilizando... vamos ordenar aqui por data, esse cara aqui, o sucos_vendas_full.sql, que foi o arquivo que eu criei usando o mysqldump, quando eu usei aquela propriedade –databases, ou seja, salvei toda a estrutura do banco.

[00:57] Eu vou então aqui no Workbench, aqui em Schemas, vamos criar aqui um script novo e aí, eu vou apagar a minha base: "DROP DATABASE sucos_vendas, vamos matar ela. Na verdade, é "DATABASE", databases é o parâmetro que a gente usa lá no mysqldump, é –databases, no plural, no DROP é database.

[01:39] Isso é normal, eu... as vezes a gente acaba confundindo os parâmetros, mas vamos lá, "DROP DATABASE sucos_vendas", então se eu vier aqui, eu não tenho mais um sucos_vendas, eu agora vou criar um novo, vou criar aqui o banco sucos_vendas.

[02:08] Então, pronto, eu tenho o meu sucos_vendas criado, porém vazio, sem nada. Então vamos lá, voltando aqui ao comando prompt, para eu recuperar os dados, eu vou rodar aquele script ".sql", que tem todos os comandos para recuperar a informação.

[02:30] Então é como se eu tivesse feito um script manual e fosse executar ele através do MySQL, eu poderia, inclusive... é porque ele é muito grande, eu poderia inclusive, se quisesse, copiar, digamos assim, esse script aqui, copiar e não sei... vir aqui no Workbench e colar e rodar ele aqui.

[03:01] Se eu rodar ele aqui, eu vou fazer todo o processo, só que claro, esse arquivo ".sql", como tem toda a informação da base, ele é muito grande e aí, rodar os scripts de dentro do Workbench, pelo editor de script, não é muito legal fazer isso, quando eu tenho milhões de linhas.

[03:22] Então, eu vou apagar aqui, eu não vou fazer por aqui, não. Eu vou fazer por linha de comando, como é que eu faço isso? Através do comando mysql, se eu clicar aqui mysql, vou botar -uroot -p e colocar aqui a senha do root, eu estou aqui dentro do MySQL.

[03:49] Se eu der aqui use sakila, é sakila mesmo o nome do banco? É sakila, use sakila, entrei na base sakila, se eu quiser aqui, vamos pegar uma tabela do sakila, actor, eu posso vir aqui e rodar: SELECT * FROM actor. Está vendo? Eu estou dentro da interface do MySQL, através somente de linha de comando.

[04:23] Muita gente está mais acostumada a administrar o MySQL pelo MySQL linha de comando, do que propriamente dentro do Workbench.

[04:33] Eu prefiro o Workbench porque ele é gráfico, eu consigo ver os comandos, selecionar o comando que eu quero, quando eu gero resultado, eu gero dentro de um grid, eu tenho algumas ferramentas de produtividade que me facilitam o desenvolvimento, o trabalho.

[04:51] Linha de comando é mais para o pessoal das antigas, old school, que o pessoal está acostumado a trabalhar. Por esse MySQL que eu vou executar um script grande, que pode ter muitas linhas.

[05:05] Então, eu vou dar um exit aqui, o exit sai do MySQL e vou chamar o MySQL de novo, mas vou fazer a seguinte coisa, eu vou chamar o MySQL passando o usuário e a senha e executando aquele script que foi salvo. Então é mysql -uroot -p, espaço e aí, agora, eu uso o comando menor.

[05:34] Eu usei o comando maior, o símbolo maior quando eu quero jogar para fora do MySQL os dados para um script, o menor, eu estou jogando para dentro, então é como se... a direção da seta está mostrando, eu estou vindo de fora para dentro e aí, aqui eu vou colocar o nome daquele arquivo mysqladmin, vamos conferir lá o nome do arquivo, é sucos_vendas_full.sql.

[06:16] Então ficou assim. mysql, o usuário, a senha, a seta indicando o sentido em que os dados vão estar sendo transferidos e aí, o nome do arquivo: extensão mysql. Cliquei, eu vou colocar a senha root, note que eu estou esperando um tempo e ele está, na verdade, executando todos os comandos. Acabou.

[06:50] Eu agora, se eu vier aqui no Workbench, der aqui um Refresh no sucos_vendas, inicialmente... já até apareceu as tabelas, eu não precisava nem dar o Refresh, mesmo assim, eu vou dar o Refresh de novo e eu agora tenho aqui as informações recuperadas.

[07:12] Então é assim que eu consigo recuperar os dados, através do comando mysql, quando a minha origem é um arquivo lógico. Agora, vamos recuperar o backup, não de um arquivo ".sql" que foi gerado pelo mysqldump e sim através daqueles dados que eu salvei naquele subdiretório que eu chamei até de Dados, esse diretório aqui.

[07:38] Desculpe, eu chamei de backup_sucos_vendas, onde eu tenho a estrutura completa dos dados, eu vou fazer isso então. A primeira coisa que eu vou fazer é parar, fazer um lock na base de dados, mas quando eu faço essa cópia, eu gosto de fazer uma coisa mais radical, eu gosto de derrubar o serviço do MySQL.

[08:06] Eu vou deixar o MySQL desligado, então eu vou fazer o seguinte, vamos fazer o seguinte exemplo, antes de continuar, eu vou dar o botão direito do mouse e vou dar um drop na base sucos_vendas. Então, note, a minha base sucos_vendas, ela não existe mais.

[08:28] Eu fecho o Workbench e eu vou aqui no serviço do Windows e vou procurar o serviço do MySQL, aqui, MySQL 8.0, vou parar esse serviço. Então aí, realmente ninguém mais vai entrar no MySQL nesse momento.

[08:57] E aí, eu vou fazer o seguinte, aqui, dentro daquele meu diretório Dados, eu vou pegar o my.ini, eu vou copiar, vou lá naquele diretório C, ProgramData, MySQL, MySQL Server 8.0, que é o diretório onde o MySQL espera encontrar a base de dados, eu vou colar e vou fazer a mesma coisa com o diretório Data, vou copiar e vou colar.

[09:37] Ele talvez diga que vai substituir alguns arquivos, tudo bem, vamos substituir. Já fiz a cópia dos arquivos fisicamente, então eu volto lá para o meu serviço, vou em inicializar e agora, vamos abrir o Workbench de novo. Vou entrar na minha conexão, vou colocar aqui a senha do usuário root, vou salvar ele, para não precisar mais.

[10:16] Note, eu entrei agora e a base sucos_vendas apareceu novamente, que eu tinha apago antes de copiar o backup, então eu tenho a minha base aqui recuperada. Então, essa é uma forma, é a segunda forma de eu poder recuperar o backup, quando eu quero copiar fisicamente os arquivos que foram salvos também, através de uma cópia física.

[10:42] É esse tipo de cópia que quando eu faço, ela aparentemente vai funcionar, mas pode ser que quando eu acessar alguma tabela dessa aqui, eu vá encontrar algum problema de algum dado corrompido, mas só vou descobrir isso quando ou eu for acessar uma coluna ou quando eu vou, por exemplo, acessar aqui... vamos pegar aqui um SELECT, quando eu for... Vamos lá de novo.

[11:17] Sendo to, aqui, quando eu for, por exemplo, executar um SELECT. Então, só nesse momento é que eu vou descobrir que há um problema de dado corrompido. Aí, eu uso o arquivo script ".sql", que eu salvei pelo mysqldump, para complementar a recuperação do backup, através da cópia dos arquivos.

[11:41] Ficou claro para vocês? Então é isso aí. Valeu.

## EXPLAIN - Verificando a performance de uma consulta

Transcrição

[00:00] Vamos entender na prática como é que o plano de execução pode mostrar para a gente, se uma consulta vai ser rápida ou demorada e para isso, a gente vai usar o MySQL como linha de comando.

[00:16] Então, eu vou buscar aqui, vou abrir a minha janela de linha de comando e vou lá para o diretório do MySQL, fica em program files, MySQL, MySQL Server 8.0 e bin. E aí, para entrar no MySQL, é mysql -uroot -p, coloco a minha senha root e aí, pronto, tenho aqui o meu ambiente do MySQL por linha de comando.

[00:58] Vou na minha base sucos_vendas e aí, vou executar uma daquelas consultas, vou começar pela consulta mais simples, que é a primeira, vou colar aqui. Opa, não copiei, copio, pronto. E aí, eu tenho lá o resultado da minha consulta pela linha de comando.

[01:27] Para a gente poder ver o plano de execução, a gente escreve EXPLAIN e a consulta que eu quero executar, ele me dá esses campos aqui, onde cada campo me dá uma pista de como vai se comportar essa consulta. Eu vou ter uma linha para cada tabela envolvida na query que está sendo analisada pelo EXPLAIN.

[01:58] Como no caso aqui, esse SELECT, somente utilizou uma tabela, que eu chamei de tabela A, somente a tabela A está envolvida nessa consulta, mas tem uma outra forma de a gente ver esse resultado, se eu botar aqui no final da linha um "\G", eu tenho o meu resultado, invés de no formato de tabela, sequencialmente, fica até mais simples de a gente poder estar olhando.

[02:34] Agora, eu tenho um terceiro formato do EXPLAIN, que é o meu preferido, que é o seguinte, eu coloco aqui, "FORMAT=JSON", ao colocar esse comando, eu vou ter a minha resposta assim. Aparentemente, você pode achar que isso é mais confuso, mas é que eu tenho informações mais interessantes nessa consulta.

[03:10] Uma delas é essa aqui, o query_cost, o query_cost, ele é basicamente o custo da consulta. Você vai me perguntar: "Que unidade de medida é essa? É segundo? É hora? É minuto?", na verdade é uma unidade indefinida. Pense no seguinte, quanto menor o query_cost, mais rápida vai ser a consulta.

[03:41] Então o seu objetivo é ir arrumando a consulta, de tal maneira que o query_cost seja o menor possível. Aqui, por exemplo, tem o numero de linhas que vão ser examinadas e basicamente, esses dois valores mostram o custo de leitura e de escrita da consulta.

[04:11] Então, primeira... a nossa primeira consulta custou 3.75, então eu vou até colocar aqui como comentário aqui em cima, 3.75. Vamos ser a segunda consulta, eu vou até fazer uma dica, antes de copiar e colar, vamos tirar os espaços aqui da consulta, deixar ela numa linha única.

[04:38] Então, eu vou copiar e voltando lá para a linha de comando, eu vou colocar aqui: "EXPLAIN FORMAT=JSON" e vou colar essa segunda consulta, só que eu vou colocar o "\G" no final. Bem, essa consulta, ela tem um JSON um pouco maior, note que eu tenho dois loopings.

[05:04] Eu tenho um looping que vai buscar dados da primeira tabela e note que ele aqui tem uma outra informação, que é possível chave de uso "PRIMARY", por que? Porque lembra? Eu tenho que fazer um join entre a tabela de produto e a tabela de itens, pelo código do produto e na tabela de produtos, o meu código é um primary key.

[05:34] Então, ele vai usar essa... a primary key para ajudar a fazer com que a performance desse join seja maior. Tem lá os mesmos custos, muito parecidos com a query, quando eu rodei ela sozinha, só que depois, eu tenho uma segunda query que inclusive, os custos são bem altos.

[06:00] E aí, o importante é que esse join trouxe esse custo total, 1517.94, então, note que a query ficou mais pesada ainda. Então, eu vou até colocar esse numero aqui, 76517.94, foi o curso da segunda query. Note, muito mais custosa, simplesmente pelo fato de eu ter feito um join.

[06:41] Vamos para a terceira, a terceira, eu já faço dois joins, então copiei aqui a consulta, vou vim aqui na linha de comando, lá em baixo. Opa. Vou dar um "Enter" aqui, até aparecer. Pronto. "EXPLAIN FORMAT=JSON" e eu vou colar a consulta, colocando o "\G" no final.

[07:19] Então está lá, tem já bastante coisa, vamos lá para o topo, essa minha consulta já custou 260242.51, note que ela foi mais pesada do que a consulta anterior e a de baixo que vai usar group by e order by, será que ela vai custar mais do que a outra?

[08:00] Vamos ver. "EXPLAIN FORMAT=JSON", "\G". Opa, cometi algum erro? Vamos repetir aqui o comando. Ah, sim, porque ";" aqui em baixo, tinha um ";" perdido aqui no canto, eu vou tirar ele. Pronto, vou executar. Ok, foi. Tenho lá as minhas buscas e o custo aqui foi 260.242.51, foi praticamente o mesmo custo que a query... Praticamente não, igual, o mesmo custo que a query anterior.

[09:14] Ou seja, inserir o group by e o order by, não influenciou no resultado da consulta. Então, a gente já conseguiu ver que EXPLAIN dá mais ou menos esse indicador, para dizer se a query é pesada ou ela é leve. O que a gente precisa é tentar redesenhar ou colocar artifícios dentro do MySQL, para fazer com que essa consulta fique mais rápida, que o custo dela caia.

[09:52] Esse é um desafio que o DBA tem para ajudar o analista de negócio, na verdade não é o analista de negócio, mas o analista que está projetando o banco, criando sistema, para que ele, ao construir consultas que vão gerar relatórios para os usuários, que ele faça consultas, de tal maneira que o custo da query acabe sempre sendo um pouco menor.

[10:23] Então é isso aí, gente, é isso que eu queria falar para vocês sobre o comando EXPLAIN e como que ele nos dá esse resultado do custo da query. Valeu.

## Conceitos de índices

Transcrição

[00:00] Vamos falar um pouquinho sobre índices. O conceito de índice baseia-se assim, que... se eu for pesquisar um conjunto de dados, buscar um dado dentro de uma lista de informações, onde esse dado que eu estou buscando, se ele está previamente classificado, ordenado, é muito mais fácil achar esse dado, do que se eu tivesse procurando essa informação numa lista totalmente espalhada.

[00:34] Porque assim, se eu tenho uma coisa ordenada de forma alfabética, por exemplo e eu vou procurar por um nome, por exemplo, Pedro, eu já buscar direto na letra "P", porque eu sei... se ela está ordenada, eu tenho essa busca de uma maneira mais inteligente, mais rápida, do que se eu for buscar esse nome dentro de uma listra totalmente bagunçada.

[01:02] Então, o índice, ele serve para ajudar a gente na busca dessas informações, então é uma estrutura que auxilia a tabela a achar dados. Quando o MySQL, ele cria um índice, seja esse índice uma ou mais colunas, ele vai e cria para a gente uma copia dessa coluna, numa outra estrutura, mas de forma ordenada.

[01:40] O que nós estamos vendo aqui em cima, seria a representação de como funciona o índice. Atenção, numa tabela do tipo MyISAM, a informação que é colocada na tabela, ela está apresentada de forma, como eu posso dizer, assim... de forma... na ordem com que os registros forem incluídos.

[02:06] Então, eu tenho aqui no canto uma tabela de livros, onde o primeiro livro que foi inserido foi o livro 7-234-5, deixa eu só colocar aqui o apontador. Pronto. Foi o livro 7-234-5, Sob Dica e esse é o autor.

[02:22] Depois, eu inclui esse outro ID, com esse no título e esse autor e o de baixo, depois, foi o terceiro livro a ser colocado nessa base de dados. Se eu quiser procurar pelo livro 2-345, se eu não tiver a estrutura de índice, eu tenho que percorrer essa tabela e ir procurando, até acha-la.

[02:51] Mas aí, em tabelas MyISAM, que é o exemplo que eu estou mostrando aqui em cima, quando eu crio um índice, ele cria uma estrutura a parte, onde ele coloca a coluna, onde o índice está sendo representado, já de forma ordenada e eu tenho do lado uma estrutura que diz a posição daquela coluna dentro da tabela.

[03:20] Então, por exemplo, o 2-2315 é o segundo registro, está aqui, é o segundo registro. O 7234-5, é o primeiro registro, está aqui em cima. Então, esse aqui seria a tabela de índices, quando a gente utiliza o ID como índice.

[03:41] Agora, se tu quiser criar índices para a coluna título ou para a coluna autor, eu vou ter outras estruturas, onde o campo está ordenado de forma alfabética e eu tenho como referência o registro que está aqui em cima. Então, nesse caso aqui, eu tenho uma tabela e três índices.

[04:04] Não importa se o índice é de uma coluna que é chave primária ou não, relembrando, chave primária é aquela chave que a tabela tem, onde nenhum registro pode se repetir com aquela mesma chave. Aqui no caso, a chave primária é ID, mas a representação do índice dentro de uma tabela MyISAM, funciona da mesma maneira que os outros índices.

[04:36] Agora, essa estrutura, ele tem um certo custo. Apesar de o índice facilitar o processo de busca, se eu, por acaso, for incluir um novo registro na minha tabela, eu vou ter que estar colocando, atualizando esses índices, toda a vez que eu modificar a minha tabela.

[05:09] E isso de uma certa maneira, é custoso. Imagine, eu tenho aqui três índices, toda a vez que eu modificar ou incluir alguém, quando essa operação for feita nessa tabela, eu tenho que também estar atualizando as tabelas de índice.

[05:31] Então, claro, se eu tiver uma tabela muito grande dentro do MySQL e se eu tiver muitos índices associados a essa tabela, toda a vez que eu for incluir, alterar ou excluir ou... um registro daquela tabela, eu vou ter um problema de performance, porque essa operação vai ficar muito mais lenta, porque a cada modificação da tabela, eu vou ter que alterar os índices.

[06:02] Então, isso é um peso de benefício e custo, que você deve estar meio que prestando atenção, sempre que você for projetar os índices e tudo mais, dentro da tabela que você vai usar na base de dados.

[06:26] Agora, nas tabelas do tipo InnoDB, apesar de o índice também ser de uma certa maneira custoso ao atualizar a tabela, a estrutura de índices na InnoDB, ela é um pouquinho diferente da apresentada aqui.

[06:45] Então, vamos passar para o próximo slide, aqui está a representação dos índices numa InnoDB. Na InnoDB, há uma distinção entre o índice que está associado a chave primária e ao que não é chave primária. Quando eu tenho um índice associado a chave primária, ele faz parte da tabela de dados.

[07:09] Então, aqui no caso, note, apesar de a minha tabela ter uma ordem natural de inclusão dos dados, ao fazer isso, uma tabela InnoDB já organiza a própria tabela usando o índice da chave primária. Então, é como se o índice e a tabela de dados, para a chave primária, fossem uma coisa só.

[07:37] Então, note que aqui os dados na minha tabela já estão ordenados pelo ID, porque o ID é a chave primária, por isso que quando a gente faz uma leitura, uma inclusão de dados numa tabela InnoDB, alteração em massa, por exemplo, "Ah, estou carregando um Data Warehouse, então tem que ler 1 milhão de registro de um canto para o outro canto".

[08:10] Se os dados que eu estou usando para fazer essa leitura de massa já vierem ordenados lá da fonte, usando o mesmo critério que a chave primária da tabela, eu vou ter uma melhora substancial na performance de leitura desses dados. Agora, como é que são os índices?

[08:33] No caso dos índices dos outros campos, que não são chaves primárias, ele também cria aqui uma estrutura a parte, só que aqui, no caso, eu vou ter só uma estrutura para o índice do título e do autor, porque o índice de ID, que é chave primária está na própria tabela.

[05:55] E aí, a referência que eu vou ter, não é a posição do registro na tabela e sim, o código da chave primária. Então, por exemplo, vamos subir aqui antes. Antes os dados estão desordenados na tabela e a referência é a posição do registro.

[09:18] Já na InnoDB, a tabela já vem ordenada automaticamente e a referência é pelo campo da própria chave primária. A vantagem dessa ordenação de índices, através da chave primária, é que, por exemplo, se a gente precisar fazer uma busca por ID, a gente não precisa estar trabalhando com duas estruturas ao mesmo tempo.

[09:50] Na MyISAM, por exemplo, se eu quero buscar um ID, eu tenho que vir aqui no índice, achar o ID, ver a posição e aí, depois ir para a tabela e buscar a informação. Se eu quero buscar por ID, dentro da InnoDB, ele vai buscar na própria tabela, então não utilizo uma outra estrutura.

[10:15] É claro que o custo para achar alguém, que não é chave primária, é praticamente o mesmo, tanto na MyISAM, quanto na InnoDB, porque eu vou ter que realmente usar a estrutura de índices para achar quem eu estou procurando, ver a referência, não importa se aqui no caso a referência é uma chave primária, no caso de InnoDB ou uma posição dentro da tabela, como é no caso do MyISAM.

[10:43] Eu vou buscar essa posição e aí, eu tenho a ligação com a informação na tabela. Então, essas são duas diferenças substanciais internas de como é que funciona um índice dentro de tabelas MyISAM e InnoDB. Valeu.

## HASH e BTREE

Transcrição

Nota: No tempo 16:16 do vídeo, o instrutor fala que apenas o HASH vai funcionar direito no InnoDB sendo que na verdade é o BTREE, assim como ele explicou no início do vídeo.

[00:00] A gente já viu em vídeos anteriores, principalmente no vídeo passado, mais precisamente, que o MyISAM e o InnoDB tum estruturas diferentes quando constroem os seus índices.

[00:14] No caso do MyISAM, independente se o índice é chave primária ou não, a gente constrói sempre uma estrutura de dados ordenados pelo critério do índice e a referência na tabela é pelo posicionamento do registro na ordem com que eles forem inseridos, independente se é PK ou não.

[00:41] Já o InnoDB, ele tem uma distinção de o índice é PK ou não PK, se ele é PK, a própria tabela é ordenada pelo índice, pelo critério da chave primária e os outros índices possuem uma estrutura muito parecida com o MyISAM, só que a referência entre o dado que está no índice e na tabela, não é pela posição do dado que foi inserido e sim pela localização da própria PK.

[01:18] Agora, para a gente procurar o valor dentro do índice, a gente tem dois tipos de algoritmos que nós podemos fazer isso e em outro vídeo, bem no início dessa aula, eu até mencionei isso e falei que iria explicar sobre isso um pouco mais na frente.

[01:38] Esses dois algoritmos são os BTREE e HASH, são dois algoritmos diferentes que nós usamos para buscar alguém dentro de uma lista ordenada. Então, independente de como é a minha estrutura de índice, eu vou ter que fazer buscas nessas listas que já foram previamente ordenadas.

[02:05] E aí, eu posso fazer essas buscas através o BTREE ou através do HASH, porém o MyISAM, ele suporta índices que usam o algoritmo de cada BTREE ou HASH. Já o InnoDB não, o InnoDB, ele só utiliza algoritmos de busca, do tipo BTREE. Agora, como é que funcionam esses algoritmos?

[02:37] Para entender bem como é que funciona esses algoritmos, a gente precisa primeiro entender um conceito, um pouco diferente, que é o conceito de uma árvore binária. Então, o que eu estou vendo aqui em cima é uma árvore binária.

[02:56] Quando a gente monta essa árvore binária, a gente garante sempre que todos os valores que estão a esquerda do nó, são valores menores do que o valor do nó e todos os valores que estão a direita do nó, são valores maiores do que o nó.

[03:20] Então, se a gente olhar aqui esse exemplo, essa figura, note o seguinte, todos os valores que estão a esquerda do 27, são nós menores que 27 e todos que estão a direita do 27 são nós maiores que 27. Então, se eu estiver olhando o 27 e quiser buscar um numero menor que 27, eu vou para o lado esquerdo.

[03:49] Se eu quiser achar um numero maior do que o 27, eu vou para o lado direito, se eu quiser achar o próprio 27, eu não preciso ir para lugar nenhum, já o encontrei. Agora, se a gente olha o foco do outro nó, por exemplo o 14, todos os nós que estão a esquerda 14, são menores do que 14 e todos que estão a direita do 14, são maiores do que o 14.

[04:16] Então, por exemplo, então eu estou vendo... vamos fazer um exemplo aqui hipotético, digamos que eu queria buscar o numero 19, como é que o algoritmo funciona? Ele vai no 27, 19 é maior que 27? Não, é menor, então eu sei que está tudo do lado esquerdo.

[04:42] Eu esqueço os nós do lado direito. Aí, eu passo para o nó de baixo que é o 14, o 14, ele é menor ou maior que 19? "Ah, ele é maior que 19", então eu sei que o 19 está a direita do 14, eu não... tudo o que estiver a esquerda do 14, eu não vou mais, aí eu desço mais um nível.

[05:06] Aí, eu acho o próprio numero 19. Agora, o que que é uma BTREE, uma BTREE é uma árvore binária balanceada, por isso a letra B, de balance, qual é a diferença então de uma árvore binária normal e uma árvore binária balanceada?

[05:34] Na árvore binária normal, quando eu monto esse algoritmo de esquerda e direita, eu não garanto para vocês que a árvore tem os mesmos nós, tanto para um lado, quanto para o outro. Já numa árvore balanceada, a gente meio que garante que os nós estão bem distribuídos, ou seja, normalmente o topo da árvore binária é a mediana dos números, das opções que eu estou procurando.

[06:14] E aí, eu garanto que se eu for buscar para o lado direito ou buscar para o lado esquerdo, tanto faz, eu vou ter mesmos custos para achar um determinado numero. Agora, como é que a gente usa esse algoritmo de BTREE para achar um dado dentro do índice, quer dizer, como é que o índice faz isso?

[06:47] Então, o que acontece é o seguinte, a gente arruma, o índice, ele arruma os dados dentro de um topo, usando um algoritmo que chama D e dois D. Então, é como se eu pegasse o menor e o maior valor e criasse intervalo constantes que a gente chamaria de D e eu vou colocar esse números nesse topo.

[07:15] E aí, eu sei, por exemplo, que o que está a esquerda do 7, está nesse grupo aqui, o que está entre o 7 e o 16, está nesse grupo aqui e o que está para lá do 16, está nesse grupo aqui. Então, ela é uma árvore binária um pouquinho, então se eu quiser buscar o numero 7, eu já acho de cara.

[07:41] Se eu quiser buscar o numero 9, por exemplo, eu vou ver aonde que o 9 está, então o 9 não está aqui, porque o 9 não é menor que sete, o 9 não está aqui nessa região, porque ele não é maior que 16, eu sei que o 9 está entre o 7 e o 16. Então, ele sabe que ele vai estar num grupo de numero ali do meio.

[08:12] Então, essa busca... a gente faz esse exemplo aqui com números, mas esses valores a serem buscados podem ser textos, claro... qual é o texto que é menor do que outro? Respeitando a ordem alfabética, o A sempre vai ser menor do que B, menor que C e assim por diante.

[08:36] O algoritmo de BTREE, ele é matematicamente eficiente, se eu tiver, por exemplo, 4 bilhões de nós, por exemplo. Se você olhar matematicamente, no máximo eu vou precisar fazer 32 buscas para achar qualquer numero num algoritmo de BTREE, por que?

[09:06] Porque assim, tem 4 bilhões, então o nó do meio da árvore balanceada, vai ser o numero 2 bilhões. Então, se eu quero achar um numero, a primeira coisa, digamos que eu queira achar o numero 1450, eu vou no 2 milhões, eu vejo esse numero está a direita ou a esquerda?

[09:33] Está a esquerda. Aí, no segundo nível a esquerda do 2 milhões, eu tenho um nó central que é um milhão. Aí, eu vou testar, estou no segundo nível. O numero está a esquerda do um milhão ou a direita de um milhão? "Ah, está a esquerda".

[09:52] Aí, o nó de baixo do grupo da esquerda, vai estar em 500 milhões e assim por diante e aí, até eu descer, depois de descer 32 níveis, eu vou conseguir chegar ao grupo de nós, que o numero que eu estou buscando o existe, por isso que é uma consulta que requer... é um algoritmo que requer um esforço computacional para achar qualquer valor bem pequeno.

[10:24] Do que, por exemplo, eu percorrer os 4 bilhões e saber quem é numero, esse numero é o que eu quero? Não. É o que eu quero? Não. Lembrando que essa busca da árvore binária, seria a busca para eu achar o valor que e usado como critério do índice.

[10:45] Se eu tenho um índice por estado, então eu estou usando o método BTREE para achar o estado dentro da lista ordenada. Quando eu achar o estado, aí eu vejo a referência, se for MyISAM, a referência é pela linha da tabela, se for InnoDB, essa referência é a PK e aí, vou na tabela e consigo capturar todos os dados que eu estou procurando.

[11:16] Então, esse aqui é o conceito do algoritmo BTREE. O algoritmo HASH, ele é um pouquinho mais difícil de entender, até eu mesmo tenho um pouco de dificuldade, porque ele tem algumas coisas meio misteriosas embutidas nele.

[11:37] Algoritmo de HASH, ele é usado, não somente para índices, mas o HASH é usado muito para criptografia, para armazenagem de senhas e o algoritmo de HASH é um algoritmo matemático que permite que a gente pegue um valor de texto, um string, independente do seu tamanho, se é uma string de um caracteres ou de 100 caracteres.

[12:05] A gente reduz isso a uma palavra de tamanho fixo, então é como se a gente, por exemplo, essa tabela, eu tenho lá o seguinte, eu tenho uma string, aqui tem um montão de letras e aplicando o algoritmo de HASH nele, eu transformo essa string em outros caracteres de string com tamanho fixo.

[12:29] Mas, se eu por acaso pegar uma outra string, um pouco menor, eu consigo reduzir ele para uma string do mesmo tamanho que o anterior, isso vai depender dos parâmetros que eu estou colocando no HASH. E aí, o algoritmo de HASH tenta tanto transformar o string em HASH, como pegar o HASH e transformar de volta para string.

[12:57] Os valores que foram transformados pelo HASH, são valores completamente embaralhados, que eu não consigo entender, por isso que esse algoritmo é muito usado em criptomoedas, criptografia, armazenar senha, essas coisas. Agora, como é que isso então ajuda a gente a achar alguém em uma tabela dentro do banco de dados?

[13:25] Vou imagina um livro, um livro que você compra na banca, na livraria, numa banca de jornal. A primeira coisa que o livro tem, na primeira página dele tem um negócio chamado índice, que tem os capítulos e cada capitulo tem subtópicos e dentro de cada subtópico do capitulo, tem a página.

[13:49] Então, eu só quero pegar aquele livro e eu quero entender um assunto, eu quero ler sobre tal coisa. Eu vou olhar o índice, eu vejo em que página o índice está, o assunto, desculpe, vou pegar o índice, acho o meu assunto, vejo a página que o assunto está.

[14:09] E aí, eu vou naquela página e aí, eu começo a ler o texto, até encontrar o tópico que eu estou procurando. O HASH funciona da mesma maneira, como é que funciona isso? Então eu tenho o meu índice, lá com os meus dados num estrutura separada.

[14:32] E aí, eu guardo dentro de palavras casas o endereço de memória de alguns conjuntos de dados, então é como se, por exemplo aqui, eu tenho tanto o ID5, quanto o ID3 armazenados nesse conjunto de endereço de memórias HASH e aí, é como se esse "id=3" e "id=5", fizessem parte do mesmo capítulo de um livro, que é esse grupo aqui.

[15:15] Então, quando eu quero pegar o dado de 5, eu aplico o algoritmo de HASH, ele vai me dar uma palavra constante, que é o endereço de memória onde o dado está e aí, eu vou buscar aqui dentro o registro que eu quero achar. E aí, pode ser que seja esse ou seja esse ou seja esse, porque esse endereço de memória está ligando a posição da tabela onde o resto do dado está.

[15:53] A gente tem que entender um pouquinho o seguinte, que tanto o HASH, quanto o BTREE, eles são algoritmos de buscas, cada um tem o seu conceito deferente de trabalhar e que o MySQL suporta esses dois algoritmos internamente, porém apenas se for MyISAM.

[16:12] Se a gente tiver um banco InnoDB, apenas o HASH vai funcionar direito. Então é isso aí. Valeu.

## USANDO ÍNDICES

Transcrição

[00:00] Agora, você vê que essa aula eu comecei falando de EXPLAIN, para a gente entender o plano de execução e como é que a gente consegue ver o custo de uma query, depois eu pulei de assunto e falei de índice, como é que funciona o índice, quais são os algoritmos de busca.

[00:22] Agora, eu vou juntar as duas coisas, porque acontece muito o seguinte, o índice é um dos principais instrumentos para a gente melhorar o custo das queries, quer ver? Vamos fazer um exemplo prático para ilustrar isso. Então, voltei aqui para o meu ambiente do meu MySQL em linha de comando e eu vou fazer o seguinte.

[00:46] Eu vou pegar a seguinte consulta: "SELECT * FROM Notas_Fiscais WHERE Data_Venda = 20170101", deixa eu até selecionar essa linha, vou dar um "Ctrl + C", porque eu vou usar esse comando várias vezes, então vamos lá, eu vou rodar.

[01:19] Eu trouxe lá uma série de linhas, todas elas são notas fiscais para o dia 27/01. Claro que internamente, o MySQL fez um plano de execução e executou a query, vamos ver como é que foi o custo dessa query? Se eu der um "EXPLAIN FORMAT = JSON", colocar o "\G", note que o custo da query foi 8849.05.

[02:06] Eu vou até aqui abrir um editor de texto e vou guardar isso daqui, essa query, ela custou para mim: 8849.05, eu vou até manter esse editor aberto e tudo que é comando que eu for executar, eu vou salvar aqui, para depois salvar esse arquivo e vocês terem como material para usar como complemento do curso.

[02:44] Então eu rodei o EXPLAIN, "FORMAT = JSON" e query. Aí, nós vamos fazer o seguinte, nós vamos criar um índice, como é que eu crio um índice? Eu coloco o comando: "ALTER TABLE" o nome da tabela, "Notas_Fiscais ADD INDEX(Data_Venda)". [03:23] Por que que eu estou criando um índice para data_venda? Porque era o seguinte, aqui na minha consulta, note que a minha condição de filtro, que é WHERE, eu tenho que buscar na tabela, registros cuja a data da venda é 01 de janeiro de 2017.

[03:47] Se eu tiver um índice pela data da venda, pelo campo data da venda, esse WHERE vai ser muito mais eficiente, porque invés de eu percorrer a tabela toda, eu vou lá no índice, acho aquela posição através do BTREE ou do HASH e pegando esse cara, se for MyISAM, eu vou pegar a posição dos registros que aquele cara pertence ou se for InnoDB, a posição da primary key da tabela_notas_fiscais.

[04:24] E aí, eu consigo buscar as linhas da tabela que respeitam essa condição, por isso que, teoricamente, criar o índice vai funcionar, vai deixara query mais rápida, é o que vamos tentar ver se o plano de execução me mostra isso. Então, eu rodei esse comando aqui, o ALTER TABLE, vou executá-lo aqui.

[05:04] Então, pronto, o índice foi criado, vamos rodar agora o EXPLAIN novamente? Vou rodar de novo o EXPLAIN. Vamos ver o custo da query? Olha só o custo da query, caiu para 60.28, ou seja, depois que eu rodo a criação do índice, o custo da query caiu para 60.28, olha com o que o custo melhorou.

[05:48] Para a gente ter certeza que realmente isso ajudou, note que... No Caso da consulta, onde o índice não havia sido criado, a gente tem aqui uma informação que é a seguinte: eu não tenho aqui... Eu tenho esse access_type = all, significa que ele vai acessar a tabela toda.

[06:29] E eu não tenho uma informação aqui chamada key, porque ele não achou pelo critério que eu coloquei, que é WHERE, nenhuma chave que me ajude a achar aquela informação. Agora, já no JSON que a gente rodou com o índice, o access_type, mudou a ser ref e ele achou aqui uma chave possível data da venda e achou o índice aqui.

[07:07] Esse aqui data_venda, é o índice que eu criei, então ele achou esse índice e falou: "Opa, eu vou usar esse índice porque é melhor do que eu não usar nada", enquanto que aqui em cima, ele não usou nenhuma chave, porque ele não encontrou.

[07:27] Para a gente ver que realmente o índice está fazendo diferença, a gente pode, depois que criar o índice, a gente pode apagar esse índice, é: "ALTER TABLE Notas_Fiscais DROP INDEX Data_Venda". Eu agora, apaguei o índice, o índice não mais existe, o que acontece então se a gente rodar o EXPLAIN de novo?

[08:17] Vou tirar aqui o espaço e aqui, vou no final, colocar o "\G". Pronto, agora melhorou. Note que o custo voltou ao valor 8994.33, "Puxa, mas o numero, está diferente daqui", na verdade esse custo da query é variável. Talvez vocês executando aí na máquina de vocês, vocês vão encontrar números diferentes.

[09:08] Isso, como eu falei, também depende muito da memória, do hardware que você está usando e assim por diante, mas o importante é que os dois são muito maiores do que 60.28, isso mostra o quanto que um índice, ele ajuda na resolução desse... de melhorar a consulta.

[09:32] Então, imagina que eu tenho um relatório, um relatório num sistema e o usuário fica reclamando: "Olha, eu rodo esse relatório aqui, demora séculos", as vezes você criando um índice, vai fazer com que o relatório fique rápido. É o caso aqui em cima.

[09:52] Então tá, é isso que eu queria falar com vocês. Misturando um pouco agora a análise do plano de execução da query, com o índice para ver como é que ela melhora, quando você consegue adicionar os índices corretos. Valeu.

## FERRAMENTA MYSQLSLAP

Transcrição

[00:00] Antes de terminar a performance, eu gostaria de falar de uma ferramenta que já vem no MySQL chamado: mysqlslap, o que que essa ferramenta faz?

[00:12] Ela simula acessos concorrentes a uma determinada consulta, assim, a gente aqui está vendo o custo da consulta, mas a gente consegue simular no MySQL... criar uma simulação, onde eu estou dizendo: "Vamos ver o que acontece se 100 usuários ao mesmo tempo, fazem 10 consultas nesta base, usando a consulta tal".

[00:45] E aí, a gente pode usar ela com índice e ela sem índice e ver o resultado. Vamos começar, vamos pegar... vou criar aqui um script novo no Workbench, vamos pegar aquela consulta, "SELECT * FROM Notas_Fiscais WHERE Data_Venda = 20170101".

[01:25] A gente executou, se a gente olhar o plano de execução dela, a gente tem lá um Full Scan, porque não estou usando índice, lembra? Se a gente criar aqui "ALTER TABLE Notas_Fiscais ADD INDEX(Data_Venda)", então eu estou aqui criando um índice.

[01:59] E aí, agora, com o índice, se eu executo de novo a consulta no Execution Plan, note que ele ficou aqui verde, porque ele conseguiu usar o índice para poder fazer aquela busca da data específica, então a consulta ficou muito mais rápida, mas vamos simulas o acesso de várias usuários concorrentes a essa consulta.

[02:29] A gente vai comparar ela com essa daqui, com aquele 2, lembra? A tabela 1, 2, é uma tabela sem backup, sem FK e é claro, sem esse índice, porque o índice, eu criei na tabela normal, então vamos executar ela aqui. O custo original aqui deu 63.10, se eu executar consulta na tabela 2.

[03:02] Vamos olhar aqui o Execution Plan, deu um valor de 8.831.73, quer dizer, ficou bem mais pesada a consulta, mas vamos ver o resultado disso num sqlslap. Então, para isso, eu vou voltar lá para o prompt do comando do Windows, no diretório Program Files, MySQL Server 8.0 bin e vou digitar mysqlslap -uroot -p.

[03:49] E aí, é o seguinte, eu vou entrar com dois parâmetros, um parâmetro é numero de interações e o outro parâmetro é numero de acesso concorrentes. Então, eu vou colocar aqui: concurrency, eu vou colocar 100, 100 acessos concorrentes, fazendo, iterations 10.

[04:39] Então aqui, eu estou dizendo: 100 acessos concorrentes, 10 interações, aonde? No create... espera aí, que eu estou... iterations, vamos lá para o final... create_schema, aí é o meu schema que eu estou usando, sucos_vendas e "query=" e entre aspas duplas, eu vou colocar aquela nossa consulta.

[05:24] Eu vou pegar primeiro a consulta com PK, com FK e com índice. Então, vamos ver se o comando ficou certo, ficou assim: "mysqlslap -uroot -p --concurrency = 100 --iterations=10 --create-schema, o nome do esquema, -query SELECT FROM Notas_Fiscais WHERE Data_Venda", tem a minha data da venda.

[06:06] Vamos rodar. Vou entrar com a senha. Vamos esperar. Está lá, ele fez a minha simulação e note, em média, essa query vai retornar em 0.54 segundos o seu resultado, nas simulações, o maior tempo foi 1.28 e o menor tempo 0.23 segundos.

[06:40] Agora, vou repetir o comando, só que agora, eu vou botar o 2, coloquei aqui o 2, para eu simular a outra tabela que não tem PK, não tem FK e não tem índice o data venda. Lembrando que o conteúdo das duas tabelas é o mesmo, porque uma foi fonte da outra.

[07:05] Então, eu vou rodar. Entrei com a senha. Eu não sei se deu para sentir, mas inclusive, visualmente o tempo está maior, está demorando mais tempo para fazer a simulação. Terminou.

[07:24] Note que o tempo médio foi de 0.54, para 2.6, o maior tempo que era 1.28, foi 3.44 e o menor tempo aqui foi 2.31, ou seja, o menor tempo na tabela que não tem chave primária, nem estrangeira, nem índice, o menor tempo ainda foi maior do que o maior tempo com os índices.

[08:02] Então, esse comando também é um comando muito legal para você testar, então, vale a pena você estar sempre usando o EXPLAIN para ver o custo da query e o mysqlslap para calcular o tempo. E aí, depois que a gente falou disso tudo, vem aquela pergunta: "Se eu acho uma query lenta, o que eu preciso fazer para que essa query fique rápida?".

[08:34] Existem dezenas de procedimentos que podem ser feitos para a query melhorar, eu vou falar só de depois específicos. Primeiro, vamos pegar aquela query mais rebuscada, ela está aqui... A primeira coisa interessante, quando você tiver JOIN, que você garanta que haja índices nessas igualdades aqui.

[09:25] Claro que normalmente os JOINs são feitos pelas PKs, então se a tabela não tem PK, cria PK, mesmo assim, se você fizer um JOIN com alguém que não tem índice, você cria o índice. Então, por exemplo, o código do produto, ele é índice na tabela de produtor e ele é índice na tabela de itens notas fiscais também, porque faz parte da PK.

[09:50] O numero a mesma coisa, mas digamos que tivesse fazendo um JOIN com data ou tivesse fazendo JOIN com um atributo da tabela que não é chave. Então é interessante você criar um índice para ela.

[10:09] Outra dica importante é quando a gente fez essa ultima consulta, de quando eu tiver um WHERE, principalmente queries de igualdades, menor, maior, between, like, de também ter índice nesse campo que você utiliza para fazer o critério de filtro.

[10:40] Então, assim, existem várias outras coisas que podem ser feitas para a query ficar mais rápidas, mas seguindo esses dois pontos, você já vai ter grandes ganhos. Índices nas igualdades dos JOINs e índice nos filtros de consulta, se você conseguir fazer isso, você vai conseguir um ganho enorme, em termos de resultados das suas consultas.

[11:10] É isso aí. Valeu, um abraço.