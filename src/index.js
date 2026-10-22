const TTL_SECONDS = 60 * 60;
const CLEANUP_SECONDS = 60 * 60 * 24 * 2;

function response(body, status = 200, contentType = "text/plain; charset=utf-8") {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "X-Frame-Options": "DENY"
    }
  });
}

function htmlPage(title, message) {
  return response(`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
body{margin:0;background:#111;color:#fff;font-family:Arial,sans-serif;
display:grid;place-items:center;min-height:100vh;text-align:center}
main{padding:28px;max-width:420px}
h1{color:#ff5b5b;font-size:25px}
p{line-height:1.8;color:#ddd}
</style>
</head>
<body><main><h1>${title}</h1><p>${message}</p></main></body>
</html>`, 410, "text/html; charset=utf-8");
}

function json(data, status = 200) {
  return response(JSON.stringify(data), status, "application/json; charset=utf-8");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. 임시 링크 생성: 관리자 인증 필수
    if (path === "/api/create-link" && request.method === "POST") {
      const adminKey = request.headers.get("X-Admin-Key") || "";

      if (!env.ADMIN_KEY || adminKey.length < 16 ||
          adminKey !== env.ADMIN_KEY) {
        return json({ error: "인증에 실패했습니다." }, 401);
      }

      // 32바이트 무작위 토큰
      const bytes = crypto.getRandomValues(new Uint8Array(32));
      const token = Array.from(bytes, b =>
        b.toString(16).padStart(2, "0")
      ).join("");

      // 최초 접속 전에는 만료 시각이 정해지지 않음
      await env.RESCUE_LINKS.put(
        token,
        JSON.stringify({
          createdAt: Date.now(),
          expiresAt: null
        }),
        { expirationTtl: CLEANUP_SECONDS }
      );

      return json({
        url: `${url.origin}/r/${token}`,
        startRule: "최초 접속 시점부터 1시간"
      }, 201);
    }

    // 2. GPS 페이지 직접 접근 차단
    if (path === "/gps.html" || path === "/gps") {
      return response("접근할 수 없는 주소입니다.", 403);
    }

    // 3. 임시 링크 검증 및 최초 접속 시간 기록
    const match = path.match(/^\/r\/([a-f0-9]{64})$/);

    if (match) {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return response("허용되지 않는 요청입니다.", 405);
      }

      const token = match[1];
      const raw = await env.RESCUE_LINKS.get(token, {
        cacheTtl: 30
      });

      if (!raw) {
        return htmlPage(
          "유효하지 않은 링크",
          "링크가 존재하지 않거나 만료되었습니다. 구조대에 새 링크를 요청하세요."
        );
      }

      let record;
      try {
        record = JSON.parse(raw);
      } catch {
        return response("링크 정보를 확인할 수 없습니다.", 500);
      }

      const now = Date.now();

      // 최초 접속에서 만료 시각 설정
      if (record.expiresAt === null) {
        record.expiresAt = now + TTL_SECONDS * 1000;

        await env.RESCUE_LINKS.put(
          token,
          JSON.stringify(record),
          {
            expiration: Math.floor(record.expiresAt / 1000)
          }
        );
      }

      // 서버 시각 기준으로 만료 여부 검사
      if (now >= record.expiresAt) {
        return htmlPage(
          "링크 만료",
          "이 구조 요청 링크는 1시간이 지나 만료되었습니다. 현재 위치 확인이 필요하면 구조대에 새 링크를 요청하세요."
        );
      }

      // 토큰이 유효한 경우에만 GPS HTML을 전달
      const assetURL = new URL("/gps.html", url.origin);
      const assetRequest = new Request(assetURL.toString(), {
        method: request.method,
        headers: request.headers
      });

      const asset = await env.ASSETS.fetch(assetRequest);

      if (!asset.ok) {
        return response("GPS 페이지 파일을 찾을 수 없습니다.", 500);
      }

      const headers = new Headers(asset.headers);
      headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      headers.set("Referrer-Policy", "no-referrer");
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("X-Frame-Options", "DENY");

      return new Response(
        request.method === "HEAD" ? null : asset.body,
        { status: 200, headers }
      );
    }

    // 4. 그 외 페이지 및 정적 파일 제공
    return env.ASSETS.fetch(request);
  }
};
