import requests
import json
from itertools import chain
from django import http
from django.conf import settings
from django.template import engines
from django.views.generic import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.debug import sensitive_post_parameters
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.middleware.csrf import get_token

# Create your views here.

@sensitive_post_parameters('password')
@never_cache
@ensure_csrf_cookie
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        if username and password:
            # Test username/password combination
            user = authenticate(username=username, password=password)
            # Found a match
            if user is not None:
                # User is active
                if user.is_active:
                    # Officially log the user in
                    auth_login(request, user)
                    groups = user.groups.all()
                    group_permissions = list(chain(*[group.permissions.all() for group in groups]))
                    
                    data = {
                        'success': True, 
                        'user_detail' : {
                            'first_name' : user.first_name,
                            'last_name' : user.last_name,
                            'email' : user.email,
                            'groups' : [group.name for group in groups],
                            'permissions' : [permission.codename for permission in group_permissions] + [permission.codename for permission in user.user_permissions.all()]
                        }
                    }
                else:
                    data = {'success': False, 'error': 'User is not active'}
            else:
                data = {'success': False, 'error': 'Wrong username and/or password'}

            return http.HttpResponse(json.dumps(data))
    elif request.method == 'GET':
        return http.HttpResponse(json.dumps({'csrfmiddlewaretoken': get_token(request)}))
    # Request method is not POST or one of username or password is missing
    return http.HttpResponseBadRequest()

@never_cache
@ensure_csrf_cookie
def logout(request):
    if request.method == 'GET':
        auth_logout(request);
        return http.HttpResponse()
            
    return http.HttpResponseBadRequest()

@ensure_csrf_cookie
@csrf_exempt
def catchall_dev(request, upstream='http://localhost:3000'):
    """
    Proxy HTTP requests to the frontend dev server in development.

    The implementation is very basic e.g. it doesn't handle HTTP headers.

    """
    print(request)
    upstream_url = upstream + request.path
    method = request.META['REQUEST_METHOD'].lower()
    response = getattr(requests, method)(upstream_url, stream=True)
    content_type = response.headers.get('Content-Type')

    if request.META.get('HTTP_UPGRADE', '').lower() == 'websocket':
        return http.HttpResponse(
            content="WebSocket connections aren't supported",
            status=501,
            reason="Not Implemented"
        )

    elif content_type == 'text/html; charset=UTF-8':
        return http.HttpResponse(
            content=engines['django'].from_string(response.text).render(),
            status=response.status_code,
            reason=response.reason,
        )

    else:
        return http.StreamingHttpResponse(
            streaming_content=response.iter_content(2 ** 12),
            content_type=content_type,
            status=response.status_code,
            reason=response.reason,
        )

class CSRFTemplateView(TemplateView):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

catchall_prod = CSRFTemplateView.as_view(template_name='index.html')

catchall = catchall_dev if settings.DEBUG else catchall_prod