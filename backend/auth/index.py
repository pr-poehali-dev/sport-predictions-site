import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ['MAIN_DB_SCHEMA']
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization, Authorization',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

def make_token(user_id: int) -> str:
    return hashlib.sha256(f"{user_id}{secrets.token_hex(16)}".encode()).hexdigest() + f"_{user_id}"

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
    """Авторизация: action=register / action=login / GET=me"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    # GET — профиль
    if method == 'GET':
        user_id = get_user_id(event)
        if not user_id:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, email, first_name, last_name, created_at FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не найден'})}
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'user': {
            'id': row[0], 'email': row[1], 'first_name': row[2], 'last_name': row[3], 'created_at': str(row[4])
        }})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action', '')

        if action == 'register':
            email = (body.get('email') or '').strip().lower()
            first_name = (body.get('first_name') or '').strip()
            last_name = (body.get('last_name') or '').strip()
            password = body.get('password') or ''
            if not all([email, first_name, last_name, password]):
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email=%s", (email,))
            if cur.fetchone():
                conn.close()
                return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (email, first_name, last_name, password_hash) VALUES (%s,%s,%s,%s) RETURNING id",
                (email, first_name, last_name, hash_pw(password))
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            conn.close()
            token = make_token(user_id)
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'ok': True, 'token': token,
                'user': {'id': user_id, 'email': email, 'first_name': first_name, 'last_name': last_name}
            })}

        if action == 'login':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                f"SELECT id, first_name, last_name, email FROM {SCHEMA}.users WHERE email=%s AND password_hash=%s",
                (email, hash_pw(password))
            )
            row = cur.fetchone()
            conn.close()
            if not row:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный email или пароль'})}
            user_id, first_name, last_name, email = row
            token = make_token(user_id)
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'ok': True, 'token': token,
                'user': {'id': user_id, 'email': email, 'first_name': first_name, 'last_name': last_name}
            })}

    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверный запрос'})}
