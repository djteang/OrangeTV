/* eslint-disable no-console */

import { NextRequest, NextResponse } from 'next/server';

import { AdminConfigResult } from '@/lib/admin.types';
import { getAuthInfoFromCookie } from '@/lib/auth';
import { getConfig } from '@/lib/config';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const storageType = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage';
  if (storageType === 'localstorage') {
    return NextResponse.json(
      {
        error: '不支持本地存储进行管理员配置',
      },
      { status: 400 }
    );
  }

  const authInfo = getAuthInfoFromCookie(request);
  const username = authInfo?.username;

  try {
    const config = await getConfig();

    // 检查用户权限
    let userRole = 'guest'; // 未登录用户为 guest
    let isAdmin = false;

    if (username === process.env.USERNAME) {
      userRole = 'owner';
      isAdmin = true;
    } else if (username) {
      const user = config.UserConfig.Users.find((u) => u.username === username);
      if (user && user.role === 'admin' && !user.banned) {
        userRole = 'admin';
        isAdmin = true;
      } else if (user && !user.banned) {
        userRole = 'user';
      } else if (user && user.banned) {
        userRole = 'banned';
      } else {
        // 认证了但用户不存在，可能是数据不同步
        userRole = 'unknown';
      }
    }

    // 根据用户权限返回不同的配置信息
    if (isAdmin) {
      // 管理员返回完整配置
      const result: AdminConfigResult = {
        Role: userRole as 'admin' | 'owner',
        Config: config,
      };

      return NextResponse.json(result, {
        headers: {
          'Cache-Control': 'no-store', // 管理员配置不缓存
        },
      });
    } else {
      // 普通用户或未登录用户只返回公开配置
      const publicConfig = {
        ThemeConfig: config.ThemeConfig,
        SiteConfig: {
          SiteName: config.SiteConfig.SiteName,
          Announcement: config.SiteConfig.Announcement,
          // 其他公开的站点配置可以在这里添加
        }
      };

      const result = {
        Role: userRole,
        Config: publicConfig,
      };

      console.log('返回公开配置给', userRole, '，包含主题配置:', !!publicConfig.ThemeConfig);
      return NextResponse.json(result, {
        headers: {
          'Cache-Control': 'public, max-age=60', // 公开配置可以缓存1分钟
        },
      });
    }
  } catch (error) {
    console.error('获取配置失败:', error);
    return NextResponse.json(
      {
        error: '获取配置失败',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
