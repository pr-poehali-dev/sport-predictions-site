import json
import os
import psycopg2

SCHEMA = os.environ['MAIN_DB_SCHEMA']
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization, Authorization',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_user_id(event: dict):
    headers = event.get('headers') or {}
    token = (headers.get('X-Authorization') or headers.get('Authorization') or '').replace('Bearer ', '').strip()
    if not token or '_' not in token:
        return None
    try:
        return int(token.split('_')[-1])
    except Exception:
        return None

def handler(event: dict, context) -> dict:
    """Отзывы и чат — только для авторизованных пользователей"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    section = params.get('section', 'reviews')

    # GET — получить отзывы или сообщения чата (без авторизации)
    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        if section == 'chat':
            cur.execute(f"""
                SELECT id, user_name, text, created_at
                FROM {SCHEMA}.chat_messages
                ORDER BY created_at ASC LIMIT 100
            """)
            rows = cur.fetchall()
            conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'messages': [
                {'id': r[0], 'user_name': r[1], 'text': r[2], 'time': str(r[3])} for r in rows
            ]})}
        else:
            cur.execute(f"""
                SELECT id, user_name, text, rating, created_at
                FROM {SCHEMA}.reviews
                ORDER BY created_at DESC LIMIT 50
            """)
            rows = cur.fetchall()
            conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'reviews': [
                {'id': r[0], 'user_name': r[1], 'text': r[2], 'rating': r[3], 'time': str(r[4])} for r in rows
            ]})}

    # POST — только авторизованные
    user_id = get_user_id(event)
    if not user_id:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Войдите чтобы написать'})}

    conn = get_conn()
    cur = conn.cursor()

    # Получить имя пользователя
    cur.execute(f"SELECT first_name, last_name FROM {SCHEMA}.users WHERE id=%s", (user_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Пользователь не найден'})}
    user_name = f"{row[0]} {row[1]}"

    body = json.loads(event.get('body') or '{}')

    if section == 'chat':
        text = (body.get('text') or '').strip()
        if not text:
            conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Текст не может быть пустым'})}
        cur.execute(f"""
            INSERT INTO {SCHEMA}.chat_messages (user_id, user_name, text)
            VALUES (%s, %s, %s) RETURNING id, created_at
        """, (user_id, user_name, text[:500]))
        r = cur.fetchone()
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
            'ok': True, 'message': {'id': r[0], 'user_name': user_name, 'text': text, 'time': str(r[1])}
        })}

    else:
        text = (body.get('text') or '').strip()
        rating = int(body.get('rating') or 5)
        rating = max(1, min(5, rating))
        if not text:
            conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Напишите текст отзыва'})}
        cur.execute(f"""
            INSERT INTO {SCHEMA}.reviews (user_id, user_name, text, rating)
            VALUES (%s, %s, %s, %s) RETURNING id, created_at
        """, (user_id, user_name, text[:1000], rating))
        r = cur.fetchone()
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
            'ok': True, 'review': {'id': r[0], 'user_name': user_name, 'text': text, 'rating': rating, 'time': str(r[1])}
        })}
