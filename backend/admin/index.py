import json
import os
import psycopg2
# v2

SCHEMA = os.environ['MAIN_DB_SCHEMA']
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def ok(data: dict):
    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, **data})}

def err(msg: str, code: int = 400):
    return {'statusCode': code, 'headers': CORS, 'body': json.dumps({'error': msg})}

def check_auth(event: dict) -> bool:
    headers = event.get('headers') or {}
    key = headers.get('X-Admin-Key') or headers.get('x-admin-key') or ''
    return key == ADMIN_PASSWORD

def handler(event: dict, context) -> dict:
    """Полное управление сайтом: прогнозы, заявки, пользователи"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if not check_auth(event):
        return err('Неверный пароль', 401)

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    section = params.get('section', 'dashboard')
    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    conn = get_conn()
    cur = conn.cursor()

    # ── DASHBOARD — общая статистика ──
    if method == 'GET' and section == 'dashboard':
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users")
        users_total = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.purchases")
        orders_total = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.purchases WHERE status='pending'")
        orders_pending = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.purchases WHERE status='confirmed'")
        orders_confirmed = cur.fetchone()[0]
        cur.execute(f"SELECT COALESCE(SUM(price),0) FROM {SCHEMA}.purchases WHERE status='confirmed'")
        revenue = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.predictions WHERE is_active=TRUE")
        predictions_active = cur.fetchone()[0]
        conn.close()
        return ok({'dashboard': {
            'users_total': users_total,
            'orders_total': orders_total,
            'orders_pending': orders_pending,
            'orders_confirmed': orders_confirmed,
            'revenue': int(revenue),
            'predictions_active': predictions_active,
        }})

    # ── ЗАЯВКИ НА ОПЛАТУ ──
    if method == 'GET' and section == 'orders':
        cur.execute(f"""
            SELECT p.id, p.match_name, p.league, p.sport, p.analyst, p.price,
                   p.prediction, p.purchase_date, p.match_date, p.status, p.payment_note,
                   u.first_name, u.last_name, u.email
            FROM {SCHEMA}.purchases p
            JOIN {SCHEMA}.users u ON u.id = p.user_id
            ORDER BY p.purchase_date DESC
        """)
        rows = cur.fetchall()
        conn.close()
        orders = [{
            'id': r[0], 'match_name': r[1], 'league': r[2], 'sport': r[3],
            'analyst': r[4], 'price': r[5], 'prediction': r[6],
            'purchase_date': str(r[7]), 'match_date': r[8],
            'status': r[9] or 'pending', 'payment_note': r[10],
            'user_name': f"{r[11]} {r[12]}", 'user_email': r[13],
        } for r in rows]
        return ok({'orders': orders})

    # Обновить статус заявки (подтвердить/отклонить + добавить прогноз)
    if method == 'PUT' and section == 'orders':
        cur.execute(f"""
            UPDATE {SCHEMA}.purchases
            SET status=%s, prediction=%s, payment_note=%s
            WHERE id=%s
        """, (body.get('status'), body.get('prediction', ''), body.get('payment_note', ''), body.get('id')))
        conn.commit()
        conn.close()
        return ok({})

    # ── ПРОГНОЗЫ ──
    if method == 'GET' and section == 'predictions':
        cur.execute(f"""
            SELECT id, sport, match_name, league, analyst, description, price,
                   match_date, prediction_text, is_active, created_at
            FROM {SCHEMA}.predictions ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        conn.close()
        predictions = [{
            'id': r[0], 'sport': r[1], 'match_name': r[2], 'league': r[3],
            'analyst': r[4], 'description': r[5], 'price': r[6],
            'match_date': r[7], 'prediction_text': r[8],
            'is_active': r[9], 'created_at': str(r[10]),
        } for r in rows]
        return ok({'predictions': predictions})

    # Создать прогноз
    if method == 'POST' and section == 'predictions':
        cur.execute(f"""
            INSERT INTO {SCHEMA}.predictions
            (sport, match_name, league, analyst, description, price, match_date, prediction_text, is_active)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id
        """, (
            body.get('sport', '⚽'), body.get('match_name', ''), body.get('league', ''),
            body.get('analyst', ''), body.get('description', ''), body.get('price', 990),
            body.get('match_date', ''), body.get('prediction_text', ''), body.get('is_active', True)
        ))
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return ok({'id': new_id})

    # Обновить прогноз
    if method == 'PUT' and section == 'predictions':
        cur.execute(f"""
            UPDATE {SCHEMA}.predictions
            SET sport=%s, match_name=%s, league=%s, analyst=%s, description=%s,
                price=%s, match_date=%s, prediction_text=%s, is_active=%s
            WHERE id=%s
        """, (
            body.get('sport'), body.get('match_name'), body.get('league'),
            body.get('analyst'), body.get('description'), body.get('price'),
            body.get('match_date'), body.get('prediction_text'), body.get('is_active'), body.get('id')
        ))
        conn.commit()
        conn.close()
        return ok({})

    # Удалить прогноз
    if method == 'DELETE' and section == 'predictions':
        cur.execute(f"DELETE FROM {SCHEMA}.predictions WHERE id=%s", (body.get('id'),))
        conn.commit()
        conn.close()
        return ok({})

    # ── ПОЛЬЗОВАТЕЛИ ──
    if method == 'GET' and section == 'users':
        cur.execute(f"""
            SELECT u.id, u.first_name, u.last_name, u.email, u.created_at,
                   COUNT(p.id) as orders, COALESCE(SUM(CASE WHEN p.status='confirmed' THEN p.price ELSE 0 END),0) as spent
            FROM {SCHEMA}.users u
            LEFT JOIN {SCHEMA}.purchases p ON p.user_id = u.id
            GROUP BY u.id ORDER BY u.created_at DESC
        """)
        rows = cur.fetchall()
        conn.close()
        users = [{
            'id': r[0], 'first_name': r[1], 'last_name': r[2],
            'email': r[3], 'created_at': str(r[4]),
            'orders': r[5], 'spent': int(r[6]),
        } for r in rows]
        return ok({'users': users})

    conn.close()
    return err('Неверный запрос')