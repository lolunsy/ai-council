"use strict";(()=>{var e={};e.id=239,e.ids=[239],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7546:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>d,patchFetch:()=>g,requestAsyncStorage:()=>l,routeModule:()=>u,serverHooks:()=>h,staticGenerationAsyncStorage:()=>m});var o={};r.r(o),r.d(o,{POST:()=>c});var n=r(9303),i=r(8716),s=r(670),a=r(7070),p=r(1443);async function c(e){try{let{topic:t,role:r,followUp:o,settings:n}=await e.json();if(!t||!r||!n)return a.NextResponse.json({error:"Missing topic, role or settings"},{status:400});let i=await (0,p.VD)({settings:n,messages:[{role:"system",content:(0,p.dF)(r)},{role:"user",content:(0,p.Wb)(t,o)}],temperature:.7}),s=(0,p.wf)(i);return a.NextResponse.json({id:`report-${r.id}-${Date.now()}`,roleId:r.id,speaker:r.name,summary:s.summary,content:s.content,reasoning:s.reasoning})}catch(e){return a.NextResponse.json({error:"Server error",detail:e instanceof Error?e.message:String(e)},{status:500})}}let u=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/chat/role/route",pathname:"/api/chat/role",filename:"route",bundlePath:"app/api/chat/role/route"},resolvedPagePath:"C:\\Users\\小智\\Desktop\\ai-council\\ai-council\\src\\app\\api\\chat\\role\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:l,staticGenerationAsyncStorage:m,serverHooks:h}=u,d="/api/chat/role/route";function g(){return(0,s.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:m})}},1443:(e,t,r)=>{async function o(e){let t;let r=function(e,t){let r=(t||"").trim().replace(/\/+$/,"");return r?"openrouter"===e?" `https://openrouter.ai` "===r||" `https://openrouter.ai/api/v1` "===r||" `https://openrouter.ai/api/v1/chat/completions` "===r?" `https://openrouter.ai/api/v1/chat/completions` ":r.endsWith("/chat/completions")?r:r.endsWith("/api/v1")||r.endsWith("/v1")?`${r}/chat/completions`:`${r}/api/v1/chat/completions`:r.endsWith("/chat/completions")?r:r.endsWith("/api/v1")||r.endsWith("/v1")?`${r}/chat/completions`:`${r}/v1/chat/completions`:"openrouter"===e?" `https://openrouter.ai/api/v1/chat/completions` ":""}(e.settings.providerType,e.settings.baseUrl);if(!r)throw Error("缺少有效的 API 地址，请先在会议设置中填写。");let o=function(e,t){if(!t)throw Error("缺少 API Key，请先在右上角会议设置中填写。");return"raw"===e?{Authorization:t}:{Authorization:`Bearer ${t}`}}(e.settings.authMode,e.settings.apiKey),n=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json",...o,"HTTP-Referer":" `https://ai-council-03sb.onrender.com` ","X-OpenRouter-Title":"AI Council"},body:JSON.stringify({model:e.settings.model,messages:e.messages,temperature:e.temperature??.7})}),i=await n.text();if(!n.ok)throw Error(`上游模型请求失败 ${n.status} | URL: ${r} | ${i.slice(0,300)}`);try{t=JSON.parse(i)}catch{throw Error(`上游返回了非 JSON 内容 | URL: ${r} | ${i.slice(0,300)}`)}return t?.choices?.[0]?.message?.content||""}function n(e){let t=e.indexOf("## 推演过程");if(-1===t)return{summary:e.slice(0,120).trim()||"暂无摘要",content:e,reasoning:"## 推演过程\n暂无单独推演内容。"};let r=e.slice(0,t).trim(),o=e.slice(t).trim();return{summary:r.replace(/[#>*`-]/g," ").replace(/\s+/g," ").trim().slice(0,100)||"暂无摘要",content:r,reasoning:o}}function i(e){return`
你正在参加一个企业决策会议。

你的角色名称：${e.name}
你的角色设定：${e.prompt}

请始终站在该角色立场发言，不要中立，不要模糊。
必须给出明确分析理由，而不是空泛表态。
输出必须使用中文 Markdown。
请严格按以下结构输出：

## 核心判断
先给出明确结论。

## 关键分析理由
至少给出 3 条具体理由，每条都要解释为什么。

## 建议
给出结构化建议，使用列表。

## 风险与补充说明
说明你最担心的点。

## 推演过程
写出你形成判断的分析路径，不能只重复结论。
`.trim()}function s(e,t){return`
当前议题：
${e}

${t?`主持人补充信息：
${t}
`:""}

请围绕当前议题给出完整判断。
`.trim()}function a(){return`
你是这场会议的裁判长。
你需要阅读所有角色观点，做出折中、清晰、可执行的最终裁决。

输出必须使用中文 Markdown。
请严格按以下结构输出：

## 最终裁决
先给出拍板结论。

## 最终方案
用列表给出执行方案。

## 为什么这样定
解释裁决逻辑，必须明确引用不同角色的观点差异。

## 推演过程
简要说明你如何平衡各方意见。
`.trim()}function p(e,t,r){return`
当前议题：
${e}

${r?`主持人补充信息：
${r}
`:""}

以下是各角色发言：

${t.map((e,t)=>`
### 角色 ${t+1}：${e.speaker}
${e.content}
`).join("\n")}

请综合所有观点给出最终裁决。
`.trim()}r.d(t,{VD:()=>o,Wb:()=>s,dF:()=>i,k5:()=>p,sx:()=>a,wf:()=>n})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972],()=>r(7546));module.exports=o})();