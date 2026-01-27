# 函数实战

## 1. 生成随机验证码
使用 `random` 和 `string` 模块生成指定长度的随机字符串。

```python
import random
import string

# 准备字符池：0-9, a-z, A-Z
ALL_CHARS = string.digits + string.ascii_letters

def gen_code(*, length: int = 4) -> str:
    """
    生成随机验证码
    :param length: 验证码长度，强制使用关键字参数
    :return: 随机字符串
    """
    # random.choices 从序列中随机取出 k 个元素（可重复）
    chars = random.choices(ALL_CHARS, k=length)
    return "".join(chars)

# 测试
print(f"默认验证码: {gen_code()}")
print(f"6位验证码: {gen_code(length=6)}")
```

## 2. 格式化文件大小 (数据处理)
将字节数（Bytes）转换为人类可读的格式（如 KB, MB, GB）。

```python
def format_size(byte_size: int) -> str:
    """将字节大小转换为可读格式"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if byte_size < 1024:
            return f"{byte_size:.2f} {unit}"
        byte_size /= 1024
    return f"{byte_size:.2f} PB"

# 测试
print(format_size(1024))      # 1.00 KB
print(format_size(10000000))  # 9.54 MB
```

## 3. 列表排序与 Lambda 函数 (匿名函数实战)
在处理复杂数据结构（如字典列表）时，函数作为参数的实战用法。

```python
users = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 20},
    {"name": "Charlie", "age": 30},
]

# 需求：按照年龄从小到大排序
# lambda x: x["age"] 是一个匿名函数，告诉 sort 比较哪个字段
users.sort(key=lambda x: x["age"])

print("按年龄排序后的用户:", users)
```

## 总结
- **参数命名**：避免使用 `len`, `list`, `str` 等内置函数名作为变量名。
- **强制关键字参数**：在形参中使用 `*` 可以强制调用者必须显式写出参数名（如 `gen_code(length=6)`），这在参数较多时能显著增加代码可读性。
- **类型注解**：使用 `length: int` 和 `-> str` 明确输入输出类型，能让编辑器提供更好的补全，也方便他人阅读。
