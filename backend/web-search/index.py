'''
Business: Advanced web search using DuckDuckGo with fallbacks for Lina AI assistant
Args: event with query parameter 'q'
Returns: Search results as JSON with snippets and URLs
'''
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, List
import re

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
        results: List[Dict[str, str]] = []
        
        # Method 1: HTML scraping from DuckDuckGo
        try:
            search_url = f'https://html.duckduckgo.com/html/?q={encoded_query}'
            req = urllib.request.Request(search_url)
            req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            req.add_header('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
            req.add_header('Accept-Language', 'ru-RU,ru;q=0.9,en;q=0.8')
            
            with urllib.request.urlopen(req, timeout=10) as response:
                html = response.read().decode('utf-8')
                
                # Extract snippets
                snippet_pattern = r'class="result__snippet"[^>]*>([^<]+(?:<[^>]+>[^<]*</[^>]+>[^<]*)*)'
                snippets = re.findall(snippet_pattern, html)
                
                # Extract URLs
                url_pattern = r'class="result__url"[^>]*>([^<]+)'
                urls = re.findall(url_pattern, html)
                
                # Extract titles
                title_pattern = r'class="result__a"[^>]*>([^<]+)'
                titles = re.findall(title_pattern, html)
                
                # Combine results
                for i in range(min(len(snippets), 5)):
                    snippet = re.sub(r'<[^>]+>', '', snippets[i]).strip()
                    snippet = re.sub(r'\s+', ' ', snippet)
                    
                    if snippet and len(snippet) > 20:
                        result_obj = {'text': snippet}
                        if i < len(urls):
                            result_obj['url'] = urls[i].strip()
                        if i < len(titles):
                            result_obj['title'] = titles[i].strip()
                        results.append(result_obj)
        except Exception as e:
            print(f'HTML scraping failed: {e}')
        
        # Method 2: Fallback to API
        if not results:
            try:
                api_url = f'https://api.duckduckgo.com/?q={encoded_query}&format=json&no_html=1&skip_disambig=1'
                req_api = urllib.request.Request(api_url)
                req_api.add_header('User-Agent', 'Mozilla/5.0')
                
                with urllib.request.urlopen(req_api, timeout=8) as response:
                    data = json.loads(response.read().decode('utf-8'))
                
                if data.get('AbstractText'):
                    results.append({
                        'text': data['AbstractText'],
                        'url': data.get('AbstractURL', ''),
                        'title': 'Abstract'
                    })
                
                if data.get('RelatedTopics'):
                    for topic in data['RelatedTopics'][:4]:
                        if isinstance(topic, dict) and topic.get('Text'):
                            results.append({
                                'text': topic['Text'],
                                'url': topic.get('FirstURL', ''),
                                'title': topic.get('Text', '')[:50]
                            })
            except Exception as e:
                print(f'API fallback failed: {e}')
        
        # If still no results, return friendly message
        if not results:
            results.append({
                'text': f'По запросу "{query}" не найдено точной информации. Попробуйте переформулировать вопрос или спросите что-то другое.',
                'url': '',
                'title': 'Результаты не найдены'
            })
        
        # Format results as simple text list
        result_texts = [r['text'] for r in results if r.get('text')]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'query': query,
                'results': result_texts[:5],
                'detailed_results': results[:5],
                'hasResults': len(results) > 0
            }, ensure_ascii=False)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'error': f'Search failed: {str(e)}',
                'query': query,
                'results': [f'Извините, поиск временно недоступен. Попробуйте позже или спросите что-то другое.'],
                'hasResults': False
            }, ensure_ascii=False)
        }
