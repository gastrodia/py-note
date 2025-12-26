# 模式匹配

## 基础用法

最简单的 `match` 用法是匹配字面量。

```python
key = input("请输入按键[w,a,s,d]：")
match key:
    case "w":
        print("向上")
    case "s":
        print("向下")
    case "a":
        print("向左")
    case "d":
        print("向右")
    case _:  # 通配符，匹配任何未被上方捕获的情况，类似于 switch 的 default
        print("无效按键")
```

## 合并匹配项

可以使用 `|` (或 运算符) 将多个字面量合并到一个 `case` 中。

```python
status = 404
match status:
    case 400 | 404 | 405:
        print("客户端错误")
    case 500 | 502:
        print("服务器错误")
    case _:
        print("其他状态")
```

## 模式守卫

可以在模式之后添加一个 `if` 子句。如果模式匹配成功，但守卫条件为假，则继续匹配下一个 `case`。

```python
age = 59

match age:
    case x if x >= 60:
        print("老年人")
    case 59:
        print("即将成为老年人")
    case x if x >= 18:
        print("成年人")
    case 17 | 16:
        print("青少年")
    case _:
        print("未成年人")
```

## 匹配序列
可以自动解构列表或元组。

```python
args = ["npm", "run", "build"]

match args:
    case ["npm"]:
        # 匹配只有一个元素的列表
        print("npm --help")
    case ["npm", command, script]:
        # 匹配有三个元素的列表，并将后两个元素绑定到变量
        print(f"执行命令: npm {command} {script}")
    case ["exit", *others]:
        # 匹配以 "exit" 开头的列表，*others 捕获剩余部分
        print(f"退出进程，携带参数: {others}")
    case _:
        print("无效命令")
```

## 匹配元组
```python
# 匹配元组并解构数据
point = (3, 4)
match point:
    case (0, 0):
        print("原点")
    case (x, 0):
        print(f"在x轴上，坐标：{x}")
    case (0, y):
        print(f"在y轴上，坐标：{y}")
    case (x, y):
        print(f"在平面上，坐标：({x}, {y})")
```

## 匹配字典

```python
user = {"name": "Alice", "role": "admin"}

match user:
    case {"name": name, "role": "admin"}:
        print(f"管理员 {name} 已登录")
    case {"name": name}:
        print(f"普通用户 {name} 已登录")
```
