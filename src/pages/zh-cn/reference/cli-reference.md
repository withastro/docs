---
layout: ~/layouts/MainLayout.astro
title: CLI 参考
---

## 命令

### `astro dev`

运行 Astro `dev` 服务器。它将启动 HTTP 服务器以响应与 `src/pages` 目录下路由/页面关联的请求（除非在[配置](/zh-cn/reference/configuration-reference/)中设置 `pages` 项）。

**标志**

#### `--port`

指定运行在哪个端口。默认为 `3000`。

#### `--host [可选主机地址]`

设置开发服务器应该监听哪些网络 IP 地址（即非本地主机 IP）。

- `--host`——监听所有地址，包括 LAN 和公开地址
- `--host [自定义地址]`——暴露在 `[自定义地址]` 的网络 IP 地址上。

### `astro build`

构建你的网站用于生产。

### `astro preview`

启动本地静态文件服务器，为构建生成的 `dist/` 目录提供服务。在正式部署前，可以在本地预览静态构建。

这个命令只适用于本地测试，并不适合在生产中运行。关于生产托管的帮助，请查看我们的[部署 Astro 站点](/zh-cn/guides/deploy/)指南。

### `astro check`

对项目进行检测（比如对 `.astro` 文件进行类型检查），并向控制台输出错误信息。如果发现任何错误，该进程将以 **1** 代码退出。

该命令旨在用于 CI 工作流程。

:::note
该命令只检测 `.astro` 文件中的类型。
:::

📚 阅读更多关于 [Astro 的 TypeScript 支持](/zh-cn/guides/typescript/)的信息。

### `astro add`

在配置中添加集成

### `astro docs`

直接从终端启动 Astro Docs 网站。

### `astro telemetry`

设置当前用户遥测。通过匿名传递数据进行遥测，对常用功能进行监测。

可以通过这个 CLI 命令禁用遥测：

```shell
astro telemetry disable
```

后面也可以随时通过以下方式重新启用遥测：

```shell
astro telemetry enable
```

使用 `clear` 命令重置遥测数据：

```shell
astro telemetry clear
```

:::tip[想要在 CI 环境中禁用遥测？]
请确保在 CI 脚本中添加了 `astro telemetry disable` 命令。
:::

## 全局标志

### `--config path`

指定配置文件的路径。默认为 `astro.config.mjs`。如果使用了不同的配置文件名称或放在其他文件夹中，请使用：

```shell
astro --config config/astro.config.mjs dev
```

### `--root path`

指定项目根目录的路径。如果不指定，则假定当前工作目录为根目录。

根目录是用来寻找 Astro 配置文件的。

```shell
astro --root myRootFolder/myProjectFolder dev
```

### `--reload`

清除缓存（基于 Astro 应用依赖）。

### `--verbose`

启用完整日志，调试时有用。

### `--silent`

启用静默日志，当你不想看到 Astro 日志时有用。

### `--version`

打印 Astro 版本号并退出。

### `--drafts`

在构建中包括 Markdown 草稿。

### `--help`

打印帮助信息并退出。
