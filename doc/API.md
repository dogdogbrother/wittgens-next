# RWAT Platform API 文档

> 后端接口地址：`http://151.241.216.192:8000`  
> Swagger 原始文档：`http://151.241.216.192:8000/swagger/app/doc.json`  
> 认证方式：所有需要登录的接口，在 Header 中传 `Authorization: Bearer <accessToken>`

---

## 目录

- [App Auth - 认证](#app-auth---认证)
- [App Market - 市场](#app-market---市场)
- [App Project - 项目](#app-project---项目)
- [App Dividend Order - 分红订单](#app-dividend-order---分红订单)
- [App Income - 收益分配](#app-income---收益分配)
- [App Issuer Claim - 发行方提取](#app-issuer-claim---发行方提取)
- [App Redemption Request - 赎回申请](#app-redemption-request---赎回申请)
- [App Project Withdraw - 项目提款](#app-project-withdraw---项目提款)
- [App User - 用户](#app-user---用户)
- [数据结构定义](#数据结构定义)

---

## App Auth - 认证

### POST `/api/v1/app/auth/nonce`
获取钱包登录用的 Nonce（签名消息）

**请求体：**
```json
{ "wallet": "0x..." }
```

**返回：**
```json
{
  "nonce": "string",
  "message": "string",
  "wallet": "0x...",
  "expiredAt": "2025-01-01T00:00:00Z"
}
```

---

### POST `/api/v1/app/auth/login`
验证钱包签名，返回 accessToken 和 refreshToken

**请求体：**
```json
{
  "wallet": "0x...",
  "nonce": "string",
  "signature": "string",
  "inviteCode": "string" // 可选
}
```

**返回：** `dto.LoginResp`
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "accessExpireAt": "string",
  "refreshExpireAt": "string",
  "user": { /* AppUserProfile */ }
}
```

---

### POST `/api/v1/app/auth/refresh`
用 refreshToken 刷新 accessToken

**请求体：**
```json
{ "refreshToken": "string" }
```

**返回：** 同 Login 返回结构

---

## App Market - 市场

### GET `/api/v1/app/market/investments` 🔐
获取当前用户的投资汇总列表（分页）  
**用于页面：** `Marketplace` 的「My Investment」按钮弹窗

**Query 参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| keyword | string | 搜索关键词 |
| pageSize | integer | 每页条数 |
| pageIndex | integer | 页码 |

**返回列表项：** `dto.MarketAppInvestmentItem`
```json
{
  "projectId": 1,
  "assetName": "string",
  "symbol": "string",
  "contract": "0x...",
  "sharesHeld": "1000",
  "heldRatio": "0.05",
  "spent": "500.00",
  "claimableTokens": "100",
  "claimableEarnings": "20.5",
  "redemptionAmount": "0",
  "redemptionAt": "string",
  "canClaimTokens": true,
  "canClaimEarnings": true,
  "canRedeem": false
}
```

---

### GET `/api/v1/app/market/symbols` 🔐
获取活跃的市场交易对列表（Open Market 使用）

**Query 参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| keyword | string | 关键词 |
| quoteSymbol | string | 计价币种 |
| pageSize | integer | 每页条数 |
| pageIndex | integer | 页码 |

**返回列表项：** `dto.MarketAppSymbolItem`
```json
{
  "id": 1,
  "symbol": "RWAT-PRO-01/USDT",
  "baseAsset": "RWAT-PRO-01",
  "baseAssetId": 1,
  "baseAssetRefId": 1,
  "baseAssetType": "string",
  "quoteSymbol": "USDT",
  "quoteAssetId": 2,
  "quoteAssetType": "string",
  "projectId": 1,
  "projectTitle": "string",
  "projectToken": "0x...",
  "status": "active",
  "createdAt": "string",
  "updatedAt": "string"
}
```

---

### GET `/api/v1/app/market/symbols/{id}/book` 🔐
获取指定交易对的订单簿（Order Book）  
**用于页面：** `Trading` 页订单簿组件

**Path 参数：** `id` - 交易对 ID

**返回：** `dto.MarketOrderBook`
```json
{
  "symbolId": 1,
  "symbol": "RWAT-PRO-01/USDT",
  "baseAsset": "RWAT-PRO-01",
  "quoteAsset": "USDT",
  "bids": [{ "price": "0.5", "quantity": "100", "orders": 3 }],
  "asks": [{ "price": "0.6", "quantity": "200", "orders": 5 }]
}
```

---

### GET `/api/v1/app/market/orders` 🔐
获取当前用户的市场订单历史（分页）  
**用于页面：** `Trading` 页订单列表

**Query 参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| symbolId | integer | 交易对 ID |
| status | string | 订单状态 |
| side | string | 买卖方向 buy/sell |
| pageSize | integer | 每页条数 |
| pageIndex | integer | 页码 |

**返回列表项：** `dto.MarketAppOrderItem`
```json
{
  "id": 1,
  "orderNo": "string",
  "symbolId": 1,
  "symbol": "RWAT-PRO-01/USDT",
  "side": "buy",
  "orderType": "limit",
  "price": "0.5",
  "quantity": "100",
  "filledQuantity": "50",
  "remainingQuantity": "50",
  "avgPrice": "0.5",
  "status": "partial",
  "sourceType": "string",
  "feeAmount": "0.1",
  "feeSymbol": "USDT",
  "feeRateBpsSnapshot": 10,
  "createdAt": "string",
  "updatedAt": "string",
  "canceledAt": "string"
}
```

---

### POST `/api/v1/app/market/orders` 🔐
创建市场限价订单

**请求体：** `dto.MarketAppOrderCreateReq`
```json
{
  "symbolId": 1,
  "side": "buy",
  "orderType": "limit",
  "price": "0.5",
  "quantity": "100",
  "remark": "string" // 可选
}
```

**返回：** `dto.MarketAppOrderDetail`

---

### GET `/api/v1/app/market/orders/{id}` 🔐
获取单个订单详情

---

### PUT `/api/v1/app/market/orders/{id}/cancel` 🔐
取消订单，释放冻结余额

---

## App Project - 项目

### GET `/api/v1/app/project` 🔐
获取当前用户的项目列表（支持按状态筛选）  
**用于页面：** `Tokenize` 模块

**Query 参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| status | string | 项目状态 |
| keyword | string | 关键词 |
| pageSize | integer | 每页条数 |
| pageIndex | integer | 页码 |

---

### POST `/api/v1/app/project` 🔐
创建项目草稿

**必填字段：** age, area, areaUnit, city, country, countryCode, description, documents, email, firstName, lastName, phone, phoneCode, photos, stage, street, supply, tokenName, tokenSymbol, valuation

---

### GET `/api/v1/app/project/{projectId}` 🔐
获取项目详情

---

### PUT `/api/v1/app/project/{projectId}` 🔐
更新草稿或被拒项目

---

### POST `/api/v1/app/project/{projectId}/submit` 🔐
提交项目审核

---

### GET `/api/v1/app/project/{projectId}/workbench` 🔐
获取项目工作台聚合数据

**返回：** `dto.ProjectWorkbench`
```json
{
  "projectId": 1,
  "projectNo": "string",
  "title": "string",
  "tokenName": "string",
  "tokenSymbol": "string",
  "totalSupply": "string",
  "tokenizedValue": "string",
  "tokenizationStatus": "string",
  "presaleStatus": "string",
  "bootstrapStatus": "string",
  "bootstrapAmount": "string",
  "withdrawStatus": "string",
  "submissionAt": "string",
  "completionAt": "string",
  "depositAt": "string",
  "claimAt": "string"
}
```

---

## App Dividend Order - 分红订单

### GET `/api/v1/app/project/{projectId}/dividend-orders` 🔐
获取项目分红订单列表

**Query 参数：** bizType, status, proofType, pageSize, pageIndex

---

### GET `/api/v1/app/project/{projectId}/dividend-orders/summary` 🔐
获取已确认的分红订单汇总

**返回：**
```json
{
  "confirmedAmount": "string",
  "confirmedCount": 10,
  "lastConfirmedAt": "string"
}
```

---

### GET `/api/v1/app/project/{projectId}/dividend-orders/{id}` 🔐
获取单个分红订单详情

---

## App Income - 收益分配

### GET `/api/v1/app/project/{projectId}/income-batches` 🔐
获取收益分配批次列表（项目所有者）

**Query 参数：** status, bizType, pageSize, pageIndex

---

### POST `/api/v1/app/project/{projectId}/income-batches` 🔐
创建一次收益分配批次

**请求体：**
```json
{
  "rewardAmount": "1000",  // 必填
  "bizType": "string",
  "holdingBatchId": 1,
  "remark": "string"
}
```

---

### GET `/api/v1/app/project/{projectId}/income-batches/summary` 🔐
获取创建收益批次时的上下文摘要（最新持仓批次、资金提示等）

---

### GET `/api/v1/app/project/{projectId}/income-batches/{id}` 🔐
获取收益分配批次详情

---

### GET `/api/v1/app/project/{projectId}/income-claims` 🔐
获取当前用户在该项目的收益领取记录

**Query 参数：** status, pageSize, pageIndex

---

### GET `/api/v1/app/project/{projectId}/income-claims/{id}` 🔐
获取单条收益领取记录详情

---

### PUT `/api/v1/app/project/{projectId}/income-claims/{id}/claim` 🔐
执行收益领取  
**用于页面：** ICO Market 列表的「Claim Returns」按钮

---

## App Issuer Claim - 发行方提取

### GET `/api/v1/app/project/{projectId}/issuer-claims` 🔐
获取发行方提取申请列表

**Query 参数：** status, claimType, pageSize, pageIndex

---

### POST `/api/v1/app/project/{projectId}/issuer-claims` 🔐
创建发行方提取申请

**请求体：**
```json
{
  "claimType": "string",  // 必填
  "grossAmount": "string" // 必填
}
```

---

### GET `/api/v1/app/project/{projectId}/issuer-claims/{id}` 🔐
获取发行方提取详情

---

## App Redemption Request - 赎回申请

### GET `/api/v1/app/project/{projectId}/redemption-requests` 🔐
获取赎回申请列表  
**用于页面：** ICO Market / My Investment 的「Redeem」按钮

**Query 参数：** status, pageSize, pageIndex

---

### POST `/api/v1/app/project/{projectId}/redemption-requests` 🔐
创建赎回申请

**请求体：**
```json
{ "amount": "string" }
```

---

### GET `/api/v1/app/project/{projectId}/redemption-requests/{id}` 🔐
获取赎回申请详情

---

## App Project Withdraw - 项目提款

### GET `/api/v1/app/project/{projectId}/withdraws` 🔐
获取项目提款申请列表

**Query 参数：** status, pageSize, pageIndex

---

### POST `/api/v1/app/project/{projectId}/withdraws` 🔐
创建提款申请

**请求体：**
```json
{
  "wallet": "0x...",
  "remark": "string"
}
```

---

### PUT `/api/v1/app/project/{projectId}/withdraws/{id}/claim` 🔐
确认提款（提交链上 txHash）

**请求体：**
```json
{ "txHash": "0x..." }
```

---

## App User - 用户

### GET `/api/v1/app/user/profile` 🔐
获取当前登录用户的 Profile

**返回：** `dto.AppUserProfile`
```json
{
  "id": 1,
  "userNo": "string",
  "wallet": "0x...",
  "status": "string",
  "registerType": "string",
  "inviteCode": "string",
  "inviterId": 0,
  "lastLoginAt": "string",
  "createdAt": "string"
}
```

---

## 数据结构定义

### 通用响应结构
```json
{
  "code": 200,
  "status": "OK",
  "msg": "string",
  "requestId": "string",
  "data": { /* 具体数据 */ }
}
```

### 分页结构
```json
{
  "count": 100,
  "pageIndex": 1,
  "pageSize": 10,
  "list": []
}
```

### MarketAppInvestmentItem（投资汇总条目）
| 字段 | 类型 | 说明 |
|------|------|------|
| projectId | integer | 项目 ID |
| assetName | string | 资产名称 |
| symbol | string | 代币符号 |
| contract | string | 合约地址 |
| sharesHeld | string | 持有份额 |
| heldRatio | string | 持仓比例 |
| spent | string | 投入资金（USDT） |
| claimableTokens | string | 可领取代币数 |
| claimableEarnings | string | 可领取收益 |
| redemptionAmount | string | 赎回金额 |
| redemptionAt | string | 赎回时间 |
| canClaimTokens | boolean | 是否可领取代币 |
| canClaimEarnings | boolean | 是否可领取收益 |
| canRedeem | boolean | 是否可赎回 |

### MarketAppSymbolItem（交易对条目）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 交易对 ID |
| symbol | string | 交易对名称 |
| baseAsset | string | 基础资产 |
| quoteSymbol | string | 计价币种 |
| projectId | integer | 所属项目 ID |
| projectTitle | string | 项目名称 |
| status | string | 状态 |

### MarketAppOrderItem（订单条目）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 订单 ID |
| orderNo | string | 订单编号 |
| symbol | string | 交易对 |
| side | string | buy / sell |
| orderType | string | limit |
| price | string | 挂单价格 |
| quantity | string | 委托数量 |
| filledQuantity | string | 已成交数量 |
| remainingQuantity | string | 剩余数量 |
| avgPrice | string | 均成交价 |
| status | string | 订单状态 |
| feeAmount | string | 手续费 |
| feeSymbol | string | 手续费币种 |

### ProjectDetail（项目详情）
关键字段：id, projectNo, title, status, tokenName, tokenSymbol, supply, valuation, token（合约地址）, chainId, chainStatus, ownerId

---

## 接口与页面对应关系速查

| 接口 | 对应页面/功能 |
|------|-------------|
| `POST /auth/nonce` | 钱包登录第一步 |
| `POST /auth/login` | 钱包登录第二步 |
| `POST /auth/refresh` | Token 自动刷新 |
| `GET /market/investments` | Marketplace「My Investment」弹窗 |
| `GET /market/symbols` | Open Market 列表数据 |
| `GET /market/symbols/{id}/book` | Trading 页订单簿 |
| `GET /market/orders` | Trading 页「我的订单」列表 |
| `POST /market/orders` | Trading 页下单 |
| `PUT /market/orders/{id}/cancel` | Trading 页取消订单 |
| `GET /project` | Tokenize 我的项目列表 |
| `POST /project` | Tokenize 提交表单 |
| `GET /project/{id}/workbench` | Tokenize 项目工作台 |
| `PUT /project/{id}/income-claims/{id}/claim` | ICO Market「Claim Returns」 |
| `POST /project/{id}/redemption-requests` | ICO Market「Redeem」 |
| `GET /user/profile` | 用户信息展示 |
