# 鳌太 · 众人之路

> "不是你征服了这座山，是这座山暂时宽恕了你。"

一款基于真实鳌太穿越路线的 **多人异步生存决策游戏**。每一局15-20分钟，在随机天气、突发事件和有限物资中，做出属于你的选择。

## 在线体验

**https://aruun1212.github.io/aotai-game/**

## 游戏特色

### 异步多人互助
- **营地物资架** — 在营地留下物资给后来的旅人，或取走前人留下的补给
- **坏档系统** — 死亡后你的痕迹留在山上，后来者可以发现并记录你
- **足迹世界** — 首页实时展示历代旅人的路线轨迹
- **好人榜** — 留下物资次数 & 救助旅人数排行

### 硬核生存
- 112格精细路线，每格约1.3km真实地理距离
- 71个随机事件 + 叙事氛围系统
- 脱水/失温/力竭致命状态 + 装备策略
- 5条下撤路线，活着走出来就是最大的胜利

### 沉浸式体验
- MapLibre 3D卫星地图实时跟随
- 天气氛围雾效 + 受伤红色遮罩
- 背景音乐 + 音效系统
- 移动端适配

## 技术栈

- Vue 3 + TypeScript + Vite
- Pinia 状态管理
- MapLibre GL JS + MapTiler 3D地形
- Supabase (PostgreSQL + Auth + Realtime)
- GitHub Pages 部署

## 本地开发

```bash
npm install
npm run dev
```

需要在 `.env` 中配置：
```
VITE_MAPTILER_KEY=your_maptiler_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 版权声明

本项目为个人学习和娱乐目的创作的开源项目。

### 音频素材
- **背景音乐**: Daniel Pemberton - "The Rescue" (From *The Rescue* Score)，版权归原作者及发行方所有，本项目仅作非商业学习用途使用。
- **音效素材**: 部分音效素材来源于网络（Bilibili），版权归原作者所有，仅作非商业用途使用。

如有侵权，请联系作者删除。

### 地理数据
路线坐标基于公开的鳌太穿越 GPX 轨迹数据校准，卫星地图由 MapTiler 提供。

## 作者

[@aruun1212](https://github.com/aruun1212)

## License

MIT
