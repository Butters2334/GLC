import json
import time

from django.http import HttpResponse, JsonResponse

from user.models import user


def response_en(messageStr="", errorId=0, result={}) -> object:
    return HttpResponse(json.dumps({"message":messageStr,"requestStatus":errorId,'result':result},ensure_ascii=False), content_type='application/json', charset='utf-8')


def request_body(request,key):
        # list_data = request.POST.get('list_data') #表单形式
    dict = json.loads(request.body.decode())
    return dict.get(key)


#校验报文正确,部分接口不需要校验token
def response_error(request,method,params=[],need_token=True):
    if request.method != method:
        return ("只支持"+method+"方式",500)
    if need_token:
        token_timeout = token_timeOut(request)
        #判断是否超时
        if token_timeout[1] != 200:
            return (token_timeout[0],token_timeout[1])
        #判断是否有权限,部分接口只开放给admin账户
        if token_timeout[2] != 2 and (request.path.endswith("/upload_file") or request.path.endswith("/delete") or request.path.endswith("/insert") or request.path.endswith("/modify")):
            print(request.path)
            print(str(token_timeout))
            return ("当前用户没有权限",507)
    dict = json.loads(request.body.decode())
    for p in params:
        if p not in dict:
            return ("缺少入参"+p,500)
    return ("一切正常",200)


#判断token是否已过期
def token_timeOut(request):
    user_token = request.headers.get('token')
    if None == user_token:
        user_token = request_body(request,'token')
    if None == user_token:
        return ("header中没有找到token",507)
    result = user.objects.filter(user_token=user_token)
    if len(result) == 0 :
        return ("没有找到用户",507,{"user_token":user_token})
    db = result[0]
    token_timeout = db.token_timeout
    if token_timeout >= time.time():
        remaining_time = token_timeout-time.time()
        hh    = str(remaining_time/3600).split('.')[0]
        mm    = str(remaining_time%3600/60).split('.')[0]
        ss    = str(remaining_time%60).split('.')[0]
        return ("token剩余有效时间 {0}:{1}:{2}".format(hh,mm,ss),200,db.user_type)
    else:
        return ('token已过期',507)
