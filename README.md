# ASCII SOFT Redmine Theme

Redmine 7.0.x용 테마입니다. 상단 바, 프로젝트 헤더, 요청 목록, 배지, 토스트, 화면 모드(라이트·그레이·다크·파스텔 6색)를 제공합니다.

알림·프로젝트 헤더 설정·통계·용어 변경은 플러그인이 있어야 동작합니다.
플러그인: https://github.com/asciisoft/asciisoft-redmine-plugin

## 설치

폴더 이름은 반드시 `asciisoft`로 받습니다.

```bash
sudo -u redmine -i
cd $REDMINE        # 레드마인 설치 폴더

git clone https://github.com/asciisoft/asciisoft-redmine-theme.git themes/asciisoft

# 에셋 컴파일은 선택입니다. 운영 모드에서는 레드마인이 시작될 때 자동으로 컴파일합니다.
# bin/rails assets:precompile RAILS_ENV=production

sudo systemctl restart redmine   # Docker는 위 안내처럼 docker restart
```

`$REDMINE`은 `Gemfile`과 `bin/rails`가 있는 레드마인 루트 폴더입니다. `bin/rails: No such file or directory`가 나오면 `find /srv/redmine -maxdepth 3 -name Gemfile`로 위치를 확인하세요.

관리 > 설정 > 표시 > 테마에서 **Asciisoft**를 선택합니다.
모듈별 등록 버튼을 쓰려면 같은 화면의 **새 개체 메뉴**를 "+ 드롭다운 표시"로 설정하세요.

비공개 저장소는 GitHub 계정과 Personal Access Token(읽기 권한)이 필요합니다.
SSH를 쓰려면 `git@github.com:asciisoft/asciisoft-redmine-theme.git` 주소와 Deploy key(읽기 전용)를 사용합니다.

## Docker로 운영하는 경우

공식 `redmine` 이미지는 레드마인 루트가 컨테이너 안(`/usr/src/redmine`)에 있어서 호스트에는 `bin/rails`가 없습니다.
아래 명령은 모두 `compose.yaml`이 있는 폴더(예: `/srv/redmine`)에서 실행합니다.

```bash
cd /srv/redmine
git clone https://github.com/asciisoft/asciisoft-redmine-theme.git themes/asciisoft
docker compose up -d --force-recreate redmine
docker compose exec redmine ls themes
```

테마는 compose.yaml의 redmine 서비스 `volumes:`에 아래 줄을 추가해야 컨테이너에 연결됩니다(테마별로 한 줄씩).

```yaml
      - ./themes/asciisoft:/usr/src/redmine/themes/asciisoft:ro
```

## 업데이트

```bash
cd $REDMINE
git -C themes/asciisoft pull --ff-only
sudo systemctl restart redmine   # Docker는 위 안내처럼 docker restart
```

## 제거

1. 관리 > 설정 > 표시 > 테마를 **기본**으로 변경합니다.
2. `rm -rf $REDMINE/themes/asciisoft`
3. 레드마인을 재시작합니다.

레드마인 원본 파일은 수정하지 않으므로 제거하면 원래 화면으로 돌아갑니다.

## 참고

- 글꼴 Pretendard를 jsDelivr CDN에서 불러옵니다. 외부 접속이 막힌 환경에서는 시스템 글꼴로 표시됩니다.
- 하위 경로(예: `/redmine`)로 운영하는 경우 `stylesheets/application.css` 첫 줄의 `@import url(/application.css)` 경로를 바꿔야 합니다.
- 900px 미만(모바일)은 레드마인 기본 모바일 메뉴를 사용합니다.
