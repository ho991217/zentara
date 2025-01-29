import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PluginContext, PluginWithConfig } from '../types';

type PluginOverlayProps<TConfig> = {
  pluginInstance: PluginWithConfig<TConfig>;
  internalValue: string;
  createContext: <T = TConfig>(
    value: string,
    pluginWithConfig?: PluginWithConfig<T>
  ) => PluginContext<T>;
  anchorEl: HTMLElement | null;
};

export const PluginOverlay = memo(function PluginOverlay<TConfig>({
  pluginInstance,
  internalValue,
  createContext,
  anchorEl,
}: PluginOverlayProps<TConfig>) {
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorEl) return;

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      setOverlayPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorEl]);

  const content = (
    <div
      className='zentara-plugin-overlay'
      style={{
        top: overlayPosition.top,
        left: overlayPosition.left,
        width: anchorEl?.offsetWidth,
      }}
    >
      {pluginInstance.plugin.renderOverlay?.(
        createContext(internalValue, pluginInstance)
      )}
    </div>
  );

  if (!anchorEl) return null;

  return createPortal(content, document.body);
}) as <TConfig>(props: PluginOverlayProps<TConfig>) => JSX.Element;
