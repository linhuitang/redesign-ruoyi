export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  // 1. 构造目标 URL（务必使用 https，若依官方演示地址通常强制 https）
  const path = params.path ? params.path.join('/') : '';
  const targetUrl = `https://vue.ruoyi.vip/prod-api/${path}${url.search}`;

  // 2. 克隆请求头并清理
  // 某些 Header（如 content-length）由浏览器/CF 自动管理，手动设置可能报错
  const newHeaders = new Headers(request.headers);
  newHeaders.delete("Host");
  newHeaders.delete("Referer");

  // 设置后端需要的识别头
  newHeaders.set("Host", "vue.ruoyi.vip");
  newHeaders.set("Origin", "https://vue.ruoyi.vip");
  newHeaders.set("Referer", "https://vue.ruoyi.vip/");

  // 3. 构建新的请求对象
  // 使用 request.clone().body 来确保 POST 请求的 body 能被正确转发
  const fetchOptions = {
    method: request.method,
    headers: newHeaders,
    redirect: "follow",
  };

  // 只有非 GET/HEAD 请求才携带 body
  if (request.method !== "GET" && request.method !== "HEAD") {
    fetchOptions.body = request.body;
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);

    // 4. 包装响应，处理跨域（其实同源请求不需要，但为了演示方便加上）
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(`Proxy Error: ${err.message}`, { status: 500 });
  }
}