"""GLCServer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path
from curriculum.views import curriculum_reqeust
from goods.views import goods_reqeust
from order.views import order_reqeust
from user.views import user_reqeust
from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from GLCServer.views import server_reqeust

url_version     = 'v1/'
url_home        = url_version + 'home/'
url_user        = url_version + 'user/'
url_goods       = url_version + 'goods/'
url_order       = url_version + 'order/'
url_curriculum  = url_version + 'curriculum/'
urlpatterns = [

    # path('admin/', admin.site.urls),
    url(r'media/(?P<path>.*)',serve,{'document_root':settings.MEDIA_ROOT}),
    url(r'static/(?P<path>.*)',serve,{'document_root':settings.STATIC_URL}),

    # 首页相关
    path(url_home+'dashboard',server_reqeust.dashboard),

    #账号相关
    path(url_user+'login',user_reqeust.login),
    path(url_user+'register',user_reqeust.register),

    # 课程相关
    path(url_curriculum+'insert',curriculum_reqeust.insert),
    # path(url_curriculum+'insert_list',curriculum_reqeust.insert_list),
    path(url_curriculum+'delete',curriculum_reqeust.delete),
    path(url_curriculum+'modify',curriculum_reqeust.modify),
    path(url_curriculum+'find',curriculum_reqeust.find),
    path(url_curriculum+'upload_file',curriculum_reqeust.upload_file),
    path(url_curriculum+'get_list',curriculum_reqeust.get_list),
    path(url_curriculum+'findCur',curriculum_reqeust.findCur),

    # 商品相关
    path(url_goods+'insert',goods_reqeust.insert),
    # path(url_goods+'insert_list',goods_reqeust.insert_list),
    path(url_goods+'delete',goods_reqeust.delete),
    path(url_goods+'modify',goods_reqeust.modify),
    path(url_goods+'find',goods_reqeust.find),
    path(url_goods+'get_list',goods_reqeust.get_list),
    path(url_goods+'get_filter_list',goods_reqeust.get_filter_list),
    path(url_goods+'upload_file',goods_reqeust.upload_file),
    path(url_goods+'findGoods',goods_reqeust.findGoods),
    path(url_goods+'batchCheck',goods_reqeust.batch_check_with_goods_ids),
    path(url_goods+'batchModify',goods_reqeust.batch_modify_with_goods_ids),


    #订单相关
    path(url_order+'insert',order_reqeust.insert),
    # path(url_order+'insert_list',order_reqeust.insert_list),
    path(url_order+'delete',order_reqeust.delete),
    path(url_order+'modify',order_reqeust.modify),
    path(url_order+'find',order_reqeust.find),
    path(url_order+'set_Status',order_reqeust.set_Status),
    path(url_order+'get_list',order_reqeust.get_list),
    path(url_order+'get_status_list',order_reqeust.get_status_list),
    path(url_order+'upload_file',order_reqeust.upload_file),

]#+static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
urlpatterns += staticfiles_urlpatterns()


        #GET请求获取参数方式
        #待补充

        # POST请求获取参数方式
        # list_data = request.POST.get('list_data') #表单形式
        # list_data = json.loads(request.body.decode())['list_data']
