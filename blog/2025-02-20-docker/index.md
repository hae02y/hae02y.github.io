---
slug: infra
title: NCP 클라우드 구축
authors:
  - haeyoung
tags:
  - infra
  - docker
  - cloud
  - ncp
---


## 도커 설치

### Ubuntu에서 Docker 설치하기

#### 1. 필요한 패키지 설치

먼저, `apt` 패키지 관리자를 사용하여 Docker를 설치하기 위한 필수 패키지들을 설치합니다. 이 패키지들은 Docker 설치 과정에서 HTTPS를 통한 패키지 다운로드를 가능하게 합니다.

```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
```

#### 2. Docker의 공식 GPG 키 추가

Docker 패키지의 무결성을 검증하기 위해 Docker의 공식 GPG 키를 시스템에 추가합니다.

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

#### 3. Docker 리포지토리 추가

시스템의 패키지 관리 시스템에 Docker 리포지토리를 추가합니다. 이를 통해 Docker의 최신 버전을 설치하고 관리할 수 있습니다.

```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

#### 4. Docker CE(Community Edition) 설치

리포지토리를 추가한 후, Docker Community Edition(CE)을 설치합니다.

```bash
sudo apt-get update
sudo apt-get install docker-ce
```

#### 5. 도커 서비스 시작 및 자동 실행 활성화

도커가 설치된 후, 도커 서비스를 시작하고 부팅 시 자동으로 실행되도록 설정합니다.

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

#### 6. 사용자 그룹에 도커 추가

기본적으로, Docker를 사용하기 위해서는 `sudo` 명령을 사용해야 합니다. 사용자를 `docker` 그룹에 추가하여 `sudo` 없이 도커 명령을 실행할 수 있도록 설정할 수 있습니다.

```bash
sudo usermod -aG docker ${USER}
```

이 명령을 실행한 후에는 로그아웃하고 다시 로그인하여 그룹 변경 사항을 적용해야 합니다.

### 확인

도커가 정상적으로 설치되었는지 확인하기 위해 다음 명령을 실행할 수 있습니다.

```bash
docker --version
```

또는 간단한 Hello World 이미지를 실행하여 도커가 올바르게 작동하는지 테스트할 수 있습니다.

```bash
docker run hello-world
```

이 명령은 Docker Hub에서 Hello World 이미지를 다운로드하고 컨테이너에서 실행하여 테스트 메시지를 출력합니다. 이 메시지가 보이면 Docker가 정상적으로 설치되고 작동하는 것입니다.

이제 서버에 Docker가 설치되었으므로, 앞서 설명한 Bitbucket Pipelines를 통해 Docker 이미지를 배포할 수 있습니다.