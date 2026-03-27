import { getDb } from "@/lib/db";

function nowSql() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function mapUser(row) {
  return row
    ? {
        _id: String(row.id),
        id: String(row.id),
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        balance: Number(row.balance || 0),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    : null;
}

function mapService(row) {
  return {
    _id: String(row.id),
    id: String(row.id),
    providerId: row.provider_id,
    name: row.name,
    category: row.category,
    rate: Number(row.rate),
    min: Number(row.min_quantity),
    max: Number(row.max_quantity),
    refill: Boolean(row.refill),
    cancel: Boolean(row.can_cancel),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapOrder(row) {
  return {
    _id: String(row.id),
    id: String(row.id),
    userId: String(row.user_id),
    providerOrderId: row.provider_order_id,
    serviceId: row.service_id,
    serviceName: row.service_name,
    link: row.link,
    quantity: Number(row.quantity),
    charge: Number(row.charge),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapTicket(row, messages = []) {
  return {
    _id: String(row.id),
    id: String(row.id),
    userId: String(row.user_id),
    subject: row.subject,
    status: row.status,
    messages,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapTicketMessage(row) {
  return {
    _id: String(row.id),
    id: String(row.id),
    senderRole: row.sender_role,
    message: row.message,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function loadTicketMessages(ticketIds) {
  if (!ticketIds.length) {
    return new Map();
  }

  const db = await getDb();
  const placeholders = ticketIds.map(() => "?").join(", ");
  const [rows] = await db.query(
    `SELECT * FROM ticket_messages WHERE ticket_id IN (${placeholders}) ORDER BY created_at ASC`,
    ticketIds
  );

  const grouped = new Map();
  for (const row of rows) {
    const key = String(row.ticket_id);
    const current = grouped.get(key) || [];
    current.push(mapTicketMessage(row));
    grouped.set(key, current);
  }

  return grouped;
}

export async function createUser(user) {
  const db = await getDb();
  const timestamp = nowSql();
  const [result] = await db.execute(
    `INSERT INTO users (name, email, password, role, balance, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user.name, user.email.toLowerCase(), user.password, user.role ?? "user", user.balance ?? 0, timestamp, timestamp]
  );

  return getUserById(result.insertId);
}

export async function findUserByEmail(email) {
  const db = await getDb();
  const [rows] = await db.execute(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email.toLowerCase()]);
  return mapUser(rows[0]);
}

export async function getUserById(userId) {
  const db = await getDb();
  const [rows] = await db.execute(`SELECT * FROM users WHERE id = ? LIMIT 1`, [userId]);
  return mapUser(rows[0]);
}

export async function listUsers(limit = 20) {
  const db = await getDb();
  const [rows] = await db.execute(`SELECT * FROM users ORDER BY created_at DESC LIMIT ?`, [limit]);
  return rows.map(mapUser);
}

export async function updateUserBalance(userId, delta) {
  const db = await getDb();
  await db.execute(
    `UPDATE users SET balance = balance + ?, updated_at = ? WHERE id = ?`,
    [Number(delta || 0), nowSql(), userId]
  );
  return getUserById(userId);
}

export async function listServices() {
  const db = await getDb();
  const [rows] = await db.query(`SELECT * FROM services ORDER BY category ASC, name ASC`);
  return rows.map(mapService);
}

export async function countServices() {
  const db = await getDb();
  const [rows] = await db.query(`SELECT COUNT(*) AS count FROM services`);
  return Number(rows[0]?.count || 0);
}

export async function getServiceByProviderId(providerId) {
  const db = await getDb();
  const [rows] = await db.execute(`SELECT * FROM services WHERE provider_id = ? LIMIT 1`, [String(providerId)]);
  return rows[0] ? mapService(rows[0]) : null;
}

export async function upsertServices(services) {
  const db = await getDb();
  const timestamp = nowSql();

  for (const service of services) {
    await db.execute(
      `INSERT INTO services
        (provider_id, name, category, rate, min_quantity, max_quantity, refill, can_cancel, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        category = VALUES(category),
        rate = VALUES(rate),
        min_quantity = VALUES(min_quantity),
        max_quantity = VALUES(max_quantity),
        refill = VALUES(refill),
        can_cancel = VALUES(can_cancel),
        updated_at = VALUES(updated_at)`,
      [
        String(service.providerId),
        service.name,
        service.category,
        service.rate,
        service.min,
        service.max,
        service.refill ? 1 : 0,
        service.cancel ? 1 : 0,
        timestamp,
        timestamp
      ]
    );
  }
}

export async function createOrder(order) {
  const db = await getDb();
  const timestamp = nowSql();
  const [result] = await db.execute(
    `INSERT INTO orders
      (user_id, provider_order_id, service_id, service_name, link, quantity, charge, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order.userId,
      order.providerOrderId,
      order.serviceId,
      order.serviceName,
      order.link,
      order.quantity,
      order.charge,
      order.status,
      timestamp,
      timestamp
    ]
  );

  const [rows] = await db.execute(`SELECT * FROM orders WHERE id = ? LIMIT 1`, [result.insertId]);
  return mapOrder(rows[0]);
}

export async function listOrdersByUser(userId, query = "") {
  const db = await getDb();
  let sql = `SELECT * FROM orders WHERE user_id = ?`;
  const params = [userId];

  if (query) {
    sql += ` AND (service_name LIKE ? OR status LIKE ? OR provider_order_id LIKE ?)`;
    const like = `%${query}%`;
    params.push(like, like, like);
  }

  sql += ` ORDER BY created_at DESC`;
  const [rows] = await db.execute(sql, params);
  return rows.map(mapOrder);
}

export async function listRecentOrdersByUser(userId, limit = 5) {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
    [userId, limit]
  );
  return rows.map(mapOrder);
}

export async function countOrdersByUser(userId) {
  const db = await getDb();
  const [rows] = await db.execute(`SELECT COUNT(*) AS count FROM orders WHERE user_id = ?`, [userId]);
  return Number(rows[0]?.count || 0);
}

export async function listRecentOrders(limit = 20) {
  const db = await getDb();
  const [rows] = await db.execute(`SELECT * FROM orders ORDER BY created_at DESC LIMIT ?`, [limit]);
  return rows.map(mapOrder);
}

export async function listOrdersForSync(userId, limit = 15) {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
    [userId, limit]
  );
  return rows.map(mapOrder);
}

export async function updateOrderStatus(orderId, status) {
  const db = await getDb();
  await db.execute(`UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`, [status, nowSql(), orderId]);
}

export async function createTicket(ticket) {
  const db = await getDb();
  const timestamp = nowSql();
  const [result] = await db.execute(
    `INSERT INTO tickets (user_id, subject, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [ticket.userId, ticket.subject, ticket.status ?? "open", timestamp, timestamp]
  );

  for (const message of ticket.messages || []) {
    await db.execute(
      `INSERT INTO ticket_messages (ticket_id, sender_role, message, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [result.insertId, message.senderRole, message.message, timestamp, timestamp]
    );
  }

  return getTicketByIdForUser(result.insertId, ticket.userId);
}

export async function listTicketsByUser(userId) {
  const db = await getDb();
  const [rows] = await db.execute(`SELECT * FROM tickets WHERE user_id = ? ORDER BY updated_at DESC`, [userId]);
  const ids = rows.map((row) => row.id);
  const messageMap = await loadTicketMessages(ids);
  return rows.map((row) => mapTicket(row, messageMap.get(String(row.id)) || []));
}

export async function listRecentTicketsByUser(userId, limit = 5) {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT * FROM tickets WHERE user_id = ? ORDER BY updated_at DESC LIMIT ?`,
    [userId, limit]
  );
  const ids = rows.map((row) => row.id);
  const messageMap = await loadTicketMessages(ids);
  return rows.map((row) => mapTicket(row, messageMap.get(String(row.id)) || []));
}

export async function getTicketByIdForUser(ticketId, userId) {
  const db = await getDb();
  const [rows] = await db.execute(`SELECT * FROM tickets WHERE id = ? AND user_id = ? LIMIT 1`, [ticketId, userId]);
  if (!rows[0]) {
    return null;
  }

  const messageMap = await loadTicketMessages([rows[0].id]);
  return mapTicket(rows[0], messageMap.get(String(rows[0].id)) || []);
}

export async function appendTicketReply(ticketId, message) {
  const db = await getDb();
  const timestamp = nowSql();

  await db.execute(
    `INSERT INTO ticket_messages (ticket_id, sender_role, message, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [ticketId, message.senderRole, message.message, timestamp, timestamp]
  );

  await db.execute(`UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?`, [message.status ?? "open", timestamp, ticketId]);

  const [rows] = await db.execute(`SELECT user_id FROM tickets WHERE id = ? LIMIT 1`, [ticketId]);
  return rows[0] ? getTicketByIdForUser(ticketId, rows[0].user_id) : null;
}

export async function listRecentTickets(limit = 20) {
  const db = await getDb();
  const [rows] = await db.execute(`SELECT * FROM tickets ORDER BY updated_at DESC LIMIT ?`, [limit]);
  const ids = rows.map((row) => row.id);
  const messageMap = await loadTicketMessages(ids);
  return rows.map((row) => mapTicket(row, messageMap.get(String(row.id)) || []));
}
