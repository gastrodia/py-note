# 集合

集合（Set）是一个无序的不重复元素序列。

## 定义集合
### 使用字面量
```python
fruits = {"apple", "banana", "cherry"}
print(fruits)
```

### 使用构造器
!!! note
    使用构造器时，其传入的参数必须是一个可迭代对象。

```python
fruits = set(["apple", "banana", "cherry"])
# 或
# fruits = set(("apple", "banana", "cherry"))
# 或
# fruits = set({"apple", "banana", "cherry"})
print(fruits)
```

**注意：**
```python
worlds = set("hello") # 会被拆成单个字符，且去重
print(worlds) # {'h', 'e', 'l', 'o'} (顺序可能不同)
```

### 定义空集合
!!! warning
    定义一个空集合**不能**使用 `{}`，因为 `{}` 是用来创建一个空字典的。应该使用 `set()`。

```python
empty_set = set()
print(type(empty_set)) # <class 'set'>

empty_dict = {}
print(type(empty_dict)) # <class 'dict'>
```

### 集合中可以存放不同的数据类型
**但是，不能存储可变的数据类型，如列表、字典，及嵌套其他集合。**
```python
data = {1, (2,), "hello"}
print(data)
```
!!! note
    你会发现，在一个包含 `True` 和 `1`，或者 `False` 和 `0` 的集合中，它们会被视为重复元素。
    ```python
    data = {1, True, 0, False}
    print(data) # {1, 0}
    ```
    因为 `True` 和 `False` 在 Python 中会被当作 `1` 和 `0` 参与哈希计算，被判定为重复元素。


## 迭代集合中的元素
```python
persons = {"John", "Jane", "Mike"}
for person in persons:
    print(person)
```

## 集合的方法

### 常见方法
```python
wrapper = {1, 2}

# 向集合中添加元素
wrapper.add(3)
print(wrapper)

# 移除集合中的元素（如果元素不存在会报错）
wrapper.remove(1)
print(wrapper)

# 移除集合中的元素（如果元素不存在不会报错）
wrapper.discard(2)
print(wrapper)

# 随机移除并返回集合中的一个元素
# s = {1, 2, 3}
# item = s.pop()

# 获取集合的长度
print(len(wrapper))

# 清空集合
wrapper.clear() 
print(wrapper)
```

### 判断两个集合是否没有相同的元素
```python
set1 = {1, 2}
set2 = {2, 3}
set3 = {4, 5}

print(set1.isdisjoint(set2)) # False
print(set1.isdisjoint(set3)) # True
```

## 集合的运算
### 成员运算
判断一个元素是否在某个集合中。
```python
wrapper = {1, 2, 3}
print(1 in wrapper)  # 判断一个元素在集合中
print(1 not in wrapper)  # 判断一个元素不在集合中
```

### 二元运算
求两个集合的交集，并集，差集，对称差。

#### 并集
合并两个集合
```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}

print(set1 | set2)  # 合并两个集合
print(set1.union(set2))  # 与 | 是等价的
```

#### 交集
两个集合相同的部分
```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}

print(set1 & set2)  # 两个集合相同的部分
print(set1.intersection(set2))  # 与 & 是等价 of
```

#### 差集
在一个集合中有，另一个集合中没有的部分
```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}

print(set1 - set2)  # set1中存在，set2中不存在的元素
print(set2 - set1)  # set2中存在，set1中不存在的元素
print(set2.difference(set1))  # 与 set2 - set1 是等价的
```

#### 对称差集
合并两个集合不相同的部分
```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}

print(set1 ^ set2)  # 两个集合中不重复的部分
print(set1.symmetric_difference(set2))  # 与 ^ 是等价的
```

### 二元运算且更新
#### `|=`
```python
set1 = {1, 2}
set2 = {2, 3}

set1 |= set2  # 先合并再更新
# set1.update(set2) 等价于 |=
print(set1)
```

#### `&=`
```python
set1 = {1, 2}
set2 = {2, 3}

set1 &= set2  # 先求交集再更新
# set1.intersection_update(set2) 等价于 &=
print(set1)
```

#### `-=`
```python
set1 = {1, 2}
set2 = {2, 3}

set1 -= set2  # 先求差集再更新
# set1.difference_update(set2) 等价于 -=
print(set1)
```

#### `^=`
```python
set1 = {1, 2}
set2 = {2, 3}

set1 ^= set2  # 先求对称差集再更新
# set1.symmetric_difference_update(set2) 等价于 ^=
print(set1)
```

### 集合的比较
#### `>` 和 `<` (真超集和真子集)
```python
set1 = {1, 2, 3}
set2 = {1, 2}

print(set1 > set2)  # True, set1是set2的真超集
print(set2 < set1)  # True, set2是set1的真子集
```

#### `==` 和 `!=`
```python
set1 = {1, 2, 3}
set4 = {1, 2, 3}

print(set1 == set4)  # 两个集合包含相同的元素
print(set1 != set4)  # False
```

#### `>=` 和 `<=` (超集和子集)
```python
set1 = {1, 2, 3}
set4 = {1, 2, 3}

print(set1 >= set4)  # True
print(set1 <= set4)  # True
```

## 集合推导式
与列表推导式类似，但是使用大括号 `{}`。
```python
# 创建一个包含 0 到 9 中偶数的集合
evens = {x for x in range(10) if x % 2 == 0}
print(evens)
```
