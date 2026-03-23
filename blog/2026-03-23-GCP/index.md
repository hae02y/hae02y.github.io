---
slug: gcp
title: 제목
authors:
  - haeyoung
tags:
---

GCP계층 구조

Organization 
- 조직의 최상위 단위. 하나의 도메인을 기반으로 생성
- 도메인 소유권 증명하면 GCP Console에 조직 생성
- IAM, Billing, 정책 관리 기준점

Folder
- 부서, 서비스, 환경별로 구분하여 프로젝트를 정리할수있는 중간 단위
- 계층적 구조 - 상속 기반 IAM/정책 적용 가능

Project
- 리소스 생성, 운영의 기본 단위. VM, Storage, GKE 등이 프로젝트 하위에 존재
- 결제도 이단위에서 연결됨

Resource
- 실질적인 사용자원
- 반드시 하나의 프로젝트에 소속