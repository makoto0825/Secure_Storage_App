import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .upload_server import send_file_to_server  # 成功/失敗を返す関数
from .download_server import download_server  
from .get_file_list_from_server import get_file_list_from_server  # ファイル一覧を取得する関数
from django.http import FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt




@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    return JsonResponse({
        'message': 'Hello from Django!',
        'status': 'success',
        'timestamp': '2024-01-01 12:00:00'
    })

@csrf_exempt
@require_http_methods(["POST"])
def test_api(request):
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
    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return JsonResponse({'message': 'No file uploaded', 'status': 'error'}, status=400)

    temp_dir = 'media/temp'
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, uploaded_file.name)

    try:
        # ファイルを保存
        with open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # socket送信（成功/失敗を判定）
        success = send_file_to_server(file_path, uploaded_file.name)

        # ファイル削除（成功・失敗問わず）
        if os.path.exists(file_path):
            os.remove(file_path)

        if not success:
            return JsonResponse({
                'message': 'File upload succeeded, but server failed to save it.',
                'status': 'error'
            }, status=502)

        return JsonResponse({
            'message': 'File uploaded and sent to server successfully',
            'status': 'success',
            'filename': uploaded_file.name
        }, status=201)

    except Exception as e:
        # ファイル削除（予期せぬ例外時）
        if os.path.exists(file_path):
            os.remove(file_path)
        return JsonResponse({'message': f'Upload failed: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def download_file(request):
    print("✅ /download/ にリクエストが届きました")

    file_name = request.GET.get('file')  # ← クエリパラメータから取得
    if not file_name:
        return HttpResponse("ファイル名が指定されていません", status=400)

    try:
        # socket経由でファイル取得
        file_data = download_server(file_name)

        # 一時保存ディレクトリに保存
        temp_dir = 'media/temp'
        os.makedirs(temp_dir, exist_ok=True)
        file_path = os.path.join(temp_dir, file_name)

        with open(file_path, 'wb') as f:
            f.write(file_data)

        # ファイルをレスポンスとして返却
        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)

    except Exception as e:
        print(f"❌ エラー: {e}")
        return HttpResponse(f"ダウンロード失敗: {e}", status=500)
    
@csrf_exempt
@require_http_methods(["GET"])
def get_files_api(request):
    try:
        files = get_file_list_from_server()
        return JsonResponse({'files': files}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)