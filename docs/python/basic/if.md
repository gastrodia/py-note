# 条件判断

## 单分支
当条件为真时执行代码块。

```python
age = 20
if age >= 18:
    print("你已经成年了")
```

## 双分支

当条件为真时执行一个块，否则执行另一个块。

```python
age = 15
if age >= 18:
    print("你已经成年了")
else:
    print("你还未成年")
```

## 多分支
可以检查多个条件。

```python
score = 85

if score >= 90:
    print("优秀")
elif score >= 80:
    print("良好")
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

## 嵌套分支
可以在一个条件语句内部使用另一个条件语句。

```python
age = 20
has_ticket = True

if age >= 18:
    if has_ticket:
        print("允许入场")
    else:
        print("请先购票")
else:
    print("未成年人禁止入内")
```

## 逻辑运算符

可以使用 `and`、`or` 和 `not` 来组合多个条件。

- `and`: 且。所有条件都为真时，结果才为真。
- `or`: 或。只要有一个条件为真，结果就为真。
- `not`: 非。取反。

```python
age = 25
has_id = True

if age >= 18 and has_id:
    print("可以办理业务")
```

## 示例

### 示例 1：用户输入与类型转换

```python
age_input = input("请输入年龄：")
# 注意：input 返回的是字符串，需要转换成整数
age = int(age_input)

if age >= 18:
    print("成年人")
elif age >= 12:
    print("青少年")
else:
    print("儿童")
```

### 示例 2：BMI 计算器

```python
# 例子：计算 BMI
height = 1.75 # 米
weight = 70.0 # 千克

bmi = weight / (height**2)
print(f"你的 BMI 是: {bmi:.2f}")

if bmi < 18.5:
    print("过轻")
elif bmi < 25:
    print("正常")
elif bmi < 28:
    print("过重")
elif bmi < 32:
    print("肥胖")
else:
    print("严重肥胖")
```
