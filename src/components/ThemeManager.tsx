'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Palette, Eye, Check } from 'lucide-react';

// CSS模板配置
const cssTemplates = [
  {
    id: 'gradient-bg',
    name: '渐变背景',
    description: '为页面添加漂亮的渐变背景',
    preview: 'body {\n  background: linear-gradient(135deg, \n    #667eea 0%, #764ba2 100%);\n}',
    css: `/* 渐变背景主题 */
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

/* 确保内容可读性 */
.admin-panel, .bg-theme-surface {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9) !important;
}

.dark .admin-panel, .dark .bg-theme-surface {
  background: rgba(0, 0, 0, 0.8) !important;
}`
  },
  {
    id: 'image-bg',
    name: '图片背景',
    description: '使用自定义图片作为背景',
    preview: 'body {\n  background-image: url("图片链接");\n  background-size: cover;\n}',
    css: `/* 图片背景主题 */
body {
  background-image: url("https://images.unsplash.com/photo-1519681393784-d120c3b3fd60?ixlib=rb-4.0.3");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* 添加遮罩层确保可读性 */
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: -1;
}

/* 调整内容区域透明度 */
.admin-panel, .bg-theme-surface {
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .admin-panel, .dark .bg-theme-surface {
  background: rgba(0, 0, 0, 0.85) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}`
  },
  {
    id: 'sidebar-glow',
    name: '发光侧边栏',
    description: '为侧边栏添加发光效果',
    preview: '.sidebar {\n  box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);\n  border-radius: 15px;\n}',
    css: `/* 发光侧边栏效果 */
.sidebar, [data-sidebar] {
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
  border-radius: 15px;
  border: 1px solid rgba(14, 165, 233, 0.2);
  backdrop-filter: blur(10px);
}

/* 侧边栏项目悬停效果 */
.sidebar a:hover, [data-sidebar] a:hover {
  background: rgba(14, 165, 233, 0.1);
  transform: translateX(5px);
  transition: all 0.3s ease;
}

/* 活动项目发光 */
.sidebar [data-active="true"], [data-sidebar] [data-active="true"] {
  background: rgba(14, 165, 233, 0.15);
  box-shadow: inset 0 0 10px rgba(14, 165, 233, 0.2);
  border-radius: 8px;
}`
  },
  {
    id: 'card-animations',
    name: '卡片动画',
    description: '为视频卡片添加动画效果',
    preview: '.video-card:hover {\n  transform: scale(1.05);\n  box-shadow: 0 10px 25px rgba(0,0,0,0.2);\n}',
    css: `/* 卡片动画效果 */
.video-card, [data-video-card] {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
}

.video-card:hover, [data-video-card]:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* 图片悬停效果 */
.video-card img, [data-video-card] img {
  transition: transform 0.3s ease;
  border-radius: 8px;
}

.video-card:hover img, [data-video-card]:hover img {
  transform: scale(1.05);
}

/* 按钮动画 */
.video-card button, [data-video-card] button {
  transition: all 0.2s ease;
}

.video-card button:hover, [data-video-card] button:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}`
  },
  {
    id: 'glass-theme',
    name: '毛玻璃主题',
    description: '现代毛玻璃风格界面',
    preview: '.glass-effect {\n  backdrop-filter: blur(20px);\n  background: rgba(255, 255, 255, 0.1);\n}',
    css: `/* 毛玻璃主题 */
body {
  background: linear-gradient(45deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(147, 51, 234, 0.1) 50%, 
    rgba(236, 72, 153, 0.1) 100%);
}

/* 所有面板使用毛玻璃效果 */
.admin-panel, .bg-theme-surface, [data-panel] {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dark .admin-panel, .dark .bg-theme-surface, .dark [data-panel] {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 按钮毛玻璃效果 */
button {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

button:hover {
  backdrop-filter: blur(15px);
  transform: translateY(-1px);
}`
  },
  {
    id: 'neon-accents',
    name: '霓虹强调',
    description: '添加炫酷的霓虹发光效果',
    preview: '.neon-glow {\n  box-shadow: 0 0 20px currentColor;\n  text-shadow: 0 0 10px currentColor;\n}',
    css: `/* 霓虹发光主题 */
:root {
  --neon-color: #00ff88;
  --neon-glow: 0 0 20px var(--neon-color);
}

/* 主要标题霓虹效果 */
h1, h2, h3 {
  text-shadow: 0 0 10px var(--neon-color);
  color: var(--neon-color);
}

/* 按钮霓虹效果 */
button:hover, .btn-primary {
  box-shadow: var(--neon-glow);
  border: 1px solid var(--neon-color);
  transition: all 0.3s ease;
}

/* 输入框聚焦霓虹效果 */
input:focus, textarea:focus {
  box-shadow: var(--neon-glow);
  border-color: var(--neon-color);
}

/* 卡片边框霓虹效果 */
.card-hover:hover {
  box-shadow: var(--neon-glow);
  border: 1px solid var(--neon-color);
}

/* 侧边栏活动项霓虹效果 */
[data-active="true"] {
  box-shadow: inset var(--neon-glow);
  background: rgba(0, 255, 136, 0.1);
}`
  }
];

// 主题配置
const themes = [
  {
    id: 'default',
    name: '默认主题',
    description: '现代蓝色主题，清新优雅',
    preview: {
      bg: '#ffffff',
      surface: '#f9fafb',
      accent: '#0ea5e9',
      text: '#111827',
      border: '#e5e7eb'
    }
  },
  {
    id: 'minimal',
    name: '极简主题',
    description: '简约黑白，专注内容',
    preview: {
      bg: '#ffffff',
      surface: '#fcfcfc',
      accent: '#525252',
      text: '#171717',
      border: '#e5e5e5'
    }
  },
  {
    id: 'warm',
    name: '暖色主题',
    description: '温暖橙调，舒适护眼',
    preview: {
      bg: '#fffdf7',
      surface: '#fefaf0',
      accent: '#ea580c',
      text: '#7c2d12',
      border: '#fde68a'
    }
  },
  {
    id: 'fresh',
    name: '清新主题',
    description: '自然绿色，清新活力',
    preview: {
      bg: '#f7fdf9',
      surface: '#f0fdf4',
      accent: '#3fcc71',
      text: '#14532d',
      border: '#bbf7d0'
    }
  }
];

interface ThemeManagerProps {
  showAlert: (config: any) => void;
  role?: 'user' | 'admin' | 'owner' | null;
}

const ThemeManager = ({ showAlert, role }: ThemeManagerProps) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [customCSS, setCustomCSS] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [showCustomEditor, setShowCustomEditor] = useState(false);
  const [globalThemeConfig, setGlobalThemeConfig] = useState<{
    defaultTheme: string;
    customCSS: string;
    allowUserCustomization: boolean;
  } | null>(null);

  const isAdmin = role === 'admin' || role === 'owner';

  // 更新主题缓存的辅助函数
  const updateThemeCache = (themeId: string, css: string) => {
    try {
      const themeConfig = {
        defaultTheme: themeId,
        customCSS: css
      };
      localStorage.setItem('theme-cache', JSON.stringify(themeConfig));
      console.log('主题配置已缓存:', themeConfig);
    } catch (error) {
      console.warn('缓存主题配置失败:', error);
    }
  };

  // 从API加载主题配置（唯一数据源）
  const loadGlobalThemeConfig = async () => {
    try {
      console.log('从API获取主题配置...');
      const response = await fetch('/api/admin/config');
      const result = await response.json();

      if (result?.Config?.ThemeConfig) {
        const themeConfig = result.Config.ThemeConfig;
        console.log('API返回的主题配置:', themeConfig);
        setGlobalThemeConfig(themeConfig);

        // 更新运行时配置，保持同步
        const runtimeConfig = (window as any).RUNTIME_CONFIG;
        if (runtimeConfig) {
          runtimeConfig.THEME_CONFIG = themeConfig;
        }

        return themeConfig;
      } else {
        console.log('无法获取主题配置，可能未登录或权限不足:', result);
      }
    } catch (error) {
      console.error('从API加载主题配置失败:', error);
    }
    return null;
  };

  // 保存全局主题配置
  const saveGlobalThemeConfig = async (config: {
    defaultTheme: string;
    customCSS: string;
    allowUserCustomization: boolean;
  }) => {
    try {
      const response = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const result = await response.json();
      if (result.success) {
        setGlobalThemeConfig(result.data);

        // 更新运行时配置，确保同步
        const runtimeConfig = (window as any).RUNTIME_CONFIG;
        if (runtimeConfig) {
          runtimeConfig.THEME_CONFIG = result.data;
          console.log('已更新运行时主题配置:', result.data);
        }

        // 立即应用新的主题配置，确保当前页面也能看到更改
        applyTheme(result.data.defaultTheme, result.data.customCSS);

        // 更新本地缓存
        updateThemeCache(result.data.defaultTheme, result.data.customCSS);

        console.log('已立即应用新主题配置:', result.data.defaultTheme);

        showAlert({
          type: 'success',
          title: '全站主题配置已保存',
          message: '所有用户将使用新的主题配置',
          timer: 3000
        });
        return true;
      } else {
        throw new Error(result.error || '保存失败');
      }
    } catch (error) {
      showAlert({
        type: 'error',
        title: '保存全局主题配置失败',
        message: error instanceof Error ? error.message : '未知错误',
        timer: 3000
      });
      return false;
    }
  };

  // 从localStorage加载当前主题
  useEffect(() => {
    // 确保在客户端环境中执行
    if (typeof window === 'undefined') return;

    const initTheme = async () => {
      // 加载全局配置
      const globalConfig = await loadGlobalThemeConfig();

      if (globalConfig) {
        // 使用全局配置
        setCurrentTheme(globalConfig.defaultTheme);
        setCustomCSS(globalConfig.customCSS);
        applyTheme(globalConfig.defaultTheme, globalConfig.customCSS);
      } else {
        // 如果没有全局配置，使用默认值
        const defaultTheme = 'default';
        const defaultCSS = '';
        setCurrentTheme(defaultTheme);
        setCustomCSS(defaultCSS);
        applyTheme(defaultTheme, defaultCSS);
      }
    };

    initTheme();
  }, []);

  // 应用主题
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

  // 切换主题
  const handleThemeChange = async (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId, customCSS);

    if (isAdmin) {
      // 保存到全局配置
      const success = await saveGlobalThemeConfig({
        defaultTheme: themeId,
        customCSS: customCSS,
        allowUserCustomization: globalThemeConfig?.allowUserCustomization ?? true,
      });

      // 如果保存成功，立即更新本地全局配置状态
      if (success) {
        setGlobalThemeConfig({
          defaultTheme: themeId,
          customCSS: customCSS,
          allowUserCustomization: globalThemeConfig?.allowUserCustomization ?? true,
        });
      }
    }

    const theme = themes.find(t => t.id === themeId);
    showAlert({
      type: 'success',
      title: '全站主题已设置',
      message: `已切换到${theme?.name}`,
      timer: 2000
    });
  };

  // 预览主题
  const handleThemePreview = (themeId: string) => {
    if (!previewMode) {
      setPreviewMode(true);
      applyTheme(themeId, customCSS);

      // 3秒后恢复原主题
      setTimeout(() => {
        setPreviewMode(false);
        applyTheme(currentTheme, customCSS);
      }, 3000);
    }
  };

  // 应用自定义CSS
  const handleCustomCSSApply = async () => {
    try {
      applyTheme(currentTheme, customCSS);

      if (isAdmin) {
        // 保存到全局配置
        const success = await saveGlobalThemeConfig({
          defaultTheme: currentTheme,
          customCSS: customCSS,
          allowUserCustomization: globalThemeConfig?.allowUserCustomization ?? true,
        });

        // 如果保存成功，立即更新本地全局配置状态
        if (success) {
          setGlobalThemeConfig({
            defaultTheme: currentTheme,
            customCSS: customCSS,
            allowUserCustomization: globalThemeConfig?.allowUserCustomization ?? true,
          });
        }
      } else {
        showAlert({
          type: 'warning',
          title: '权限不足',
          message: '仅管理员可以设置全站主题',
          timer: 2000
        });
      }
    } catch (error) {
      showAlert({
        type: 'error',
        title: '样式应用失败',
        message: 'CSS语法可能有误，请检查后重试',
        timer: 3000
      });
    }
  };

  // 重置自定义CSS
  const handleCustomCSSReset = async () => {
    setCustomCSS('');
    applyTheme(currentTheme, '');

    if (isAdmin) {
      // 保存到全局配置
      await saveGlobalThemeConfig({
        defaultTheme: currentTheme,
        customCSS: '',
        allowUserCustomization: globalThemeConfig?.allowUserCustomization ?? true,
      });

      setGlobalThemeConfig({
        defaultTheme: currentTheme,
        customCSS: '',
        allowUserCustomization: globalThemeConfig?.allowUserCustomization ?? true,
      });

      // 更新运行时配置
      const runtimeConfig = (window as any).RUNTIME_CONFIG;
      if (runtimeConfig) {
        runtimeConfig.THEME_CONFIG = {
          defaultTheme: currentTheme,
          customCSS: '',
          allowUserCustomization: globalThemeConfig?.allowUserCustomization ?? true,
        };
      }

      // 更新本地缓存
      updateThemeCache(currentTheme, '');
    }

    showAlert({
      type: 'success',
      title: '全站自定义样式已重置',
      timer: 2000
    });
  };

  // 应用模板CSS
  const handleApplyTemplate = (templateCSS: string, templateName: string) => {
    setCustomCSS(templateCSS);
    showAlert({
      type: 'success',
      title: '模板已复制',
      message: `${templateName}模板已复制到编辑器`,
      timer: 2000
    });
  };

  return (
    <div className="space-y-6">
      {/* 管理员控制面板 */}
      {isAdmin && globalThemeConfig && (
        <div className="bg-theme-surface border border-theme-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-theme-text mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            全站主题设置
          </h3>

          <div className="space-y-4">
            <div className="p-3 bg-theme-accent/5 border border-theme-accent/20 rounded-lg">
              <div className="text-sm text-theme-text">
                <strong>当前全站配置：</strong>
              </div>
              <div className="text-xs text-theme-text-secondary mt-1">
                默认主题: {themes.find(t => t.id === globalThemeConfig.defaultTheme)?.name || globalThemeConfig.defaultTheme}
                {globalThemeConfig.customCSS && ' | 包含自定义CSS'}
                {!globalThemeConfig.allowUserCustomization && ' | 禁止用户自定义'}
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-700">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <span className="text-sm font-medium">ℹ️ 全站主题</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                在此设置的主题配置将应用到整个网站，影响所有用户的默认体验
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 主题选择器 */}
      <div>
        <h3 className="text-lg font-semibold text-theme-text mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5" />
          全站主题选择
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative p-4 border-2 rounded-xl transition-all ${currentTheme === theme.id
                ? 'border-theme-accent bg-theme-accent/5'
                : 'border-theme-border bg-theme-surface'
                } ${isAdmin ? 'cursor-pointer hover:border-theme-accent/50' : 'cursor-not-allowed opacity-60'}`}
              onClick={() => isAdmin && handleThemeChange(theme.id)}
            >
              {/* 主题预览 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex space-x-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.preview.bg }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.preview.surface }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.preview.accent }} />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAdmin) handleThemePreview(theme.id);
                    }}
                    className={`p-1 transition-colors ${isAdmin ? 'text-theme-text-secondary hover:text-theme-accent' : 'text-theme-text-secondary opacity-50 cursor-not-allowed'}`}
                    title={isAdmin ? "预览主题" : "仅管理员可预览"}
                    disabled={previewMode || !isAdmin}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {currentTheme === theme.id && (
                    <Check className="h-4 w-4 text-theme-accent" />
                  )}
                </div>
              </div>

              <h4 className="font-medium text-theme-text">{theme.name}</h4>
              <p className="text-sm text-theme-text-secondary mt-1">{theme.description}</p>
            </div>
          ))}
        </div>

        {previewMode && (
          <div className="mt-4 p-3 bg-theme-info/10 border border-theme-info/20 rounded-lg">
            <p className="text-sm text-theme-info">正在预览主题，3秒后将自动恢复...</p>
          </div>
        )}
      </div>

      {/* 自定义CSS编辑器 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-theme-text flex items-center gap-2">
            <Palette className="h-5 w-5" />
            全站自定义样式
          </h3>
          {isAdmin ? (
            <button
              onClick={() => setShowCustomEditor(!showCustomEditor)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-surface border border-theme-border rounded-lg hover:bg-theme-accent/5 transition-colors"
            >
              {showCustomEditor ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showCustomEditor ? '收起编辑器' : '展开编辑器'}
            </button>
          ) : (
            <div className="text-sm text-theme-text-secondary">
              仅管理员可编辑
            </div>
          )}
        </div>

        {!isAdmin && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-700 mb-4">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <span className="text-sm font-medium">⚠️ 权限限制</span>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              您当前没有权限修改全站主题设置，请联系管理员。
            </p>
          </div>
        )}

        {isAdmin && showCustomEditor && (
          <div className="space-y-4">
            <div className="text-sm text-theme-text-secondary bg-theme-surface p-3 rounded-lg border border-theme-border">
              <p className="mb-2">💡 <strong>使用提示：</strong></p>
              <ul className="space-y-1 text-xs">
                <li>• 使用CSS变量覆盖主题颜色：<code className="bg-theme-bg px-1 rounded">--color-theme-accent: 255, 0, 0;</code></li>
                <li>• 使用Tailwind类名：<code className="bg-theme-bg px-1 rounded">{`.my-class { @apply bg-red-500; }`}</code></li>
                <li>• 自定义组件样式：<code className="bg-theme-bg px-1 rounded">{`.admin-panel { border-radius: 20px; }`}</code></li>
                <li>• 修改会实时生效，请谨慎使用</li>
              </ul>
            </div>

            <div className="relative">
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder="/* 在此输入您的自定义CSS */
:root {
  --color-theme-accent: 255, 0, 0; /* 红色主题色 */
}

.admin-panel {
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

/* 使用Tailwind类名 */
.custom-button {
  @apply bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl;
}"
                className="w-full h-64 p-4 bg-theme-surface border border-theme-border rounded-lg text-sm font-mono text-theme-text placeholder-theme-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCustomCSSApply}
                className="px-4 py-2 bg-theme-accent text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                应用样式
              </button>
              <button
                onClick={handleCustomCSSReset}
                className="px-4 py-2 bg-theme-surface border border-theme-border text-theme-text rounded-lg hover:bg-theme-accent/5 transition-colors"
              >
                重置样式
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS 模板库 */}
      {isAdmin && (
        <div className="bg-theme-surface border border-theme-border rounded-lg p-4">
          <h4 className="font-medium text-theme-text mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            🎨 全站样式模板库
          </h4>
          <p className="text-sm text-theme-text-secondary mb-4">选择预设模板快速应用炫酷效果到全站，也可以在此基础上进行自定义修改</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cssTemplates.map((template) => (
              <div key={template.id} className="p-3 border border-theme-border rounded-lg hover:bg-theme-accent/5 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-theme-text">{template.name}</h5>
                  <button
                    onClick={() => handleApplyTemplate(template.css, template.name)}
                    className="text-xs px-2 py-1 bg-theme-accent text-white rounded hover:opacity-90 transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    应用
                  </button>
                </div>
                <p className="text-xs text-theme-text-secondary mb-2">{template.description}</p>
                <div className="text-xs bg-theme-bg rounded p-2 max-h-16 overflow-y-auto">
                  <code className="whitespace-pre-wrap text-theme-text-secondary">{template.preview}</code>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-theme-accent/5 border border-theme-accent/20 rounded-lg">
            <p className="text-xs text-theme-text-secondary">
              <strong>💡 使用提示：</strong> 点击模板的"应用"按钮将代码复制到自定义CSS编辑器，然后可以在此基础上进行修改。记得点击"应用样式"按钮生效。
            </p>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-theme-surface border border-theme-border rounded-lg p-4">
        <h4 className="font-medium text-theme-text mb-2">📖 全站主题定制指南</h4>
        <div className="text-sm text-theme-text-secondary space-y-2">
          <p><strong>内置主题：</strong>{isAdmin ? '选择预设主题即可一键切换全站整体风格' : '由管理员设置的全站预设主题'}</p>
          {isAdmin && <p><strong>自定义CSS：</strong>通过CSS变量或直接样式实现全站个性化定制</p>}
          {isAdmin && <p><strong>样式模板：</strong>使用预设模板快速实现炫酷效果</p>}
          <p><strong>主题变量：</strong></p>
          <ul className="text-xs space-y-1 ml-4 mt-1">
            <li>• <code className="bg-theme-bg px-1 rounded">--color-theme-bg</code> - 背景色</li>
            <li>• <code className="bg-theme-bg px-1 rounded">--color-theme-surface</code> - 卡片背景</li>
            <li>• <code className="bg-theme-bg px-1 rounded">--color-theme-accent</code> - 主题色</li>
            <li>• <code className="bg-theme-bg px-1 rounded">--color-theme-text</code> - 主文本色</li>
            <li>• <code className="bg-theme-bg px-1 rounded">--color-theme-border</code> - 边框色</li>
          </ul>
          {isAdmin && (
            <>
              <p><strong>常用技巧：</strong></p>
              <ul className="text-xs space-y-1 ml-4 mt-1">
                <li>• 修改背景：<code className="bg-theme-bg px-1 rounded">{`body { background: linear-gradient(...); }`}</code></li>
                <li>• 使用Tailwind：<code className="bg-theme-bg px-1 rounded">{`.my-class { @apply bg-red-500; }`}</code></li>
                <li>• 组合多个模板效果获得独特样式</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;
