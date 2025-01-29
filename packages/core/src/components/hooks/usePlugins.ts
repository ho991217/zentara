import { useRef, useEffect } from 'react';
import {
  PluginOrFactory,
  PluginWithConfig,
  AnyConfig,
  isPluginFactory,
} from '../../types';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const usePlugins = (plugins?: PluginOrFactory<any>[]) => {
  const pluginInstancesRef = useRef<PluginWithConfig<AnyConfig>[]>([]);

  // initialize plugins
  if (!pluginInstancesRef.current.length && plugins) {
    pluginInstancesRef.current = plugins.map((pluginConfig) => {
      if (isPluginFactory(pluginConfig)) {
        return {
          plugin: pluginConfig.createInstance(),
          config: pluginConfig.config,
        };
      }
      return pluginConfig;
    });
  }

  // update plugins when config changed
  useEffect(() => {
    if (!plugins || !pluginInstancesRef.current.length) return;

    plugins.forEach((pluginConfig, index) => {
      if (isPluginFactory(pluginConfig)) {
        pluginInstancesRef.current[index].config = pluginConfig.config;
      }
    });
  }, [plugins]);

  // destroy plugins when unmount
  useEffect(() => {
    return () => {
      pluginInstancesRef.current.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.destroy?.();
      });
      pluginInstancesRef.current = [];
    };
  }, []);

  return pluginInstancesRef;
};
