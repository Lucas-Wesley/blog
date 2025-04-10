---
title: "Processo de Boot: Do Botão de Ligar ao Sistema Operacional"
date: "2023-11-12"
status: "draft"
description: "Uma explicação detalhada do processo de inicialização de um computador, desde o momento em que você aperta o botão de ligar até o sistema operacional estar pronto para uso"
category: "Sistemas Operacionais"
---

# Processo de Boot

Uma coisa que eu nunca mencionei por exemplo é o processo de boot em si, que é bem fascinante. Em hiper resumo, tem diversas etapas, do momento que você aperta o botão de ligar, segue o processo de Power on self test ou POST que você vai ouvir falar bastante se acompanha canais de montar seu computador, tem o teste de memória e outros dispositivos, até chegar no Master Boot Record que é o antigo MBR ou o atual GUID Partition Table ou GPT pra carregar o boot loader, que no caso do Linux seria um GRUB2 por exemplo, e finalmente carregar o binário do Kernel propriamente dito que, por sua vez, vai carregar um systemd, que por sua vez finalmente vai carregar todos os daemons pra terminar de tornar disponível os recursos da máquina pros programas, como montar suas partições do disco. Se você está estudando Linux, veja os links que deixei na descrição abaixo que detalham esse processo em mais detalhes.