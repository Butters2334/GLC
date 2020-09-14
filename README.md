## 仓储管理系统(React页面+python服务器+微信小程序)

>原项目是计划用于仓库内库存管理和收发货用途的,但是因为特殊原因做不下去了,就放到github上面来,希望能帮到其他有需要的人;
>


##[React](./cms_community_e_commerce)
>基于[walljser/cms_community_e_commerce](https://github.com/walljser/cms_community_e_commerce)改写了React前端,和原项目一样使用了[ANT](https://ant.design/docs/react/introduce-cn)框架
>对原项目进行了比较大的改动,需要等后续来删除多余代码才方便二次使用;

>
```
	//使用npm安装依赖包
	npm install
	//启动React项目
	npm start
	//等待10-30秒可以启动
```

>#### 效果图
* 登录页面 
![登录页面](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/login.png)
* 沙盒主页 
![沙盒主页](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/dashboard.png)
* 订单详情 
![订单详情](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/order_find_desc.png)
* 查找订单 
![查找订单](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/order_find.png)
* 新增订单 
![新增订单](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/order_add.png)
* 修改订单 
![修改订单](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/order_modify.png)
* 订单修改 
![订单修改](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/order_modify.png)
* 添加课程 
![添加课程](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/cur_add.png)
* 课程查找 
![课程查找](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/cur_find.png)
* 课程-教材详细 
![课程-教材详细](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/cur_goods_desc.png)
* 课程修改 
![课程修改](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/cur_modify.png)
* 教材查找 
![教材查找](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/goods_find.png)
* 教材批量导入 
![教材批量导入](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/goods_insert_list.png)
* 新增教材 
![新增教材](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/goods_insert.png)
* 教材修改 
![教材修改](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/goods_modify.png)





##[python3+django](./GLCServer)
>原本都部署到腾讯云了,但是目前也下线了,可以安装python3环境部署本地服务器,之后部署到云上面有什么问题可以提出issues,尽量帮忙;
>因为是练手项目,所以没使用第三方框架,仅仅用了django的一点功能,代码也偏简单,不过实现功能足够了
>基本项目结构
>
```py
# 目录结构介绍
├── GLCServer               #全局接口
|   ├── urls.py             #路由入口,管理所有接口跳转           
|   ├── views.py            #少量全局接口           
|   ├── models.py           #DB定义           
├── user                    #用户接口
|   ├── views.py            #接口实现
|   ├── models.py           #DB定义 
├── curriculum              #课程接口,内部和user相同
├── goods                   #商品接口,内部和user相同
├── order                   #订单接口,内部和user相同
├── static                  #静态文件夹
├── nginx.conf              #部署到云上面用的配置文件
├── ssl                     #https的证书,目前已失效
|   ├── Nginx               #实现方案不同最终用到的证书不同
```
>#### 效果图
* django接口列表
![django接口列表](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/django.png)
* PyCharm配置1 
![PyCharm配置1](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/add_django_server.png)
* PyCharm配置2 
![PyCharm配置2](https://raw.githubusercontent.com/anmac/GLC/master/screenshot/add_django_collocation.png)

##[小程序](./GlcSmart)
>后续尝试将react的项目放到小程序来,因为时间不足,就只是实现了扫货的功能
>待后续传图...

##[**paw**](./GLCIntface.paw)
>可以使用paw测试接口,记得把域名改为ip地址


