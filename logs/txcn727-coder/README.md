# AI Coding 日志（统一归集）

旧批次（2026-08）与新批次（2026-08-11 开发期）已合并至本目录。**时间标注**：

- 目录名 = 会话日期（如 `2026-08-16/`）
- 2026-08 旧批次文件名带 `2026-08-` 前缀
- `manifest.json` 每条含 `started_at` / `last_event_at` 精确时间

## 时间线

| 时间 | 会话 | 文件 |
| --- | --- | --- |
| 2026-08-01 ~ 2026-08-31 | 下载清单添加便签功能 | — |
| 2026-08-02 ~ 2026-08-04 | 早期探索与 UI 指令沉淀（checkpoint 快照） | `2026-08/2026-08-checkpoint-cloud-history.md`<br>`2026-08/2026-08-checkpoint-completed-deliveries.md`<br>`2026-08/2026-08-checkpoint-ui-directives.md`<br>`2026-08/2026-08-checkpoint-ui-specs.md`<br>`2026-08/2026-08-checkpoint-ui-stable.md`<br>`2026-08/2026-08-checkpoint.md`<br>`2026-08/2026-08-notes.md` |
| 2026-08-16 ~ 2026-09-10 | 询问记忆与对话丢失问题 | `2026-08-16/mimocode__ses_ff744e7e3ffeYiteV7HVVdRQR8.jsonl` |
| 2026-09-27 ~ 2026-09-27 | 你好 | `2026-09-27/mimocode__ses_ffe5f1ee759c3ffeA9I25aVjLF.jsonl` |
| 2026-09-27 ~ 2026-09-27 | 查看你的记忆以及@vela开发文档.md 后告诉我 | `2026-09-27/mimocode__ses_ffe5f1ee370c0ffevBPQyRxNRr.jsonl` |
| 2026-09-27 ~ 2026-09-28 | 你好（问候） | `2026-09-27/mimocode__ses_ffe5f1ec0abccffew0epgJtEvF.jsonl` |
| 2026-10-11 ~ 2026-10-30 | 查阅vela开发文档.md继续项目开发 | `2026-10-11/mimocode__ses_ffe5ed6be4240ffeY2vwe0dfNw.jsonl` |
| 2026-10-16 ~ 2026-10-16 | 简单问候：你好 | `2026-10-16/mimocode__ses_ffe5ebaee2b52ffeFRDsFwX6KK.jsonl` |
| 2026-10-31 ~ 2026-11-01 | 查看上一对话并阅读vela开发文档.md | `2026-10-31/mimocode__ses_ffe5e6fd5a302ffeZJMvx73ohW.md`（完整会话导出） |

各会话详情与事件数见 `manifest.json`。jsonl 事件含 `seq`（递增序号）、`t`（毫秒时间戳）、`kind`（text/thinking/tool）字段；`2026-10-31` 会话为完整对话导出（.md），覆盖此前的中途 jsonl 快照。
