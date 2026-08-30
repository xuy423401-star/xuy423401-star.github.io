# 线迹之间｜网页版画展

一座可在手机和电脑中浏览的个人线上画展，包含策展长卷、16 幅作品详情和可自由漫游的 3D 白盒子展厅。

## 更新作品文字

作品标题、简介、策展文字和图片路径集中在 `lib/works.ts`。修改后提交到 `main` 分支，GitHub Pages 会自动重新发布。

## 增加作品或摄影展

1. 将压缩后的展示图放入 `public/images`。
2. 在 `lib/works.ts` 中增加对应记录。
3. 按需新增展览入口或章节页面。

## 本地预览

```bash
npm install
npm run dev
```

## 发布

仓库已经包含 GitHub Pages 自动发布流程。将仓库的 Pages 来源设置为 **GitHub Actions** 后，每次推送到 `main` 都会自动构建并发布。
