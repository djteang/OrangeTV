/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { getConfig } from '@/lib/config';

import { GlobalErrorIndicator } from '../components/GlobalErrorIndicator';
import { SiteProvider } from '../components/SiteProvider';
import { ThemeProvider } from '../components/ThemeProvider';
import { ToastProvider } from '../components/Toast';
import GlobalThemeLoader from '../components/GlobalThemeLoader';

const inter = Inter({ subsets: ['latin'] });
export const dynamic = 'force-dynamic';

// 动态生成 metadata，支持配置更新后的标题变化
export async function generateMetadata(): Promise<Metadata> {
  const storageType = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage';
  const config = await getConfig();
  let siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'OrangeTV';
  if (storageType !== 'localstorage') {
    siteName = config.SiteConfig.SiteName;
  }

  return {
    title: siteName,
    description: '影视聚合',
    manifest: '/manifest.json',
  };
}

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storageType = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage';

  let siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'OrangeTV';
  let announcement =
    process.env.ANNOUNCEMENT ||
    '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。';

  let doubanProxyType = process.env.NEXT_PUBLIC_DOUBAN_PROXY_TYPE || 'cmliussss-cdn-tencent';
  let doubanProxy = process.env.NEXT_PUBLIC_DOUBAN_PROXY || '';
  let doubanImageProxyType =
    process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY_TYPE || 'cmliussss-cdn-tencent';
  let doubanImageProxy = process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY || '';
  let disableYellowFilter =
    process.env.NEXT_PUBLIC_DISABLE_YELLOW_FILTER === 'true';
  let fluidSearch = process.env.NEXT_PUBLIC_FLUID_SEARCH !== 'false';
  let requireDeviceCode = process.env.NEXT_PUBLIC_REQUIRE_DEVICE_CODE !== 'false';
  let customCategories = [] as {
    name: string;
    type: 'movie' | 'tv';
    query: string;
  }[];
  if (storageType !== 'localstorage') {
    const config = await getConfig();
    siteName = config.SiteConfig.SiteName;
    announcement = config.SiteConfig.Announcement;

    doubanProxyType = config.SiteConfig.DoubanProxyType;
    doubanProxy = config.SiteConfig.DoubanProxy;
    doubanImageProxyType = config.SiteConfig.DoubanImageProxyType;
    doubanImageProxy = config.SiteConfig.DoubanImageProxy;
    disableYellowFilter = config.SiteConfig.DisableYellowFilter;
    customCategories = config.CustomCategories.filter(
      (category) => !category.disabled
    ).map((category) => ({
      name: category.name || '',
      type: category.type,
      query: category.query,
    }));
    fluidSearch = config.SiteConfig.FluidSearch;
    requireDeviceCode = config.SiteConfig.RequireDeviceCode;
  }

  // 将运行时配置注入到全局 window 对象，供客户端在运行时读取
  const runtimeConfig = {
    STORAGE_TYPE: process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage',
    DOUBAN_PROXY_TYPE: doubanProxyType,
    DOUBAN_PROXY: doubanProxy,
    DOUBAN_IMAGE_PROXY_TYPE: doubanImageProxyType,
    DOUBAN_IMAGE_PROXY: doubanImageProxy,
    DISABLE_YELLOW_FILTER: disableYellowFilter,
    CUSTOM_CATEGORIES: customCategories,
    FLUID_SEARCH: fluidSearch,
    REQUIRE_DEVICE_CODE: requireDeviceCode,
  };

  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, viewport-fit=cover'
        />
        <link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
        {/* 将配置序列化后直接写入脚本，浏览器端可通过 window.RUNTIME_CONFIG 获取 */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.RUNTIME_CONFIG = ${JSON.stringify(runtimeConfig)};`,
          }}
        />

        {/* 立即从缓存应用主题，避免闪烁 */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 从localStorage立即获取缓存的主题配置
                  const cachedTheme = localStorage.getItem('theme-cache');
                  
                  if (cachedTheme) {
                    try {
                      const themeConfig = JSON.parse(cachedTheme);
                      console.log('应用缓存主题配置:', themeConfig);
                      
                      // 立即应用缓存的主题，避免闪烁
                      const html = document.documentElement;
                      
                      // 清除现有主题
                      html.removeAttribute('data-theme');
                      
                      // 应用缓存的主题
                      if (themeConfig.defaultTheme && themeConfig.defaultTheme !== 'default') {
                        html.setAttribute('data-theme', themeConfig.defaultTheme);
                      }
                      
                      // 应用缓存的自定义CSS
                      if (themeConfig.customCSS) {
                        let customStyleEl = document.getElementById('custom-theme-css');
                        if (!customStyleEl) {
                          customStyleEl = document.createElement('style');
                          customStyleEl.id = 'custom-theme-css';
                          document.head.appendChild(customStyleEl);
                        }
                        customStyleEl.textContent = themeConfig.customCSS;
                      }
                      
                      console.log('缓存主题已应用:', themeConfig.defaultTheme);
                    } catch (parseError) {
                      console.warn('解析缓存主题配置失败:', parseError);
                      localStorage.removeItem('theme-cache'); // 清除无效缓存
                    }
                  } else {
                    console.log('未找到缓存主题，等待API获取');
                  }
                } catch (error) {
                  console.error('应用缓存主题失败:', error);
                }
              })();
            `,
          }}
        />

      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-200`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <SiteProvider siteName={siteName} announcement={announcement}>
              <GlobalThemeLoader />
              {children}
              <GlobalErrorIndicator />
            </SiteProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
