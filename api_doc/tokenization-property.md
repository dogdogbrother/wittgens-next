## 文档上传
- 接口：`POST /api/v1/app/project/upload/documents`
- 表单字段：`files`
- 文件类型：仅支持 `pdf`
- 数量限制：最多 `10` 个文件
- 单文件限制：最多 `20MB`

返回字段：

| 字段 | 说明 |
| --- | --- |
| `fileName` | 原始文件名 |
| `fileUrl` | 文件访问地址，可直接回填到项目草稿 |
| `contentType` | 文件 MIME 类型 |
| `size` | 文件大小，单位字节 |


## 图片上传
- 接口：`POST /api/v1/app/project/upload/images`
- 表单字段：`files`
- 文件类型：支持 `jpg`、`jpeg`、`png`、`webp`
- 数量限制：最多 `20` 个文件
- 单文件限制：最多 `10MB`

返回字段与文档上传一致。

## 提交接口

- 接口：`POST /api/v1/app/project`
提交很有多模块,我分开拆解.

### issuer
| 字段 | 说明 |
| --- | --- |
| `firstName` | 联系人名 |
| `lastName` | 联系人姓 |
| `email` | 联系邮箱 |
| `phoneCode` | 国际区号 |
| `phone` | 联系电话 |
| `institution` | 机构名称 |

### property
| 字段 | 说明 |
| --- | --- |
| `countryCode` | 国家编码 Country/Region下的value |
| `country` | 国家名称 Country/Region下的label |
| `street` | 街道地址 Street address |
| `unit` | 房号或单元 Apt, floor, bldg (if applicable) |
| `city` | 城市 City/town/village |
| `region` | 州、省或地区 Province/state/territory |
| `postal` | 邮编 Postal code (if applicable)|
| `location` | 对外展示位置 |
| `area` | 房产面积 Property Size的输入值 |
| `areaUnit` | 面积单位 Property Size的选择框 值是`ft`和`m` |
| `stage` | 项目阶段 Lifecycle Stage,值是`existing`和`under_construction` |
| `age` | 房龄 |
| `propertyType` | 房产类型 Commercial Type 值有`retail` `office` `tourism_hospitality` `industrial_logistics` `mixed_use`|
| `useOfProceeds` | 融资用途 Use of Proceeds |
| `valuation` | 房产估值 Expected Valuation(USD) |
| `description` | 项目描述 Property Description (Available in your preferred language) |

### Mint Token

| 字段 | 说明 |
| --- | --- |
| `tokenName` | 房产代币名称 |
| `tokenSymbol` | 房产代币符号 |
| `supply` | 发行总量，传最小单位整数值 |

### Property Document 和 Property Photos

| 字段 | 说明 |
| --- | --- |
| `documents` | 项目文档数组，至少 1 条 |
| `photos` | 项目图片数组，至少 1 条 |
| `remark` | 备注 |