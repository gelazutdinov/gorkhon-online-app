'''
Business: Search the web using DuckDuckGo API for Lina chatbot
Args: event with query parameter
Returns: Search results as JSON
'''
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {})
    query = params.get('q', '')
    
    if not query:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Query parameter "q" is required'})
        }
    
    try:
        encoded_query = urllib.parse.quote(query)
        
        # Используем более надёжный поиск через HTML парсинг
        search_url = f'https://html.duckduckgo.com/html/?q={encoded_query}'
        
        req = urllib.request.Request(search_url)
        req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        results: List[str] = []
        
        try:
            with urllib.request.urlopen(req, timeout=8) as response:
                html = response.read().decode('utf-8')
                
                # Простой парсинг результатов из HTML
                import re
                snippets = re.findall(r'class="result__snippet"[^>]*>([^<]+)', html)
                results = [snippet.strip() for snippet in snippets[:4] if snippet.strip()]
        except:
            # Фоллбэк на API если HTML не работает
            api_url = f'https://api.duckduckgo.com/?q={encoded_query}&format=json&no_html=1&skip_disambig=1'
            req_api = urllib.request.Request(api_url)
            req_api.add_header('User-Agent', 'Mozilla/5.0')
            
            with urllib.request.urlopen(req_api, timeout=8) as response:
                data = json.loads(response.read().decode('utf-8'))
            
            if data.get('AbstractText'):
                results.append(data['AbstractText'])
            
            if data.get('RelatedTopics'):
                for topic in data['RelatedTopics'][:3]:
                    if isinstance(topic, dict) and topic.get('Text'):
                        results.append(topic['Text'])
        
        # Если всё равно нет результатов - добавляем заглушку
        if not results:
            results = [
                f'По запросу "{query}" не найдено актуальной информации.',
                'Попробуйте переформулировать вопрос или спросите агента.'
            ]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'query': query,
                'results': results,
                'hasResults': len(results) > 0
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Search failed: {str(e)}'})
        }