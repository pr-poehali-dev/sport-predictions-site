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
    """История покупок и добавление прогноза в кабинет"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    user_id = get_user_id(event)

    if not user_id:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

    conn = get_conn()
    cur = conn.cursor()

    # Получить историю покупок
    if method == 'GET':
        cur.execute(
            f"""SELECT id, match_name, league, sport, analyst, price, prediction, purchase_date, match_date
                FROM {SCHEMA}.purchases WHERE user_id=%s ORDER BY purchase_date DESC""",
            (user_id,)
        )
        rows = cur.fetchall()
        conn.close()
        purchases = [
            {
                'id': r[0], 'match_name': r[1], 'league': r[2], 'sport': r[3],
                'analyst': r[4], 'price': r[5], 'prediction': r[6],
                'purchase_date': str(r[7]), 'match_date': r[8]
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'purchases': purchases})}

    # Добавить покупку
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        cur.execute(
            f"""INSERT INTO {SCHEMA}.purchases
                (user_id, match_name, league, sport, analyst, price, prediction, match_date)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
            (
                user_id,
                body.get('match_name', ''),
                body.get('league', ''),
                body.get('sport', ''),
                body.get('analyst', ''),
                body.get('price', 0),
                body.get('prediction', ''),
                body.get('match_date', '')
            )
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'id': new_id})}

    conn.close()
    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}
