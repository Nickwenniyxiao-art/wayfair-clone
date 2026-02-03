# Google Cloud Build 部署指南

本指南将帮助您使用 Google Cloud Build 从源代码直接部署 Wayfair Clone 应用到 Cloud Run。

## 前置条件

- Google Cloud Platform (GCP) 账户
- 项目 ID: `cohesive-poetry-486213-q3`
- 访问 Google Cloud Console

## 部署步骤

### 第 1 步：准备源代码

1. 确保所有代码已提交到 Git 仓库
2. 代码包含以下关键文件：
   - `Dockerfile` - 多阶段 Docker 构建配置
   - `cloudbuild.yaml` - Cloud Build 配置
   - `package.json` 和 `pnpm-lock.yaml` - 依赖管理

### 第 2 步：在 Google Cloud Console 中创建 Cloud Build 触发器

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 选择项目 `cohesive-poetry-486213-q3`
3. 导航到 **Cloud Build** > **Triggers**
4. 点击 **Create Trigger**
5. 配置触发器：
   - **Name**: `wayfair-clone-deploy`
   - **Event**: 选择 `Push to a branch` 或 `Manual invocation`
   - **Repository**: 选择您的代码仓库
   - **Branch**: `main` (或您的默认分支)
   - **Build configuration**: `Cloud Build configuration file (yaml or json)`
   - **Cloud Build configuration file location**: `cloudbuild.yaml`

### 第 3 步：配置环境变量

在 Cloud Build 触发器中，添加以下替换变量（Substitutions）：

```
_DATABASE_URL: 您的 Cloud SQL 连接字符串
_JWT_SECRET: 您的 JWT 密钥
_VITE_APP_ID: Manus OAuth App ID
_OAUTH_SERVER_URL: OAuth 服务器 URL
_VITE_OAUTH_PORTAL_URL: OAuth 门户 URL
_BUILT_IN_FORGE_API_URL: Manus API URL
_BUILT_IN_FORGE_API_KEY: Manus API 密钥
```

### 第 4 步：启用必要的 API

在 Google Cloud Console 中启用以下 API：
- Cloud Build API
- Cloud Run Admin API
- Container Registry API
- Cloud SQL Admin API
- Compute Engine API

### 第 5 步：手动触发部署

1. 在 Cloud Build Triggers 页面中找到 `wayfair-clone-deploy` 触发器
2. 点击 **Run**
3. 在弹出的对话框中，输入替换变量的值
4. 点击 **Create** 开始构建

### 第 6 步：监控构建过程

1. 在 Cloud Build 页面中查看构建历史
2. 点击最新的构建来查看详细日志
3. 等待构建完成（通常需要 5-10 分钟）

### 第 7 步：验证部署

构建完成后，您可以：

1. 访问 Cloud Run 服务
   - 在 Google Cloud Console 中导航到 **Cloud Run**
   - 找到 `wayfair-clone` 服务
   - 点击服务 URL 访问应用

2. 检查服务状态
   - 确保服务显示为 "OK" 状态
   - 检查流量和错误日志

## 配置 Cloud SQL 连接

如果您需要连接到 Cloud SQL 数据库：

1. 在 Cloud Build 配置中添加 Cloud SQL 连接：
   ```yaml
   --add-cloudsql-instances=PROJECT_ID:REGION:INSTANCE_NAME
   ```

2. 确保 Cloud Run 服务账户有权访问 Cloud SQL

## 自动部署设置

要启用自动部署（每次推送到主分支时自动部署）：

1. 在创建触发器时选择 `Push to a branch`
2. 选择您的主分支
3. 保存触发器

现在每次推送代码时，Cloud Build 都会自动构建和部署应用。

## 故障排除

### 构建失败

- 检查 Docker 镜像构建日志
- 确保所有依赖都正确安装
- 验证 Dockerfile 配置

### 部署失败

- 检查 Cloud Run 部署日志
- 确保环境变量正确配置
- 验证 Cloud SQL 连接字符串

### 应用无法启动

- 检查应用日志：`gcloud run logs read wayfair-clone --region us-central1`
- 验证环境变量是否正确传递
- 检查数据库连接

## 后续步骤

1. **配置自定义域名**
   - 在 Cloud Run 中配置域名映射
   - 更新 DNS 记录指向 Cloud Run 服务

2. **设置 Cloud CDN**
   - 为静态资源启用 CDN 加速
   - 配置缓存策略

3. **配置监控和告警**
   - 在 Cloud Monitoring 中设置告警
   - 监控错误率和响应时间

4. **集成 Stripe 支付**
   - 添加 Stripe API 密钥
   - 实现支付处理逻辑

## 参考资源

- [Google Cloud Build 文档](https://cloud.google.com/build/docs)
- [Cloud Run 文档](https://cloud.google.com/run/docs)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
