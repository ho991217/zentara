import type { KeyboardEvent, ReactNode, RefObject, ChangeEvent } from 'react';

export interface SharedPluginState {
  [key: string]: unknown;
}

export interface ZentaraPluginContext<TConfig = unknown> {
  value: string;
  setValue: (value: string) => void;
  // 플러그인 간 공유 상태
  shared: SharedPluginState;
  // 플러그인별 메타데이터
  meta?: {
    config?: TConfig;
    cursorPosition?: number;
    [key: string]: unknown;
  };
}

export interface ZentaraPlugin<
  TName extends string = string,
  TConfig = unknown
> {
  name: TName;

  // 플러그인 초기화
  init?: (context: ZentaraPluginContext<TConfig>) => void;

  // 입력값 변경 시 호출
  onValueChange?: (
    value: string,
    context: ZentaraPluginContext<TConfig>
  ) => string | Promise<string>;

  // 키 입력 시 호출
  onKeyDown?: (
    event: KeyboardEvent,
    context: ZentaraPluginContext<TConfig>
  ) => void;

  // 커스텀 렌더링 (자동완성 드롭다운 등)
  renderSuggestions?: (context: ZentaraPluginContext<TConfig>) => ReactNode;

  // 입력값 표시 방식 커스터마이징 (구문 강조 등)
  renderDisplay?: (
    value: string,
    context: ZentaraPluginContext<TConfig> & {
      inputRef: RefObject<HTMLInputElement>;
      onChange: (e: ChangeEvent<HTMLInputElement>) => void;
      onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
      onSelect: () => void;
      placeholder?: string;
    }
  ) => ReactNode;

  validateConfig?: (config: TConfig) => boolean;
}

export interface ZentaraPluginConfig {
  plugins: ZentaraPlugin[];
  pluginConfigs?: Record<string, unknown>;
}
