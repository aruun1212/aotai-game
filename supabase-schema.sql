-- =============================================
-- 鳌太多人系统 · 数据库建表 SQL
-- 在 Supabase Dashboard → SQL Editor 中执行
-- =============================================

-- 1. 玩家表
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL DEFAULT '旅人',
  emoji TEXT NOT NULL DEFAULT '🧑',
  items_left INT DEFAULT 0,
  people_helped INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 营地物资表
CREATE TABLE IF NOT EXISTS camp_items (
  id SERIAL PRIMARY KEY,
  camp_id TEXT NOT NULL,
  owner_id UUID REFERENCES players(id),
  owner_name TEXT NOT NULL DEFAULT '旅人',
  owner_emoji TEXT NOT NULL DEFAULT '🧑',
  item_def_id TEXT NOT NULL,
  item_quantity REAL DEFAULT 1,
  picked BOOLEAN DEFAULT FALSE,
  expired BOOLEAN DEFAULT FALSE,
  picked_by UUID REFERENCES players(id),
  picked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 通知表
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 索引
CREATE INDEX IF NOT EXISTS idx_camp_items_camp ON camp_items(camp_id, picked, expired);
CREATE INDEX IF NOT EXISTS idx_camp_items_owner ON camp_items(owner_id);
CREATE INDEX IF NOT EXISTS idx_notifications_player ON notifications(player_id, read);

-- 5. RLS (Row Level Security) — 允许匿名读写
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 所有人可读所有表
CREATE POLICY "Anyone can read players" ON players FOR SELECT USING (true);
CREATE POLICY "Anyone can read camp_items" ON camp_items FOR SELECT USING (true);
CREATE POLICY "Anyone can read own notifications" ON notifications FOR SELECT USING (true);

-- 所有人可插入
CREATE POLICY "Anyone can insert players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert camp_items" ON camp_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- 所有人可更新
CREATE POLICY "Anyone can update players" ON players FOR UPDATE USING (true);
CREATE POLICY "Anyone can update camp_items" ON camp_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can update notifications" ON notifications FOR UPDATE USING (true);
