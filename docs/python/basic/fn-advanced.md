# 函数高阶


## 高阶函数

### 传入一个函数
```python
import operator

def fn (calc_fn, *args, **keywords):
  """
  这个函数接收一个计算函数和任意参数，
  然后对所有数字类型的参数进行累积计算。
  """
  arr = list(args) + list(keywords.values())
  
  # 根据操作类型设置初始值，修复乘法结果为0的bug
  if calc_fn == operator.mul:
    num = 1
  else:
    num = 0
  
  for item in arr:
    # 使用 isinstance() 是更好的实践
    if isinstance(item, (int, float)):
      # 注意：这里的调用顺序是 calc_fn(当前项, 累积值)
      num = calc_fn(item, num)
  print(num)

print("加法计算结果:")
fn(operator.add, 1, 2, '1', 1.1, a = 1, b =2)

print("\n使用 operator.mul 的乘法计算结果 (已修复):")
# 初始值为 1，计算过程: 1*1 -> 2*1 -> 1.1*2 -> 1*2.2 -> 2*2.2 = 4.4
fn(operator.mul, 1, 2, '1', 1.1, a = 1, b =2)
```

### 返回一个函数
```python

## 柯里化
def add(x):
  def sum(y = None):
    if y is None:
        return x
    return add(x + y)

  return sum

print(add(2)(1)(4)())
```


### 内置高阶函数
```python
from functools import reduce


arr = [5, 1, 2, 3]

n_arr = list(filter(lambda x: x % 2 == 0, arr))
print(n_arr)

m_arr = list(map(lambda x: x + 1, arr))
print(m_arr)

val = reduce(lambda x, y: x + y, arr)
print(val)

x_arr = sorted(arr)
print(x_arr)

y_arr = list(reversed(arr))
print(y_arr)
```


### 偏函数
```python
import functools

def sayHi(x, y):
  return f"{x}, {y}"

print(sayHi("hello", "world"))

# 固定函数参数

sayHello = functools.partial(sayHi, 'hello')

print(sayHello('world'))
print(sayHello('python'))

sayMore = functools.partial(sayHi, y = 'GGBond') # 固定后面的
print(sayMore('I am'))
print(sayMore('Good night'))
```

## 装饰器
假设我们有以下程序
```python
import time
import random

def download():
  print("开始下载")
  time.sleep(random.random() * 5)
  print(f"下载完成")

def upload():
  print("开始上传")
  time.sleep(random.random() * 3)
  print(f"上传完成")


d_start = time.time()
download()
print(f"耗时：{(time.time() - d_start):.2f}s")

p_start = time.time()
upload()
print(f"耗时：{(time.time() - d_start):.2f}s")
```

### 装饰器语法
用一个函数装饰另一个函数，使其拥有额外的能力
```python
import time
import random

def use_time(fun):
  def wrapper(*args, **kwargs):
    start = time.time()
    result = fun(*args, **kwargs)
    print(f"{fun.__name__}耗时:{(time.time() - start):.2f}")
    return result
  return wrapper


def run():
    print("开始")
    time.sleep(random.random() * 5)
    print(f"下载")

use_time(run)()


# 使用装饰器语法糖
@use_time
def download():
  print("开始下载")
  time.sleep(random.random() * 5)
  print(f"下载完成")

@use_time
def upload():
  print("开始上传")
  time.sleep(random.random() * 3)
  print(f"上传完成")


print()

download()
print()

upload()
```


### 缓存原函数
```python
import time
import random
from functools import wraps

# 使用wraps装饰器可暂存
def use_time(fun):

  @wraps(fun)
  def wrapper(*args, **kwargs):
    start = time.time()
    result = fun(*args, **kwargs)
    print(f"{fun.__name__}耗时:{(time.time() - start):.2f}")
    return result
  return wrapper


@use_time
def run():
  print("开始")
  time.sleep(random.random())
  print("结束")

run()
print()

# 直接调用原函数
run.__wrapped__()
```

### 装饰器传参
```python
import time
import random

def use_time(name = ''):
  def decorator(fun): # 在多嵌套一层
    def wrapper(*args, **kwargs):
      s = time.time()
      result = fun()
      print(f"{name}执行耗时：{(time.time() - s):.2f}s")
      return result
    return wrapper
  return decorator

@use_time('运行') # 可以传参
def run():
  print('开始')
  time.sleep(random.random())
  print('结束')

run()
```

## 递归函数

```python
def fb(n):
  if n in (1, 2):
    return 1
  return fb(n - 1) + fb(n - 2)

fb(30)
```

### 使用 lru_cache 缓存计算结果
```python
from functools import lru_cache

@lru_cache()
def fb(n):
  if n in (1, 2):
    return 1
  return fb(n - 1) + fb(n - 2)

fb(30)
```