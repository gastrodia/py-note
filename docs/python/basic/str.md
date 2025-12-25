# 字符串与编码

## 字符的编码
### `len`函数获取字符长度
```python
s = "你好"

print(len(s))
```

### `ord`函数获取字符的Unicode
```python
print(ord('好'))
```

### `chr`函数将unicode转为对应的字符
```python
print(chr(22909))
```

### `encode`方法将字符转为字节
```python
print("好".encode('utf-8'))
```

### `decode`方法将字节转为字符
```python
b_code = b'\xe5\xa5\xbd'
print(b_code)
print(len(b_code))
s = b_code.decode('utf-8')
print(s)
print(len(s))
# UTF-8中一个中文字符占3字节
```

## 字符串的格式化

### 占位符
| 占位符 |	替换内容 |
| --- | --- |
| %d |	整数 |
| %f |	浮点数 |
| %s |	字符串 |
| %x |	十六进制整数 |

```python
template = "%d个%s"
print(template % (1, "苹果"))
print(template % (2, "橘子"))
```
```python
print("第%.3d名" % 1)  # 补位
print("第%03d名" % 2)  # 补位
print("向前移动了%.2f米" % 1)  # 浮点数 精确精度
```

```python
print("十六进制0x%x" % 255) # 小写
print("十六进制0x%X" % 255) # 大写
```

### `format`
索引方式
```python
s = "{0}得了{1:.2f}分，是第{2:03d}名".format("cxk", 98.5, 1)
print(s)
```


关键字方式（推荐）
```python
s = "{name}得了{score:.2f}分，是第{rank:03d}名".format(name = "cxk",  rank = 1, score = 98.5)
print(s)
```

### `f-string`

```python
s = f"{'GGBond'}得了{80:.2f}分，是第{3:03d}名"
print(s)
```

```python
s = f"1+1={1+1}"
print(s)
```

```python
name = "GGBond"
s = f"I'm {{{name}}}" # 原文输出{}
print(s)
```

