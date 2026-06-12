export default {
  async fetch(request, env, ctx) {
    const BOT_TOKEN = "8735275360:AAF3jU1nDz7anmQe2Og9IBuPoLDQQZKQDd0";
    const CHAT_ID = "-1003789152762";

    // 1. 无条件通过 AICoin 的验证机制
    if (request.method === "GET" || request.headers.get("Content-Length") === "0") {
      return new Response("success", { 
        status: 200, 
        headers: { "Content-Type": "text/plain" } 
      });
    }

    // 2. 接收实际的价格预警并并发转发至 Telegram
    if (request.method === "POST") {
      try {
        const data = await request.json();
        
        let tgText = `🚨 *【AICoin 价格预警】* 🚨\n\n`;
        tgText += `• *交易标的:* ${data.pairs || "未知"}\n`;
        tgText += `• *当前价格:* ${data.price || "未知"}\n`;
        tgText += `• *预警详情:* ${data.msg || data.content || "策略触发"}\n`;

        // 使用 ctx.waitUntil 保证请求异步安全发送，不卡住 AICoin 的返回
        ctx.waitUntil(
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: tgText,
              parse_mode: "Markdown"
            })
          })
        );

        return new Response("success", { status: 200 });
      } catch (e) {
        return new Response("success", { status: 200 });
      }
    }

    return new Response("success", { status: 200 });
  }
};
