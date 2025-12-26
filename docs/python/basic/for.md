# 循环
Python 中主要有两种循环方式：`for` 循环和 `while` 循环。

## `for` 循环
`for` 循环用于遍历序列（如列表、元组、字典、集合或字符串）。
### 迭代列表或元组
```python
fruits = ["apple", "banana", "orange"]
for item in fruits:
    print(item)
```

### 迭代字典
默认迭代键
```python
user = {"name": "Tom", "age": 18}

for key in user:
    print(key)
```

迭代值
```python
user = {"name": "Tom", "age": 18}

for value in user.values():
    print(value)
```

迭代键值对
```python
user = {"name": "Tom", "age": 18}

for key, value in user.items():
    print(f"{key}: {value}")
```

### 使用 `enumerate()` 获取索引
如果你需要在循环中获取当前元素的索引，可以使用 `enumerate()`。
```python
fruits = ["apple", "banana", "orange"]
for index, item in enumerate(fruits):
    print(f"第 {index} 个水果是: {item}")
```

### 迭代序列 `range()`
```python
for i in range(5):
    print(i)
```

## `range` 序列

`range()` 函数返回一个数字序列，常用于 `for` 循环。

### 基础用法
`range(stop)`：从 0 开始，到 `stop` 结束（**不包含** `stop`）。
```python
collection = range(5)
print(list(collection)) 
```

### 指定区间
`range(start, stop)`：从 `start` 开始，到 `stop` 结束（包含 `start`，不包含 `stop`）。
```python
interval = range(10, 15)
print(list(interval))
```

### 步长
`range(start, stop, step)`：指定每次增加的数值。
```python
# 正向步长
step = range(10, 20, 2) 
print(list(step)) 

# 反向步长
reverse = range(10, 0, -2)
print(list(reverse)) 
```

## `while` 循环

`while` 循环会在给定的条件为 `True` 时重复执行代码块。

```python
count = 0
while count < 5:
    print(f"当前计数: {count}")
    count += 1 # 注意：一定要有修改条件的语句，否则会造成死循环
```

## `continue` 跳过 和 `break` 退出

- `break`: 立即终止循环。
- `continue`: 跳过当前循环的剩余部分，直接进入下一次循环。

### 在 `for` 循环中使用
```python
for i in range(1, 11):
    if i % 2 == 0:
        print(f"跳过偶数: {i}")
        continue
    if i > 7:
        print("超过 7，提前退出循环")
        break
    print(f"处理数字: {i}")
```

### 在 `while` 循环中使用
```python
i = 0
while i < 10:
    i += 1
    if i % 2 == 0:
        continue
    if i > 5:
        break
    print(i)
```

## `for`循环中的 `else` 子句

Python 的循环可以有一个 `else` 子句。它在循环**正常结束**（即不是被 `break` 终止）时执行。

```python
for i in range(3):
    print(i)
else:
    print("循环正常结束")

for i in range(3):
    if i == 1:
        break
    print(i)
else:
    print("这段不会被打印，因为循环被 break 了")
```

## 循环嵌套

### 九九乘法表示例
```python
for x in range(1, 10):
    for y in range(1, x + 1):
        print(f"{y} * {x} = {x * y}", end="\t")
    print() # 换行
```
