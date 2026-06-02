-- =============================================
-- 鳌太多人系统 · 补充表：坏档 + 足迹世界
-- 在 Supabase Dashboard → SQL Editor 中执行
-- =============================================

-- 坏档表（玩家死亡时留在山上）
CREATE TABLE IF NOT EXISTS dead_players (
  id SERIAL PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  nickname TEXT NOT NULL DEFAULT '旅人',
  emoji TEXT NOT NULL DEFAULT '🧑',
  segment_id INT NOT NULL,
  grid_position INT NOT NULL DEFAULT 0,
  death_cause TEXT,
  death_narrative TEXT,
  discovered_by UUID REFERENCES players(id),
  discovered_at TIMESTAMPTZ,
  brought_out BOOLEAN DEFAULT FALSE,
  brought_out_by UUID REFERENCES players(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 足迹世界表（通关/下撤时记录）
CREATE TABLE IF NOT EXISTS footprints (
  id SERIAL PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  nickname TEXT NOT NULL DEFAULT '旅人',
  emoji TEXT NOT NULL DEFAULT '🧑',
  ending_type TEXT NOT NULL,
  max_segment_id INT NOT NULL,
  max_grid_position INT NOT NULL DEFAULT 0,
  turns_played INT NOT NULL DEFAULT 0,
  dead_carried TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_dead_players_location ON dead_players(segment_id, grid_position, brought_out);
CREATE INDEX IF NOT EXISTS idx_dead_players_undiscovered ON dead_players(discovered_by) WHERE discovered_by IS NULL;
CREATE INDEX IF NOT EXISTS idx_footprints_recent ON footprints(created_at DESC);

-- RLS
ALTER TABLE dead_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE footprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read dead_players" ON dead_players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert dead_players" ON dead_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update dead_players" ON dead_players FOR UPDATE USING (true);

CREATE POLICY "Anyone can read footprints" ON footprints FOR SELECT USING (true);
CREATE POLICY "Anyone can insert footprints" ON footprints FOR INSERT WITH CHECK (true);
