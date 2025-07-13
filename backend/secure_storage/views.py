from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """フロントエンドとの疎通確認用API"""
    return JsonResponse({
        'message': 'Hello from Django!',
        'status': 'success',
        'timestamp': '2024-01-01 12:00:00'
    })

@csrf_exempt
@require_http_methods(["POST"])
def test_api(request):
    """POSTリクエストのテスト用API"""
    try:
        data = json.loads(request.body)
        return JsonResponse({
            'message': f'Received: {data.get("message", "No message")}',
            'status': 'success',
            'received_data': data
        })
    except json.JSONDecodeError:
        return JsonResponse({
            'message': 'Invalid JSON data',
            'status': 'error'
        }, status=400) 