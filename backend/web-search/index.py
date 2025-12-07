'''
Business: Web search using Wikipedia API for reliable results
Args: event with query parameter 'q'
Returns: Search results as JSON with snippets
'''
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, List
import ssl

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
        
        # Create SSL context that doesn't verify certificates (for Cloud Functions)
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        # Wikipedia API search
        try:
            # Search Wikipedia
            search_url = f'https://ru.wikipedia.org/w/api.php?action=opensearch&search={encoded_query}&limit=3&namespace=0&format=json'
            req = urllib.request.Request(search_url)
            req.add_header('User-Agent', 'LinaBot/1.0 (https://gorkhon.online; support@gorkhon.online)')
            
            with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
                data = json.loads(response.read().decode('utf-8'))
                
                # data format: [query, [titles], [descriptions], [urls]]
                if len(data) >= 4:
                    titles = data[1]
                    descriptions = data[2]
                    urls = data[3]
                    
                    for i in range(min(len(titles), 3)):
                        if descriptions[i]:
                            results.append({
                                'text': descriptions[i],
                                'url': urls[i] if i < len(urls) else '',
                                'title': titles[i]
                            })
        except Exception as e:
            print(f'Wikipedia search failed: {e}')
        
        # Fallback: try to get page extract if we have results
        if results and len(results) > 0:
            try:
                page_title = urllib.parse.quote(results[0]['title'])
                extract_url = f'https://ru.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles={page_title}&format=json'
                req_extract = urllib.request.Request(extract_url)
                req_extract.add_header('User-Agent', 'LinaBot/1.0')
                
                with urllib.request.urlopen(req_extract, timeout=8, context=ctx) as response:
                    extract_data = json.loads(response.read().decode('utf-8'))
                    pages = extract_data.get('query', {}).get('pages', {})
                    
                    for page_id, page_info in pages.items():
                        extract = page_info.get('extract', '')
                        if extract:
                            # Take first 2 sentences
                            sentences = extract.split('. ')[:2]
                            short_extract = '. '.join(sentences)
                            if short_extract and len(short_extract) > 50:
                                results[0]['text'] = short_extract
            except Exception as e:
                print(f'Extract fetch failed: {e}')
        
        # If no results, try different approach
        if not results:
            # Try searching in English Wikipedia as fallback
            try:
                search_url_en = f'https://en.wikipedia.org/w/api.php?action=opensearch&search={encoded_query}&limit=2&namespace=0&format=json'
                req_en = urllib.request.Request(search_url_en)
                req_en.add_header('User-Agent', 'LinaBot/1.0')
                
                with urllib.request.urlopen(req_en, timeout=8, context=ctx) as response:
                    data_en = json.loads(response.read().decode('utf-8'))
                    
                    if len(data_en) >= 4 and len(data_en[1]) > 0:
                        titles = data_en[1]
                        descriptions = data_en[2]
                        urls = data_en[3]
                        
                        for i in range(min(len(titles), 2)):
                            if descriptions[i]:
                                results.append({
                                    'text': f'{titles[i]}: {descriptions[i]}',
                                    'url': urls[i] if i < len(urls) else '',
                                    'title': titles[i]
                                })
            except Exception as e:
                print(f'English Wikipedia failed: {e}')
        
        # If still no results
        if not results:
            results.append({
                'text': f'По запросу "{query}" не нашла информации в Википедии. Попробуйте переформулировать или спросите о чём-то другом.',
                'url': '',
                'title': 'Нет результатов'
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
        print(f'Search error: {e}')
        return {
            'statusCode': 200,  # Return 200 to avoid frontend errors
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'query': query,
                'results': [f'Сейчас не могу выполнить поиск. Попробуйте спросить по-другому или задайте вопрос о Горхоне — там я точно помогу!'],
                'detailed_results': [],
                'hasResults': False
            }, ensure_ascii=False)
        }
