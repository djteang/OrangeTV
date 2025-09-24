'use client';

import { useEffect } from 'react';

// 全局主题加载器组件 - 从API同步最新配置，确保缓存与服务端一致
const GlobalThemeLoader = () => {
  useEffect(() => {
    const syncThemeWithAPI = async () => {
      try {
        console.log('从API同步主题配置...');
        const response = await fetch('/api/admin/config');
        const result = await response.json();

        if (result?.Config?.ThemeConfig) {
          const themeConfig = result.Config.ThemeConfig;
          const { defaultTheme, customCSS, allowUserCustomization } = themeConfig;

          console.log('API返回主题配置:', {
            defaultTheme,
            customCSS,
            allowUserCustomization
          });

          // 获取当前缓存的主题配置
          const cachedTheme = getCachedTheme();

          // 比较API配置与缓存配置
          const configChanged = !cachedTheme ||
            cachedTheme.defaultTheme !== defaultTheme ||
            cachedTheme.customCSS !== customCSS;

          if (configChanged) {
            console.log('检测到主题配置变更，更新应用:', {
              from: cachedTheme,
              to: { defaultTheme, customCSS }
            });
            applyAndCacheTheme(defaultTheme, customCSS);
          } else {
            console.log('主题配置无变化，保持当前设置');
          }

          // 将配置存储到运行时配置中，供ThemeManager使用
          const runtimeConfig = (window as any).RUNTIME_CONFIG;
          if (runtimeConfig) {
            runtimeConfig.THEME_CONFIG = themeConfig;
          }
        } else {
          console.log('无法获取主题配置，使用默认配置:', result);
          // API失败时，如果有缓存就保持，没有缓存就用默认
          const cachedTheme = getCachedTheme();
          if (!cachedTheme) {
            console.log('无缓存，应用默认主题');
            applyAndCacheTheme('default', '');
          } else {
            console.log('保持缓存主题:', cachedTheme);
          }
        }
      } catch (error) {
        console.error('API同步失败:', error);
        // 错误时如果有缓存就保持，没有缓存就用默认
        const cachedTheme = getCachedTheme();
        if (!cachedTheme) {
          console.log('无缓存且请求失败，应用默认主题');
          applyAndCacheTheme('default', '');
        } else {
          console.log('请求失败，保持缓存主题:', cachedTheme);
        }
      }
    };

    // 获取缓存的主题配置
    const getCachedTheme = () => {
      try {
        const cached = localStorage.getItem('theme-cache');
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.warn('读取主题缓存失败:', error);
        localStorage.removeItem('theme-cache');
        return null;
      }
    };

    // 应用主题并缓存
    const applyAndCacheTheme = (themeId: string, css: string = '') => {
      applyTheme(themeId, css);

      // 缓存主题配置
      const themeConfig = { defaultTheme: themeId, customCSS: css };
      try {
        localStorage.setItem('theme-cache', JSON.stringify(themeConfig));
        console.log('主题配置已缓存:', themeConfig);
      } catch (error) {
        console.warn('缓存主题配置失败:', error);
      }
    };

    // 应用主题函数
    const applyTheme = (themeId: string, css: string = '') => {
      const html = document.documentElement;

      // 移除所有主题class
      html.removeAttribute('data-theme');

      // 应用新主题
      if (themeId !== 'default') {
        html.setAttribute('data-theme', themeId);
      }

      // 应用自定义CSS
      let customStyleEl = document.getElementById('custom-theme-css');
      if (!customStyleEl) {
        customStyleEl = document.createElement('style');
        customStyleEl.id = 'custom-theme-css';
        document.head.appendChild(customStyleEl);
      }
      customStyleEl.textContent = css;
    };

    // 延迟一点时间，确保页面缓存主题已应用，然后同步API配置
    const timer = setTimeout(() => {
      syncThemeWithAPI();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null; // 这是一个逻辑组件，不渲染任何内容
};

export default GlobalThemeLoader;
