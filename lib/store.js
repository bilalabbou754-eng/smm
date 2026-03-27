import { getDb } from "@/lib/db";

function withId(id, data) {
  return {
    _id: id,
    id,
    ...data
  };
}

function nowIso() {
  return new Date().toISOString();
}

export async function createUser(user) {
  const db = await getDb();
  const timestamp = nowIso();
  const ref = db.collection("users").doc();
  const payload = {
    ...user,
    balance: user.balance ?? 0,
    role: user.role ?? "user",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await ref.set(payload);
  return withId(ref.id, payload);
}

export async function findUserByEmail(email) {
  const db = await getDb();
  const snapshot = await db.collection("users").where("email", "==", email.toLowerCase()).limit(1).get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return withId(doc.id, doc.data());
}

export async function getUserById(userId) {
  const db = await getDb();
  const doc = await db.collection("users").doc(String(userId)).get();

  if (!doc.exists) {
    return null;
  }

  return withId(doc.id, doc.data());
}

export async function listUsers(limit = 20) {
  const db = await getDb();
  const snapshot = await db.collection("users").orderBy("createdAt", "desc").limit(limit).get();
  return snapshot.docs.map((doc) => withId(doc.id, doc.data()));
}

export async function updateUserBalance(userId, delta) {
  const db = await getDb();
  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  const nextBalance = Number(user.balance || 0) + Number(delta || 0);
  const updatedAt = nowIso();

  await db.collection("users").doc(String(userId)).update({
    balance: nextBalance,
    updatedAt
  });

  return { ...user, balance: nextBalance, updatedAt };
}

export async function listServices() {
  const db = await getDb();
  const snapshot = await db.collection("services").orderBy("category").orderBy("name").get();
  return snapshot.docs.map((doc) => withId(doc.id, doc.data()));
}

export async function countServices() {
  const db = await getDb();
  const snapshot = await db.collection("services").get();
  return snapshot.size;
}

export async function getServiceByProviderId(providerId) {
  const db = await getDb();
  const snapshot = await db.collection("services").where("providerId", "==", String(providerId)).limit(1).get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return withId(doc.id, doc.data());
}

export async function upsertServices(services) {
  const db = await getDb();
  const timestamp = nowIso();

  await Promise.all(
    services.map(async (service) => {
      const existing = await db.collection("services").where("providerId", "==", String(service.providerId)).limit(1).get();

      if (existing.empty) {
        await db.collection("services").add({
          ...service,
          providerId: String(service.providerId),
          createdAt: timestamp,
          updatedAt: timestamp
        });
        return;
      }

      await existing.docs[0].ref.update({
        ...service,
        providerId: String(service.providerId),
        updatedAt: timestamp
      });
    })
  );
}

export async function createOrder(order) {
  const db = await getDb();
  const timestamp = nowIso();
  const ref = db.collection("orders").doc();
  const payload = {
    ...order,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await ref.set(payload);
  return withId(ref.id, payload);
}

export async function listOrdersByUser(userId, query = "") {
  const db = await getDb();
  const snapshot = await db.collection("orders").where("userId", "==", String(userId)).get();
  const orders = snapshot.docs
    .map((doc) => withId(doc.id, doc.data()))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  if (!query) {
    return orders;
  }

  const normalized = query.toLowerCase();
  return orders.filter((order) =>
    [order.serviceName, order.status, order.providerOrderId].some((value) => String(value || "").toLowerCase().includes(normalized))
  );
}

export async function listRecentOrdersByUser(userId, limit = 5) {
  const orders = await listOrdersByUser(userId);
  return orders.slice(0, limit);
}

export async function countOrdersByUser(userId) {
  const orders = await listOrdersByUser(userId);
  return orders.length;
}

export async function listRecentOrders(limit = 20) {
  const db = await getDb();
  const snapshot = await db.collection("orders").orderBy("createdAt", "desc").limit(limit).get();
  return snapshot.docs.map((doc) => withId(doc.id, doc.data()));
}

export async function listOrdersForSync(userId, limit = 15) {
  const orders = await listOrdersByUser(userId);
  return orders.slice(0, limit);
}

export async function updateOrderStatus(orderId, status) {
  const db = await getDb();
  await db.collection("orders").doc(String(orderId)).update({
    status,
    updatedAt: nowIso()
  });
}

export async function createTicket(ticket) {
  const db = await getDb();
  const timestamp = nowIso();
  const ref = db.collection("tickets").doc();
  const payload = {
    ...ticket,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await ref.set(payload);
  return withId(ref.id, payload);
}

export async function listTicketsByUser(userId) {
  const db = await getDb();
  const snapshot = await db.collection("tickets").where("userId", "==", String(userId)).get();
  return snapshot.docs
    .map((doc) => withId(doc.id, doc.data()))
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

export async function listRecentTicketsByUser(userId, limit = 5) {
  const tickets = await listTicketsByUser(userId);
  return tickets.slice(0, limit);
}

export async function getTicketByIdForUser(ticketId, userId) {
  const db = await getDb();
  const doc = await db.collection("tickets").doc(String(ticketId)).get();

  if (!doc.exists) {
    return null;
  }

  const ticket = withId(doc.id, doc.data());
  return ticket.userId === String(userId) ? ticket : null;
}

export async function appendTicketReply(ticketId, message) {
  const db = await getDb();
  const doc = await db.collection("tickets").doc(String(ticketId)).get();

  if (!doc.exists) {
    return null;
  }

  const ticket = doc.data();
  const messages = Array.isArray(ticket.messages) ? ticket.messages : [];
  const updatedAt = nowIso();
  const nextMessages = [
    ...messages,
    {
      _id: crypto.randomUUID(),
      senderRole: message.senderRole,
      message: message.message,
      createdAt: updatedAt
    }
  ];

  await db.collection("tickets").doc(String(ticketId)).update({
    messages: nextMessages,
    status: message.status ?? "open",
    updatedAt
  });

  return withId(doc.id, {
    ...ticket,
    messages: nextMessages,
    status: message.status ?? "open",
    updatedAt
  });
}

export async function listRecentTickets(limit = 20) {
  const db = await getDb();
  const snapshot = await db.collection("tickets").orderBy("updatedAt", "desc").limit(limit).get();
  return snapshot.docs.map((doc) => withId(doc.id, doc.data()));
}
