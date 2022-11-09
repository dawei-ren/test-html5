
let data = {
  username: 'Lucy',
  age: 12
}

let _this = {}

// vue 中 实现数据劫持代理
for(let item in data) {
  Object.defineProperty(_this, item, {
    // get： 用来扩展属性值，当获取该属性值的时候调用get方法
    get(){
      return data[item]
    },
    // set：监视扩展属性，只要一修改，就调用，千万不能再set方法中修改当前属性，否则会出现死循环
    // set(newValue){
    //   data[item] = newValue;
    // }
  })
}

console.log(_this.username);
data['username'] = 'Jack'
console.log(_this.username);