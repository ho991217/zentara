export const getCurrentChunk = (
  value: string,
  cursorPosition: number,
  triggers: string[]
): { text: string; start: number; end: number; trigger: string } | null => {
  const beforeCursor = value.slice(0, cursorPosition);
  const afterCursor = value.slice(cursorPosition);

  // 가장 긴 트리거부터 매칭 시도
  const sortedTriggers = [...triggers].sort((a, b) => b.length - a.length);
  for (const trigger of sortedTriggers) {
    const index = beforeCursor.lastIndexOf(trigger);
    if (index === -1) continue;

    // 커서가 트리거 영역 안에 있는지 확인
    if (cursorPosition < index) continue;

    // 커서 뒤쪽으로 가장 가까운 공백 찾기
    const afterSpaceIndex = afterCursor.indexOf(' ');
    const chunkEnd =
      afterSpaceIndex === -1 ? value.length : cursorPosition + afterSpaceIndex;

    // 청크 추출
    const chunk = value.slice(index, chunkEnd);
    return {
      text: chunk,
      start: index,
      end: chunkEnd,
      trigger,
    };
  }

  return null;
};
