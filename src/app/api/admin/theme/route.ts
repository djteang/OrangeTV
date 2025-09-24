import { NextResponse } from 'next/server';
import { getAuthInfoFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { AdminConfig } from '@/lib/admin.types';
import { headers, cookies } from 'next/headers';
import { getConfig, setCachedConfig, clearCachedConfig } from '@/lib/config';

export async function GET() {
  try {
    // 创建一个模拟的NextRequest对象来使用getAuthInfoFromCookie
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');

    if (!authCookie) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    let authData;
    try {
      const decoded = decodeURIComponent(authCookie.value);
      authData = JSON.parse(decoded);
    } catch (error) {
      return NextResponse.json({ error: '认证信息无效' }, { status: 401 });
    }

    const config = await getConfig();
    const themeConfig = config.ThemeConfig;

    return NextResponse.json({
      success: true,
      data: themeConfig,
    });
  } catch (error) {
    console.error('获取主题配置失败:', error);
    return NextResponse.json(
      { error: '获取主题配置失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 获取认证信息
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');

    if (!authCookie) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    let authData;
    try {
      const decoded = decodeURIComponent(authCookie.value);
      authData = JSON.parse(decoded);
    } catch (error) {
      return NextResponse.json({ error: '认证信息无效' }, { status: 401 });
    }

    // 检查是否为管理员
    if (authData.role !== 'admin' && authData.role !== 'owner') {
      return NextResponse.json({ error: '权限不足，仅管理员可设置全局主题' }, { status: 403 });
    }

    const body = await request.json();
    const { defaultTheme, customCSS, allowUserCustomization } = body;

    // 验证主题名称
    const validThemes = ['default', 'minimal', 'warm', 'fresh'];
    if (!validThemes.includes(defaultTheme)) {
      return NextResponse.json({ error: '无效的主题名称' }, { status: 400 });
    }

    // 获取当前配置
    const baseConfig = await getConfig();

    // 更新主题配置
    const updatedConfig: AdminConfig = {
      ...baseConfig,
      ThemeConfig: {
        defaultTheme: defaultTheme as 'default' | 'minimal' | 'warm' | 'fresh',
        customCSS: customCSS || '',
        allowUserCustomization: allowUserCustomization !== false,
      },
    };

    console.log('=== 保存主题配置 ===');
    console.log('请求参数:', { defaultTheme, customCSS, allowUserCustomization });
    console.log('当前存储类型:', process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage');
    console.log('待保存配置:', updatedConfig.ThemeConfig);
    console.log('完整配置对象:', JSON.stringify(updatedConfig, null, 2));

    await db.saveAdminConfig(updatedConfig);
    console.log('主题配置保存成功');

    // 直接更新缓存，确保缓存与数据库同步
    await setCachedConfig(updatedConfig);
    console.log('已更新配置缓存');

    // 立即验证缓存中的配置
    const cachedConfig = await getConfig();
    console.log('保存后验证缓存中的配置:', cachedConfig.ThemeConfig);

    return NextResponse.json({
      success: true,
      message: '主题配置已更新',
      data: updatedConfig.ThemeConfig,
    });
  } catch (error) {
    console.error('更新主题配置失败:', error);
    return NextResponse.json(
      { error: '更新主题配置失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
