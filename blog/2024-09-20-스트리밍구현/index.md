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

1. CCTV에서 제공하는 HLS를 직접 사용했던 방법
2. `RTSP` 를 받아 HLS로 변환했던 방법
3. 이외의 선택 가능했던 방법

### 첫번째 시도 : CCTV 제공 기능 파악

이전에 구축한 대시보드에도 CCTV가 연동되어있지만, Live로 영상을 스트리밍 하는방식이 아닌 1~3초 단위로 스냅샷을 `Polling`하는 구조로 구성이 되어있었다. 이전 방식에서는 간단하게 현장에 CCTV 네트워크에 `NVR`을 구축하고 해당 `NVR`의 스냅샷기능을 사용해서 이미지를 불러오고 있었다. 하지만 이번엔 이미지가 아닌 영상이 필요하기 때문에 해당 방식으로 진행이 불가능 하였다.  

다양한 방법을 찾아보다 간단한 방법을 발견했다. 가장 먼저 떠오른 접근 방식은 CCTV 장비에서 직접 제공하는 HLS 기능을 사용하는 방식이었다. 현장이 미국에 있고 PoC로 진행하다보니 현장 정보에 대해 제한된 부분이 많은 어려움이 있었지만 CCTV 자체에 Export하는 API를 지원함을 알아낼수있었다. `CCTV ID`, `Mac` 등을 통해 영상을 추출해낼수있는 방법이다. CCTV에 직접 요청하여 프론트로 중계하는 서버를 만들면 문제는 해결될것으로 보였다.

#### 구현
```java
@RestController  
@RequestMapping("/proxy/v1")
@RequiredArgsConstructor  
public class ProxyController {  
  
    private final WebClient webClient;  
  
    @GetMapping("/{cctvName}/master.m3u8")  
    public Mono<ResponseEntity<String>> getM3u8Hill(@RequestParam("entry") String entry) {  

		// Key값 갱신로직
			
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



https://velog.io/@penrose_15/Data%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B3%A0%EC%B0%B0