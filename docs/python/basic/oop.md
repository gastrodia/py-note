# 面向对象编程

## 类与实例
```python
from types import MethodType
import time

class Person:

  # 类属性
  address = '中国'

  # 构造函数
  def __init__(self, name: str, age:int):
    self.name = name
    self.age = age

  def resume(self):
    print(f"我是{self.name}，今年{self.age}岁，来自{self.address}")

  def running(self):
    print(f"{self.name}正在奔跑")

  def rename(self, name: str):
    print(f'{self.name}改名为{name}')
    self.name = name

  # 静态方法，静态方案与实例无关
  @staticmethod
  def is_adult(age: int):
    adult = age >= 18
    print('成年' if adult else '未成年')
    return adult



  # 将方法装饰为属性。类似getter
  @property
  def birth(self):
    return time.localtime().tm_year - self.age

  # 设置 birth
  @birth.setter
  def birth(self, value):
    year = time.localtime().tm_year
    if value > year:
      raise ValueError('不能超过今年')
    self.age = year - value


cxk = Person('cxk', 18)
cxk.resume()
cxk.running()
cxk.rename('GGBond')
cxk.resume()


# 可以额外挂载动态属性
cxk.gender = 'male'
def resume(self: Person):
  print(f"我是{self.name}， 性别{self.gender}，今年{self.age}岁，来自{self.address}")

# bad
# cxk.resume = resume
# cxk.resume(cxk)

# 推荐
cxk.resume = MethodType(resume, cxk)
cxk.resume() # 不再需要手动传入self


tom = Person('Tom', 12)

# 因为address是类属性，当修改类属性后，实例也会受影响
Person.address = '美国'

tom.resume()
cxk.resume()


print(Person.__dict__)
print(cxk.__dict__) # 可以看到实例上并没有address属性


Person.is_adult(cxk.age)
Person.is_adult(tom.age)



print(f"cxk出生自{cxk.birth}")

cxk.birth = 1997
print(f"cxk出生自{cxk.birth}，今年{cxk.age}岁")
```


## 继承和多态
```python
class Person:

  address = '中国'

  def __init__(self, name: str, age:int):
    self.name = name
    self.age = age

  def resume(self):
    print(f"我是{self.name}，今年{self.age}岁")

  def running(self):
    print(f"{self.name}正在奔跑")

  def rename(self, name: str):
    print(f'{self.name}改名为{name}')
    self.name = name

  # 类方法
  @classmethod
  def cls_fn(cls):
    print(cls.__mro__)



# 继承
class Student(Person):
  def __init__(self, name: str, age: int, score: float):
    super().__init__(name, age) # 使用 super 继承
    self.score = score

  def test(self):
    print(f"{self.name}考了{self.score}分")

  # 重写
  def resume(self):
    print(f"我是{self.name}，今年{self.age}岁，考了{self.score}分")




cxk = Student('cxk', 12, 34.2)
cxk.resume()
cxk.test()


tom = Person('Tom', 18)
tom.cls_fn()
cxk.cls_fn()
```