---
slug: 스트리밍 구현에서 만났던 문제
title: Getter / Setter 알고쓰고있나요?
authors:
  - haeyoung
tags:
  - Java
  - ffmpeg
---
이번 LPR 기반의 대시보드 구현 프로젝트를 진행하면서 대시보드에 CCTV 영상을 Live로 송출해야하는 요구사항이 있었다. 하지만 문제는 `RTSP` 프로토콜을 통해 제공되는 CCTV 영상이 브라우저에서 직접 재생되지 않아 다양한 접근 방식을 고민했었고, 이에대한 해결책을 기록하고자 작성하였다.

이글에서는 
1. CCTV에서 제공하는 HLS를 직접 사용했던 방법
2. `RTSP` 


https://velog.io/@penrose_15/Data%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B3%A0%EC%B0%B0