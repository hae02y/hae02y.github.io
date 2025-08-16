---
slug: nodered-ntfy
title: Nodered와 Ntfy로 알림 기능을 뚝딱 해보자
authors:
  - haeyoung
tags:
  - Nodered
  - Ntfy
  - Alert
---
기존에 구축되어있던 레거시 프로젝트에 알림기능 추가가 필요하였다. 하지만 여러가지 이유로 일정이 정말 촉박했고, PHP로 구축된 Backend 서버를 직접 다룰수가 없는 상황 등으로 NodeRed, Ntfy를 통해 알림기능을 뚝딱 도입했던 경험을 작성해보려고 한다.

### 도입 이유

레거시 서버의 경우 Proxmox로 컨테이너화 되어있으며, LAMP 스택으로 PHP로 구성되어있고, Apache로 대시보드 정적 페이지를 서빙하고 있는 구조다. 이를 간단히 그려보면 아래 이미지와 같다.
![](screen1.png)

알림 기능을 구현하는 방법은 여러가지가 있다. 만약 `LAMP` 가 아닌 Java, Springboot 기반의 서버였다면 알림서버를 구현하여 소켓과 같은 방법으로 구현을 진행했겠지만 현재 구조를 깨뜨릴수가 없는 상황에서 