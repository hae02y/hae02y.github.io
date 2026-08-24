---
slug: ade
title: IDE 다음은 ADE - Orca, Paseo, cmux 정리
authors:
  - haeyoung
tags:
  - AI
  - Agent
  - DevTools
---
코딩 에이전트를 한 개만 돌릴 때는 편집기 안에 채팅창 하나 붙어있으면 충분했다. 그런데 에이전트를 두세 개씩 동시에 돌리기 시작하면서부터 이야기가 달라졌다. 어떤 놈이 지금 뭘 하고 있는지, 누가 내 답변을 기다리는지, 결과물 세 개 중에 뭐가 제일 나은지를 편집기 UI로는 도저히 관리할 수가 없다. 이 지점에서 나온 개념이 `ADE(Agentic Development Environment)`다. 최근에 자주 언급되는 `Orca`, `Paseo`, `cmux` 세 가지를 정리해봤다.

### IDE와 ADE는 뭐가 다른가

한 줄로 정리하면 **오케스트레이션의 주체가 누구냐**의 차이다.

- **IDE(+AI)**: 개발자가 편집기 안에서 파일을 열고, 커서를 놓고, 에이전트에게 한 단계씩 시킨다. 조율의 주체는 사람이고 에이전트는 자동완성의 확장이다.
- **ADE**: 목표를 던지면 에이전트가 알아서 쪼개고 실행한다. 사람이 하는 일은 코드를 치는 게 아니라 **작업을 배분하고, 결과를 비교하고, 골라서 머지하는 것**이다.

그래서 ADE의 UI에는 자동완성 대신 이런 게 들어간다.

| 요소 | 왜 필요한가 |
|------|------------|
| 격리된 실행 환경 | 에이전트 여러 개가 같은 워킹 디렉토리를 건드리면 서로 파일을 덮어쓴다 |
| 병렬 워크스트림 | 같은 문제를 여러 에이전트에게 동시에 시키고 비교하려면 3개 이상은 돌아가야 한다 |
| diff 중심 리뷰 | 코드를 쓰는 시간보다 읽고 고르는 시간이 길어진다 |
| 알림/상태 관측 | 어떤 세션이 승인 대기 중인지 모르면 에이전트가 놀고 있어도 알 수가 없다 |
| 세션 영속성 | 앱을 껐다 켜도 워크스페이스와 스크롤백이 살아있어야 한다 |

세 도구 모두 격리 수단으로 **git worktree**를 쓴다. 브랜치별로 별도 디렉토리를 만들어주는 그 기능인데, 에이전트마다 독립된 worktree를 파주면 서로 충돌 없이 같은 저장소를 동시에 만질 수 있다. 이 오래된 git 기능이 요즘 갑자기 각광받는 게 재밌는 부분이다.

```bash
# ADE들이 내부적으로 하는 일의 본질
git worktree add .orca/worktrees/feature-a -b agent/feature-a
git worktree add .orca/worktrees/feature-b -b agent/feature-b
```

### Orca - 데스크톱에서 결과를 비교하는 쪽

`stablyai/orca`. 지금 ADE라는 단어를 가장 적극적으로 밀고 있는 도구다. 라이선스는 MIT.

핵심 워크플로우는 **fan-out**이다. 프롬프트 하나를 여러 에이전트에 동시에 던지고, 각자 독립 worktree에서 작업하게 한 뒤, 나온 diff를 나란히 놓고 좋은 것만 골라서 머지한다. 같은 문제에 대한 해법 다섯 개를 뽑아놓고 고르는 방식이라, "한 번에 제대로 나올 때까지 다시 시키기"보다 시행착오 비용이 낮다.

구조적으로 눈에 띄는 부분:

- **터미널**: Ghostty 기반, GPU 렌더링에 무한 스플릿
- **Design Mode**: 내장 Chromium에서 UI 요소를 직접 클릭하면 해당 HTML/CSS와 스크린샷이 프롬프트로 들어간다. 프론트엔드 수정 시 "이 버튼 말이야"를 말로 설명할 필요가 없어진다
- **diff 인라인 코멘트**: 사람이 코드리뷰 남기듯 에이전트 결과물에 코멘트를 달고 그대로 피드백으로 보낸다
- **SSH worktree**: 원격 서버에서 에이전트를 돌린다
- **계정/쿼터 관리**: Claude, Codex 사용량을 추적하고 계정을 핫스왑한다
- **GitHub/Linear 연동**과 모바일 컴패니언 앱

CLI(`orca worktree create`, `snapshot`, `click`, `fill`)와 `--json` 출력이 있어서 스크립트로 자동화하기도 좋다. macOS, Windows, Linux 모두 지원한다.

```bash
brew install --cask stablyai/orca/orca
```

### Paseo - 어디서든 에이전트를 굴리는 쪽

`getpaseo/paseo`. 라이선스는 AGPL-3.0. Orca가 "책상에서 검토하는 도구"라면 Paseo는 **"자리를 떠서도 계속 돌리는 도구"**에 가깝다.

구조가 명확하게 daemon-client다.

- `packages/server` - 에이전트 프로세스 오케스트레이션, WebSocket API, MCP 서버 관리
- `packages/app` - Expo 기반 iOS/Android/웹 클라이언트
- `packages/desktop` - Electron 데스크톱 앱
- `packages/cli` - 터미널 인터페이스
- `packages/relay` - 원격 연결

즉 개발 머신이나 서버에 데몬을 띄워두고, 폰이든 웹이든 CLI든 아무 데서나 붙어서 상태를 보고 지시를 내린다. Claude Code, Codex, Copilot, OpenCode, Pi를 한 인터페이스에서 다룬다. 셀프 호스팅이고 텔레메트리나 강제 로그인이 없다는 점을 전면에 내세운다.

특히 `/paseo-handoff`, `/paseo-loop` 같은 스킬로 **에이전트가 다른 에이전트에게 작업을 넘기는** 흐름을 만들 수 있다. 코디네이터 에이전트가 워커를 만들어 굴리는 구조라, 자동화 파이프라인에 가깝게 쓸 수 있다. 음성 제어도 지원한다.

```bash
npm install -g @getpaseo/cli && paseo
# 또는
docker run -d --name paseo -p 6767:6767 ghcr.io/getpaseo/paseo:latest
```

Docker 이미지가 있다는 게 포인트다. 서버에 올려두고 장시간 돌리는 시나리오를 정면으로 겨냥한다.

### cmux - 터미널 그 자체를 갈아끼우는 쪽

`manaflow-ai/cmux`. macOS 전용, Swift/AppKit 네이티브, GPL-3.0-or-later. 앞의 둘과 결이 다르다. Electron 앱이 아니라 **터미널 애플리케이션**이다. Ghostty의 포크는 아니고, libghostty를 렌더링 라이브러리로 가져다 쓴다.

가장 잘 만들었다고 느낀 부분은 알림이다. 에이전트가 승인이나 답변을 기다리면 창에 파란 링이 뜨고 해당 탭이 강조된다. 터미널 이스케이프 시퀀스(OSC 9/99/777)를 인식하는 방식이라 특정 에이전트에 종속되지 않고, `cmux notify`로 직접 쏠 수도 있다. `Cmd+Shift+U`로 안 읽은 세션으로 바로 점프한다.

- 수직/수평 탭에 git 브랜치, PR 상태, 포트, 최근 알림이 함께 표시
- 내장 브라우저를 스크립트 API로 조작(DOM 클릭, 폼 입력, JS 실행)
- SSH 워크스페이스, 세션 레이아웃/스크롤백 복구
- CLI/소켓 API로 워크스페이스와 분할창 자동화

Electron 부담이 없어서 메모리가 가볍고 기존 Ghostty 설정을 그대로 상속한다. 대신 macOS 전용이다(iOS 베타는 TestFlight로 제공 중).

```bash
brew tap manaflow-ai/cmux && brew install --cask cmux
```

### 정리

| | Orca | Paseo | cmux |
|---|---|---|---|
| 성격 | 데스크톱 ADE | 셀프 호스팅 오케스트레이터 | 에이전트용 터미널 |
| 기술 스택 | Electron + Ghostty + Chromium | Node 서버 + Expo/Electron | Swift/AppKit + libghostty |
| 플랫폼 | macOS/Win/Linux/모바일 | 데스크톱/웹/모바일/CLI/Docker | macOS(+iOS 베타) |
| 라이선스 | MIT | AGPL-3.0 | GPL-3.0-or-later |
| 격리 | worktree + diff 비교 | 원격 세션/워커 | 워크스페이스 탭 |
| 강점 | 여러 해법 비교, UI 디버깅 | 원격/모바일, 자동화, 서버 상주 | 알림 관제, 가벼움 |

선택 기준은 결국 **내가 어디서 뭘 하고 있느냐**로 갈린다.

- 책상에 앉아 여러 결과물을 diff로 놓고 고르는 게 주 업무 → Orca
- 서버에 띄워두고 이동 중에도 확인하거나, 에이전트끼리 넘겨가며 자동화 → Paseo
- macOS에서 터미널로만 살고 있고 "누가 나를 기다리는지"만 알면 됨 → cmux

Orca + cmux처럼 병행해서 쓰는 조합도 이상하지 않다. 셋 다 하는 일의 본질은 같다. **worktree로 격리하고, 상태를 보여주고, diff를 고르게 해주는 것.**

다만 도구를 바꾼다고 문제가 사라지진 않는다. 에이전트를 다섯 개 돌리면 리뷰해야 할 diff도 다섯 배가 되고, 토큰 소모도 그만큼 늘어난다. 병렬로 굴리는 게 이득이 되는 건 "검증이 자동화되어 있을 때"다. 테스트와 린트가 없는 저장소에서 에이전트를 병렬로 돌리면, 결국 사람이 다섯 배의 코드를 눈으로 읽어야 한다. ADE를 도입하기 전에 CI부터 챙기는 게 순서인 이유다.

### 참고

- [stablyai/orca](https://github.com/stablyai/orca)
- [getpaseo/paseo](https://github.com/getpaseo/paseo)
- [manaflow-ai/cmux](https://github.com/manaflow-ai/cmux)
- [Agentic IDE vs Agentic Development Environment - Augment Code](https://www.augmentcode.com/guides/agentic-ide-vs-agentic-development-environment)
- [awesome-agent-orchestrators](https://github.com/andyrewlee/awesome-agent-orchestrators)
