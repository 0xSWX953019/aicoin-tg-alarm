export default {
  async fetch(request, env, ctx) {
    const BOT_TOKEN = "8735275360:AAF3jU1nDz7anmQe2Og9IBuPoLDQQZKQDd0";
    const CHAT_ID = "-1003789152762";
    const url = new URL(request.url);

    // 重点：只有匹配到这个完全不带 aicoin 敏感词的自定义安全路径，才执行转发
    if (url.pathname === "/v1/secure/tx-notifier") {
      
      if (request.method === "GET" || request.headers.get("Content-Length") === "0") {
        return new Response("success", { status: 200, headers: { "Content-Type": "text/plain" } });
      }

      if (request.method === "POST") {
        try {
          const data = await request.json();
          let tgText = `🚨 *【AICoin 价格预警】* 🚨\n\n`;
          tgText += `• *交易标的:* ${data.pairs || "未知"}\n`;
          tgText += `• *当前价格:* ${data.price || "未知"}\n`;
          tgText += `• *预警详情:* ${data.msg || data.content || "策略触发"}\n`;

          ctx.waitUntil(
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: CHAT_ID, text: tgText, parse_mode: "Markdown" })
            })
          );
          return new Response("success", { status: 200 });
        } catch (e) {
          return new Response("success", { status: 200 });
        }
      }
    }

    // 默认其他路径（包括根路径）直接返回 success，迷惑嗅探插件
    return new Response("success", { status: 200 });
  }
};
