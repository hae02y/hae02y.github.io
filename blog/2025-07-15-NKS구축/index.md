---
slug: nks
title: NKS를 구축해보아요.
authors:
  - haeyoung
tags:
  - Kubernetes
  - API
  - NCP
  - Infra
---

### 구축 순서

1. VPC 준비
2. Subnet 생성
3. NKS클러스터 생성
4. 노드풀 생성
5. 도메인 및 LB 설정
6. 관리용 시스템 생성
7. KubeCtl 설치 

### 설정

#### VPC 준비
VPC 및 서브넷을 생성한다.

![](screen2.png)


![](screen1.png)


#### KubeCtl 설치

이번에 구축한 서버의 경우 `X86-64` 이고, 혹시 ARM 기반 으로 구축을 하는경우 아래 링크를 참고하자.

- [kubectl 구축](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#installusingnativepackagemanagement)

1. 최신 릴리스 다운로드
```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

2. 바이너리 검증
```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
```
    
```bash
echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
```

명령어를 통해 정상 출력시 아래와 같은 내용이 표출 된다.

![정상 출력](screen3.png)


3. kubectl 설치
```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

4. 설치된 버전 확인
```bash
kubectl version --client
```


### 파이프 라인

사용중인 레포지토리는 `Bitbucket` 인데, `Pipeline`이라는 좋은 기능 구축 하려고 하는 방식은 다음과 같다.
![](screen4.png)


### Ref.
- [NCP 가이드](https://guide.ncloud-docs.com/docs/k8s-k8sprep)
- 