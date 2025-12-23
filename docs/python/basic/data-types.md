# 基本数据类型

## 定义变量/常量
Python 定义变量/常量不需要关键字，直接赋值即可。

```python
name = "python"
print(name)

# 定义常量通常使用全部大写字母（这是一种约定，Python 并没有强制的常量语法）
MAX_SIZE = 1024
print(MAX_SIZE)
```

## 整数 (int)

### 定义整数
```python
num = 1  # 整数
print(num)
```

### 千分位分隔符
为了提高可读性，可以使用下划线作为数字的分隔符。
```python
num = 100_000
print(num) # 输出 100000
```

### 进制表示
```python
hex_num = 0x10   # 十六进制 (0x 开头)
oct_num = 0o10   # 八进制 (0o 开头)
bin_num = 0b1010 # 二进制 (0b 开头)
print(hex_num, oct_num, bin_num)
```

### 负数
```python
num = -1
print(num)
```

## 浮点数 (float)

### 定义浮点数
```python
float_num = 1.0
print(float_num)
```

### 科学计数法
```python
f1 = 1e3    # 1000.0
f2 = 1e-3   # 0.001
f3 = 1.3e3  # 1300.0
print(f1, f2, f3)
```

## 字符串 (str)

> **注意**：避免使用 `str` 作为变量名，因为它是一个内置函数的名称。

### 定义字符串
```python
s1 = "hello" # 使用双引号
s2 = 'hello' # 也可以使用单引号
print(s1, s2)
```

### 包含引号的字符串
可以通过单双引号的嵌套，或者使用转义字符 `\` 在字符串中包含引号。
```python
s3 = '"python"' # 包含双引号
s4 = "'hello'" # 包含单引号
s5 = "I\'m ok!" # 使用转义字符
print(s3, s4, s5)
```

### 多行文本
使用 `"""..."""` 或 `'''...'''` 来定义多行文本。
```python
multi_line = """
hello python:
    I'm ok!
"""
print(multi_line)
```

## 布尔 (bool)
布尔值只有两个：`True` 和 `False`（注意首字母必须大写）。
```python
is_true = True
is_false = False

print(is_true, is_false)
```

## 空值 (None)
`None` 是 Python 的一个特殊常量，表示“空”或“什么都没有”。
```python
empty = None
print(empty)
```

## 检查数据类型
可以使用内置函数 `type()` 来查看变量或值的类型。
```python
print(type(100))      # <class 'int'>
print(type(3.14))     # <class 'float'>
print(type("hello"))  # <class 'str'>
print(type(True))     # <class 'bool'>
print(type(None))     # <class 'NoneType'>
```
