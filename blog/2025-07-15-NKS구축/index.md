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
7. Bastion Host 구축
8. KubeCtl 설치 

### NCP 및 서버 설정

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

사용중인 레포지토리는 `Bitbucket` 인데, `Pipeline`이라는 좋은 기능을 제공한다. Github Action 처럼 Bitbucket 자체에 내장되어 `CI/CD`를 간편하게 해줄수있는 도구이다. 이를 통해 구축 하려고 하는 방식은 다음과 같다.
![](screen4.png)


### Bitbucket 설정

`CI/CD`를 적용할 레포지토리에 해당 `yml`을 세팅한다.

#### kube-deploy.yml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: ansan-daemin-api
spec:
  selector:
    app: ansan-daemin-api
  type: NodePort
  ports:
    - port: 80
      targetPort: 7070
      nodePort: 30082
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ansan-daemin-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ansan-daemin-api
  template:
    metadata:
      labels:
        app: ansan-daemin-api
    spec:
      imagePullSecrets:
        - name: registry
      containers:
        - name: ansan-daemin-api
          image: {{image}}
          ports:
            - containerPort: 7070
          volumeMounts:
            - name: cdn-volume
              mountPath: /mnt/nas/ansan-daemin/cdn
      volumes:
        - name: cdn-volume
          persistentVolumeClaim:
            claimName: ansan-daemin-nas-pvc
```
`kube-deploy.yml`은 관리의 편의성과 안정성을 위해서 필요하다. 만약 해당 `yml`파일이 없더라도

```bash
kubectl set image deployment/ansan-daemin-api ansan-daemin-api=이미지명
```

위의 CLI 명령어를 통해서 배포하는것도 가능하지만, 이렇게 하면 전체 Deployment에 대한 정의가 코드로 남지 않는다. `kube-deploy.yml`을 만듦으로써, 클러스터 초기화 / 재배포 상황에서 사용이 가능하고, 다른 환경을 구성 하더라도 재사용이 가능하다. 그리고 `kubectl` apply 를 통해 선언적으로 배포가 가능해진다.

#### bitbucket.yml
```yaml

```


### Ref.
- [NCP 가이드](https://guide.ncloud-docs.com/docs/k8s-k8sprep)
- 