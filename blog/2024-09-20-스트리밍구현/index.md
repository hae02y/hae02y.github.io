---
slug: 스트리밍 구현에서 만났던 문제
title: Getter / Setter 알고쓰고있나요?
authors:
  - haeyoung
tags:
  - Java
  - ffmpeg
---
회사에서 LPR 기반의 대시보드 구현 PoC를 진행하면서 대시보드에 CCTV 영상을 Live로 송출해야하는 요구사항이 있었다. 하지만 문제는 `RTSP` 프로토콜을 통해 제공되는 CCTV 영상이 브라우저에서 직접 재생되지 않아 다양한 접근 방식을 고민했었고, 이에대한 해결책을 기록하고자 작성하였다.

이글에서는 아래 내용을 다루고자 한다.

1. NVR에서 제공하는 HLS를 직접 사용하는 방법
2. `RTSP` 를 받아 HLS로 변환하는 방법
3. 이외의 선택 가능했던 방법

### 첫번째 시도

이전에 구축한 대시보드에도 CCTV가 연동되어있지만, Live로 영상을 스트리밍 하는방식이 아닌 1~3초 단위로 스냅샷을 `Polling`하는 구조로 구성이 되어있었다. 이 방식에서는 현장에 CCTV 네트워크에 간단한 소프트웨어 기반 `NVR`을 구축하고 해당 `NVR`의 스냅샷 기능을 사용해서 이미지를 불러오는 방식으로 구축해 놓았다. 하지만 이번엔 현장에 소프트웨어기반 `NVR`구축이 불가능하고, 이미지가 아닌 영상이 필요하기 때문에 해당 방식으로 진행이 불가능 하였다.

다양한 방법을 찾아보다 간단한 방법을 발견했다. 가장 먼저 떠오른 접근 방식은 현장 CCTV 관리 프로그램, NVR에서 직접 제공하는 HLS API를 사용하는 방식이었다. 현장이 미국에 있고 PoC로 진행하다보니 현장 정보에 대해 제한된 부분이 많은 어려움이 있었지만 Export하는 API를 지원함을 알아낼수있었다. `CCTV ID`, `Mac` 등을 통해 `Key`를 발급받고 영상을 추출해낼수있는 방법이다. 이방식을 통해 프론트엔드에서 `hls.js` 와같은 라이브러리를 통해 진행을 하면 된다. 간단하게 flow chart를 그려보면 아래와 같다.

![](screen1.png)
하지만 CCTV/NVR과 Frontend 사이에 도메인이 다르다보니 `CORS`가 발생하게 되고, `AuthKey`를 프론트에서 직접 요청하는 과정에서 보안적인 위험도 발생할수있었다. 또한 사용자에게 `URL`이 직접적으로 노출되어 문제가 발생할수있었고, 이를 위해 프록시 서버를 구축하는 방법을 고려하였다.


#### Proxy 구현 코드
```java
@RestController  
@RequestMapping("/proxy/v1")
@RequiredArgsConstructor  
public class ProxyController {  
  
    private final WebClient webClient;  
  
    @GetMapping("/{cctvName}/master.m3u8")  
    public Mono<ResponseEntity<String>> getM3u8Hill(@RequestParam("entry") String entry, @PathVariable String cctvName) {  

		// Header용 Key값 갱신로직
		...
			
        return webClient.get()  
                .uri(...)  
                .header(...)
                .retrieve()  
                .bodyToMono(String.class)  
                .map(response -> {  
                    HttpHeaders headers = new HttpHeaders();  
                    headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.apple.mpegurl");  
                    return new ResponseEntity<>(response, headers,HttpStatus.OK);  
                });  
    }  
}
```

프론트에서 `entry` : 현재시간, `cctvName` 을 받아 위에 구현한 Proxy서버가 CCTV로 직접 요청을 보내 Header에 사용되는 key를 갱신하고, 해당 key로 다시한번 HLS를 위한 데이터를 API로 요청해 프론트에 넘겨 주는 방법으로 구현하였다.


이방식으로 동작이 가능하도록 구현은 하였지만 문제가 발생하였다. 클라이언트가 늘어날때마다 CCTV에 부하를 주는 상황이 발생했는데 임베디드에 구현된 API


https://velog.io/@penrose_15/Data%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B3%A0%EC%B0%B0