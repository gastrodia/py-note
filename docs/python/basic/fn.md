# 函数

## 定义函数

```python
def fn(arg):
    print(f"arg: {arg}")
    return arg

res = fn("hello")
print(f"res: {res}")
```

## 函数的参数

```python
def fn(x, y, z):
    print(f"x: {x == 1} y: {y == 2} z: {z == 3}")


# 位置参数
fn(1, 2, 3) # 数量和位置一一对应


# 关键字参数
fn(z=3, y=2, x=1)
```

### 强制位置参数
调用函数时**只能使用位置参数**
> `/`前面的参数是强制位置参数

```python
def fn(x, y, z, /):
    print(f"x: {x == 1} y: {y == 2} z: {z == 3}")

fn(1, 2, 3)

# 使用关键字参数会报错
try:
    fn(z=3, y=2, x=1)
except TypeError as e:
    print(f"异常信息: {e}")
```

### 命名关键字参数
> `*`后面的参数是命名关键字参数

```python
def fn(*, x, y, z):
    print(f"x: {x == 1} y: {y == 2} z: {z == 3}")

fn(z=3, y=2, x=1)

# 使用位置参数会报错
try:
    fn(1, 2, 3)
except TypeError as e:
    print(f"异常信息: {e}")
```

### 参数默认值

**带默认值的参数必须放在不带默认值的参数之后**
```python

def fn(m, n = "hello"):
    print(f"{m} {n}")


fn("cxk", "hi")
fn("cxk") # 不传递参数时使用默认值
```

### 可变参数（剩余参数）

```python
def fn(*args):
    count = 0
    for item in args:
        count += item
    return count


print(fn(1, 2, 3, 4, 5))
print(fn(5, 5))
print(fn(1))
```


#### `**kwargs` (关键字参数序列)
用于接收任意数量的关键字参数，参数会被封装成一个 **字典 (dict)**。

```python
def fn(**kwargs):
    for key, value in kwargs.items():
        print(f"{key} = {value}")

fn(name="Alice", age=18)
```

## 返回值

### 返回多个值
函数可以返回多个值，实际上是返回了一个 **元组 (tuple)**。

```python
def get_user():
    return "Alice", 18

name, age = get_user() # 自动解包
print(f"Name: {name}, Age: {age}")
```

## 匿名函数 (Lambda)

简单的单行函数可以使用 `lambda` 表达式。

```python
add = lambda x, y: x + y
print(add(5, 3)) # 输出 8
```

## 类型提示 (Type Hints)

可以在定义函数时标注参数和返回值的类型，提高代码可读性和工具支持。

```python
def greeting(name: str) -> str:
    return f"Hello, {name}"
```

## 参数排列顺序

定义函数时，参数的建议顺序是：
1. 位置参数
2. 强制位置参数标识符 `/`
3. 默认参数
4. 可变位置参数 `*args`
5. 命名关键字参数
6. 可变关键字参数 `**kwargs`

例如：
```python
def complex_fn(a, b, /, c, d=10, *args, e, **kwargs):
    pass
```
