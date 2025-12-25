# 列表与元组

## 列表 (List)
列表是 Python 中最常用的数据类型之一，它是**有序**且**可变**的集合。

### 定义列表
```python
fruits = ["apple", "orange"]
print(fruits)
```

### 空列表
```python
fruits = []
# 或者使用构造函数
# fruits = list()
print(fruits)
```

### 可以存放不同类型的数据
列表可以包含任何类型的对象，甚至可以嵌套其他列表。
```python
data = ["apple", 1, 3.14, True, ["hello"], {}, (), None]
print(data)
```

### 获取列表长度
```python
fruits = ["apple", "orange"]
print(len(fruits)) # 输出: 2
```

### 操作列表

#### 读取列表中的元素 (索引)
Python 使用从 0 开始的索引。
```python
fruits = ["apple", "orange", "banana"]

print(fruits[0])
print(fruits[1])
print(fruits[-1])  # 最后一位元素
print(fruits[-2])  # 倒数第二位
```
> **注意**：越界操作（如 `fruits[10]`）将会抛出 `IndexError` 错误。

#### 切片
通过切片可以获取列表的一部分。语法：`list[start:stop:step]`
```python
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(nums[2:5])    # 从索引2开始到索引5结束，不包含索引5 (左闭右开)
print(nums[:3])     # 从索引0开始到索引3结束，不包含索引3 (从头开始)
print(nums[7:])     # 从索引7开始到最后一位索引结束 (直到末尾)
print(nums[::2])    # 取索引为偶数的元素 (步长为2)
print(nums[::-1])   # 列表翻转
```

#### 修改元素
```python
fruits = ["apple", "orange"]
fruits[0] = "banana"
print(fruits)
```

#### 添加元素
**`append(item)`**: 在末尾追加单个元素。
```python
fruits = ["apple", "orange"]

fruits.append("banana")
print(fruits)
```

**`insert(index, item)`**: 在指定索引处插入元素。
```python
fruits = ["apple", "orange"]

fruits.insert(1, "pear")
print(fruits)
```

**`extend(iterable)`**: 将另一个序列的元素批量添加到末尾。
```python
fruits = ["apple", "orange"]

fruits.extend(["grape", "kiwi"])
print(fruits)
```

#### 删除元素
**`pop([index])`**: 移除并**返回**指定索引的元素（默认最后一位）。
```python
fruits = ["apple", "banana", "orange", "banana"]
fruits.pop(0)        # 移除索引为1的元素, 返回 元素本身 "banana"
fruits.pop() # 移除最后一位
print(fruits)
```

**`remove(item)`**: 移除列表中**第一个**匹配的元素。
```python
fruits = ["apple", "banana", "orange", "banana"]
fruits.remove("banana") # 只会移除第一个 "banana"
print(fruits)

```

**`clear()`**: 清空列表。
```python
fruits = ["apple", "banana", "orange", "banana"]
fruits.clear() 
print(fruits)
```

#### 查找与计数
```python
fruits = ["apple", "orange", "banana", "apple"]

print("apple" in fruits)     # 检查是否存在)
print(fruits.index("orange")) # 获取索引
print(fruits.count("apple"))  # 统计出现次数
```

#### 排序
*   **`sort()`**: 在**原列表**上进行排序。
*   **`sorted(list)`**: 返回一个**新**的已排序列表，原列表不变。

```python
nums = [3, 1, 4, 2]

# 原地排序
nums.sort() 
print(nums)
```

反向排序
```python
nums = [3, 1, 4, 2]

nums.sort(reverse=True)
print(nums)
```

自定义排序规则 (例如按长度)
```python
fruits = ["apple", "watermelon", "pear"]
fruits.sort(key=len)
print(fruits) # ['pear', 'apple', 'watermelon']
```

`sorted()` 不修改原始列表，返回一个新列表
```python
nums = [5, 8, 6]
new_nums = sorted(nums)
print(new_nums)
print(nums)
```

#### 翻转列表
```python
fruits = ["apple", "watermelon", "pear"]
fruits.reverse()
print(fruits)
```

#### 列表推导式
```python
# 创建 0-9 的平方列表
squares = [x**2 for x in range(10)]
print(squares)

# 带条件的推导式
evens = [x for x in range(10) if x % 2 == 0]
print(evens)
```

## 元组 (Tuple)
元组与列表非常相似，但它是**不可变** 的。一旦创建，就不能修改、添加或删除元素。

### 定义元组
```python
rgba = (255, 255, 255, 1)
print(rgba)
```

**特殊情况：单个元素**
如果元组只有一个元素，必须加逗号 `,`，否则会被识别为普通括号。
```python
not_a_tuple = (1)   # int 类型
print(not_a_tuple)
is_a_tuple = (1,)   # tuple 类型
print(is_a_tuple)
empty_tuple = ()    # 空元组
print(empty_tuple)
```

### 元组解包
```python
point = (10, 20)
x, y = point
print(f"x: {x}, y: {y}") # x: 10, y: 20
```

### 为什么使用元组而不是列表？
1.  **安全性**：数据不可变，防止程序意外修改。
2.  **性能**：元组比列表稍微快一点，占用的内存更小。
3.  **作为字典键**：由于元组是不可变的（且可哈希），它们可以用作字典的键，而列表不行。

### 注意事项：元组的“不可变性”
元组本身不可变，但如果元组内包含可变对象（如列表），该对象内部的内容是可以修改的。
```python
t = (1, 2, [3, 4])
# t[0] = 10  # 报错：TypeError
t[2][0] = 99 # 成功：修改的是元组内部的列表元素
print(t)     # (1, 2, [99, 4])
```
