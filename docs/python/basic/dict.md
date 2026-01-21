# 字典

字典是 Python 中非常重要的一种数据结构，它由 **键 (key)** 和 **值 (value)** 成对组成。

- **特点**：
    - 键必须是**不可变类型**（如字符串、数字、元组），且不能重复。
    - 自 Python 3.7 起，字典是有序的（保持插入顺序）。

## 定义字典

### 使用字面量定义字典
这是最常用的方式。
```python
age_key = "age"
cxk = {"name": "cxk", age_key: 18, "gender": "male"}
print(cxk)
```

### 使用 `dict` 函数创建字典
```python
ggbond = dict(name="ggbond", age=18, gender="male")
print(ggbond)

# 也可以从列表/元组转换
pairs = [("name", "kunkun"), ("age", 2.5)]
d = dict(pairs)
print(d)
```

### 使用字典推导式创建字典
```python
data = {f"{i}的平方": i**2 for i in range(5)}
print(data)
```

### 使用 `zip` 函数创建字典
```python
keys = ["name", "age", "gender"]
values = ["cxk", 18, "male"]

body = dict(zip(keys, values))
print(body)
```

## 遍历字典

### 遍历键
```python
payload = {"name": "cxk", "age": 18}
for key in payload:
    print(key)
```

### 遍历键值对
```python
payload = {"name": "cxk", "age": 18, "gender": "male"}

for key, value in payload.items():
    print(f"Key: {key}, Value: {value}")

# 对应的还有 keys() , values()
print(list(payload.keys()))
print(list(payload.values()))
```

## 常用操作与方法

### 基本运算
```python
bob = {"name": "bob", "age": 18}

# 获取长度
print(len(bob)) # 2

# 判断键是否存在
print("name" in bob) # True
print("address" in bob) # False
```

### 读取值
```python
bob = {"name": "bob", "age": 18}

# 1. 使用中括号：若 key 不存在会抛出 KeyError
print(bob["name"])

# 2. 使用 get 方法：若 key 不存在返回 None 或自定义默认值
print(bob.get("address"))  # None
print(bob.get("address", "未知地址"))  # 未知地址
```

### 修改与增加
```python
bob = {"name": "bob"}

bob["age"] = 18  # 如果 key 不存在则增加，存在则修改
bob.update({"gender": "male", "age": 20}) # 批量更新
print(bob)
```

### 使用 `setdefault`
如果键不存在，则插入键并设置默认值；如果键已存在，则返回其值。
```python
counts = {"apple": 1}
counts.setdefault("banana", 0) # 插入并返回 0
counts.setdefault("apple", 10)  # 返回 1，不修改
print(counts)
```

### 删除成员
```python
bob = {"name": "bob", "age": 18, "gender": "male", "tag": "cool"}

# 1. del 关键字
del bob["tag"]
print(bob)

# 2. pop 方法：删除指定键并返回其值
age = bob.pop("age") 
# age = bob.pop("non_existent", 0) # 加上第二个参数可防止 key 不存在时报错
print(bob)

# 3. popitem：删除并返回最后插入的一个键值对
item = bob.popitem()
print(bob)

# 4. clear：清空字典
bob.clear()
print(bob)
```

### 合并字典
```python
p1 = {"name": "cxk", "tag": "cool"}
p2 = {"age": 18}

# 方法 1: update()
# p1.update(p2)

# 方法 2: 使用 | 运算符 (Python 3.9+)
merged = p1 | p2
print(merged)

# 方法 3: 解构合并 (Python 3.5+)
merged_2 = {**p1, **p2}
print(merged_2)
```

### 复制字典
```python
old = {"a": 1}
new = old.copy() # 浅拷贝
print(new)
```

## 字典过滤
```python
storage = {"apple": 120, "banana": 100, "orange": 80, "pear": 90}
# 过滤出值大于等于 100 的项
more_than_100 = {k: v for k, v in storage.items() if v >= 100}
print(more_than_100)
```

## 字典的嵌套
```python
car = {
    "brand": "Toyota",
    "model": "Camry",
    "year": 2022
}
person = {
    "name": "cxk",
    "car": car,
    "house": {
        "address": "123 Main St",
        "city": "Anytown",
        "state": "CA"
    }
}

print(person)
```