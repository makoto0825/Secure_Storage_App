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
    
@csrf_exempt    
@require_http_methods(["POST"])
def upload_file(request):
    """ファイルアップロード用のAPI"""
    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return JsonResponse({
            'message': 'No file uploaded',
            'status': 'error'
        }, status=400)

    # ファイルを保存（MEDIA_ROOT に保存されます）
    file_path = f'media/{uploaded_file.name}'
    with open(file_path, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    return JsonResponse({
        'message': 'File uploaded successfully',
        'status': 'success',
        'filename': uploaded_file.name
    }, status=201)