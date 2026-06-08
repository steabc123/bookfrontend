 # ProcessOn E-R图绘制指南

## 实体列表及属性

### 1. USER（用户表）
**主键：** userId  
**属性：**
- userId (PK) - 用户ID
- username - 用户名
- password - 密码
- role - 角色（admin/user）
- status - 状态（1启用/0禁用）
- createTime - 注册时间

---

### 2. CATEGORY（图书分类表）
**主键：** categoryId  
**属性：**
- categoryId (PK) - 分类ID
- categoryName - 分类名称
- description - 分类描述

---

### 3. BOOK（图书表）
**主键：** bookId  
**外键：** categoryId → CATEGORY  
**属性：**
- bookId (PK) - 图书ID
- bookName - 书名
- author - 作者
- publisher - 出版社
- isbn - ISBN编号
- price - 价格
- stock - 库存数量
- categoryId (FK) - 分类ID
- coverImage - 封面图片路径

---

### 4. CART_ITEM（购物车项表）
**主键：** cartItemId  
**外键：** userId → USER, bookId → BOOK  
**属性：**
- cartItemId (PK) - 购物车项ID
- userId (FK) - 用户ID
- bookId (FK) - 图书ID
- bookName - 书名（冗余）
- author - 作者（冗余）
- price - 价格（快照）
- quantity - 数量
- createTime - 添加时间

---

### 5. ORDER（订单表）
**主键：** orderId  
**外键：** userId → USER  
**属性：**
- orderId (PK) - 订单ID
- userId (FK) - 用户ID
- username - 用户名（冗余）
- totalAmount - 订单总金额
- orderStatus - 订单状态（0未支付/1未发货/2已发货/3已收货）
- createTime - 下单时间
- payTime - 支付时间
- shipTime - 发货时间
- receiveTime - 收货时间

---

### 6. ORDER_ITEM（订单项表）
**主键：** orderItemId  
**外键：** orderId → ORDER, bookId → BOOK  
**属性：**
- orderItemId (PK) - 订单项ID
- orderId (FK) - 订单ID
- bookId (FK) - 图书ID
- bookName - 书名（冗余）
- price - 单价（快照）
- quantity - 数量

---

### 7. BORROW_RECORD（借阅记录表）
**主键：** recordId  
**外键：** userId → USER, bookId → BOOK  
**属性：**
- recordId (PK) - 借阅记录ID
- userId (FK) - 用户ID
- bookId (FK) - 图书ID
- bookName - 书名（冗余）
- borrowTime - 借阅时间
- returnTime - 归还时间
- borrowStatus - 借阅状态（0借阅中/1已归还）

---

## 实体关系连线

### 一对多关系（1:N）

1. **USER → CART_ITEM**
   - 关系：一个用户可以有多个购物车项
   - 基数：1:N
   - 说明：userId 作为外键在 CART_ITEM 中

2. **USER → ORDER**
   - 关系：一个用户可以下多个订单
   - 基数：1:N
   - 说明：userId 作为外键在 ORDER 中

3. **USER → BORROW_RECORD**
   - 关系：一个用户可以有多条借阅记录
   - 基数：1:N
   - 说明：userId 作为外键在 BORROW_RECORD 中

4. **CATEGORY → BOOK**
   - 关系：一个分类可以包含多本图书
   - 基数：1:N
   - 说明：categoryId 作为外键在 BOOK 中

5. **BOOK → CART_ITEM**
   - 关系：一本图书可以被添加到多个购物车项
   - 基数：1:N
   - 说明：bookId 作为外键在 CART_ITEM 中

6. **BOOK → ORDER_ITEM**
   - 关系：一本图书可以出现在多个订单项中
   - 基数：1:N
   - 说明：bookId 作为外键在 ORDER_ITEM 中

7. **BOOK → BORROW_RECORD**
   - 关系：一本图书可以有多条借阅记录
   - 基数：1:N
   - 说明：bookId 作为外键在 BORROW_RECORD 中

8. **ORDER → ORDER_ITEM**
   - 关系：一个订单可以包含多个订单项
   - 基数：1:N
   - 说明：orderId 作为外键在 ORDER_ITEM 中

---

## ProcessOn 绘制步骤

### 方法一：手动绘制

1. **打开 ProcessOn**
   - 访问 https://www.processon.com/
   - 创建新图表 → 选择 "ER图" 或 "数据库设计"

2. **添加实体**
   - 从左侧工具栏拖拽 "实体" 到画布
   - 为每个实体命名（USER, CATEGORY, BOOK等）
   - 双击实体添加属性，标记主键(PK)和外键(FK)

3. **建立关系**
   - 使用 "关系线" 连接相关实体
   - 设置关系类型为一对多（1:N）
   - 在连线上标注关系名称（如"拥有"、"包含"等）

4. **调整布局**
   - 建议布局：
     ```
     左侧：USER, CATEGORY
     中间：BOOK, CART_ITEM
     右侧：ORDER, ORDER_ITEM, BORROW_RECORD
     ```

### 方法二：使用XML导入（如果ProcessOn支持）

以下是标准的ERD XML格式，您可以尝试导入：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ERDiagram>
    <entities>
        <entity name="USER" x="100" y="100">
            <attribute name="userId" type="int" primaryKey="true"/>
            <attribute name="username" type="string"/>
            <attribute name="password" type="string"/>
            <attribute name="role" type="string"/>
            <attribute name="status" type="int"/>
            <attribute name="createTime" type="datetime"/>
        </entity>
        
        <entity name="CATEGORY" x="100" y="400">
            <attribute name="categoryId" type="int" primaryKey="true"/>
            <attribute name="categoryName" type="string"/>
            <attribute name="description" type="string"/>
        </entity>
        
        <entity name="BOOK" x="400" y="250">
            <attribute name="bookId" type="int" primaryKey="true"/>
            <attribute name="bookName" type="string"/>
            <attribute name="author" type="string"/>
            <attribute name="publisher" type="string"/>
            <attribute name="isbn" type="string"/>
            <attribute name="price" type="decimal"/>
            <attribute name="stock" type="int"/>
            <attribute name="categoryId" type="int" foreignKey="true"/>
            <attribute name="coverImage" type="string"/>
        </entity>
        
        <entity name="CART_ITEM" x="700" y="100">
            <attribute name="cartItemId" type="int" primaryKey="true"/>
            <attribute name="userId" type="int" foreignKey="true"/>
            <attribute name="bookId" type="int" foreignKey="true"/>
            <attribute name="bookName" type="string"/>
            <attribute name="author" type="string"/>
            <attribute name="price" type="decimal"/>
            <attribute name="quantity" type="int"/>
            <attribute name="createTime" type="datetime"/>
        </entity>
        
        <entity name="ORDER" x="700" y="400">
            <attribute name="orderId" type="int" primaryKey="true"/>
            <attribute name="userId" type="int" foreignKey="true"/>
            <attribute name="username" type="string"/>
            <attribute name="totalAmount" type="decimal"/>
            <attribute name="orderStatus" type="int"/>
            <attribute name="createTime" type="datetime"/>
            <attribute name="payTime" type="datetime"/>
            <attribute name="shipTime" type="datetime"/>
            <attribute name="receiveTime" type="datetime"/>
        </entity>
        
        <entity name="ORDER_ITEM" x="1000" y="400">
            <attribute name="orderItemId" type="int" primaryKey="true"/>
            <attribute name="orderId" type="int" foreignKey="true"/>
            <attribute name="bookId" type="int" foreignKey="true"/>
            <attribute name="bookName" type="string"/>
            <attribute name="price" type="decimal"/>
            <attribute name="quantity" type="int"/>
        </entity>
        
        <entity name="BORROW_RECORD" x="700" y="700">
            <attribute name="recordId" type="int" primaryKey="true"/>
            <attribute name="userId" type="int" foreignKey="true"/>
            <attribute name="bookId" type="int" foreignKey="true"/>
            <attribute name="bookName" type="string"/>
            <attribute name="borrowTime" type="datetime"/>
            <attribute name="returnTime" type="datetime"/>
            <attribute name="borrowStatus" type="int"/>
        </entity>
    </entities>
    
    <relationships>
        <relationship from="USER" to="CART_ITEM" type="1:N" label="拥有"/>
        <relationship from="USER" to="ORDER" type="1:N" label="下单"/>
        <relationship from="USER" to="BORROW_RECORD" type="1:N" label="借阅"/>
        <relationship from="CATEGORY" to="BOOK" type="1:N" label="分类"/>
        <relationship from="BOOK" to="CART_ITEM" type="1:N" label="添加到"/>
        <relationship from="BOOK" to="ORDER_ITEM" type="1:N" label="包含在"/>
        <relationship from="BOOK" to="BORROW_RECORD" type="1:N" label="被借阅"/>
        <relationship from="ORDER" to="ORDER_ITEM" type="1:N" label="包含"/>
    </relationships>
</ERDiagram>
```

---

## 绘图建议

### 颜色方案
- **实体框**：浅蓝色背景
- **主键字段**：加粗显示，可标黄色
- **外键字段**：斜体显示，可标橙色
- **关系线**：深蓝色，箭头指向多方

### 布局技巧
1. 将核心实体（USER, BOOK）放在中心位置
2. 关联实体围绕核心实体分布
3. 避免连线交叉，保持图表清晰
4. 使用网格对齐功能使图表更整齐

### 标注说明
- PK = Primary Key（主键）
- FK = Foreign Key（外键）
- 1:N = One to Many（一对多）

---

## 快速参考：实体间的关键关系

```
USER (1) ──────< CART_ITEM (N)
  │
  ├──────< ORDER (N) ──────< ORDER_ITEM (N)
  │                              │
  └──────< BORROW_RECORD (N)     │
                                 │
CATEGORY (1) ──────< BOOK (N) ───┘
                     │
                     ├───────────> CART_ITEM
                     │
                     └───────────> BORROW_RECORD
```

---

## 导出和分享

完成绘制后，您可以：
1. 导出为 PNG/JPG 图片
2. 导出为 PDF 文档
3. 生成分享链接
4. 嵌入到其他文档中

祝您绘图顺利！如有任何问题，请随时告诉我。
