// functions/api/[[path]].js

export async function onRequest(context) {
  const { request, params } = context;

  // 1. 获取原始请求的路径（除去 /api 部分）
  const url = new URL(request.url);
  const path = params.path.join('/');
  const search = url.search;

  // 2. 构造指向若依官方演示环境的请求地址
  // 官方地址示例：http://vue.ruoyi.vip/prod-api/
  const targetUrl = `http://vue.ruoyi.vip/prod-api/${path}${search}`;

  // 3. 复制原始请求头，并处理可能导致问题的字段
  const newRequestHeaders = new Headers(request.headers);
  newRequestHeaders.set("Host", "vue.ruoyi.vip");
  newRequestHeaders.set("Referer", "http://vue.ruoyi.vip/");

  // 4. 发起转发请求
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: newRequestHeaders,
    body: request.body,
    redirect: "manual",
  });

  const response = await fetch(modifiedRequest);

  // 5. 修改响应头以允许跨域（虽然同源请求不需要，但为了保险可以加上）
  const newResponseHeaders = new Headers(response.headers);
  newResponseHeaders.set("Access-Control-Allow-Origin", "*");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newResponseHeaders,
  });
}