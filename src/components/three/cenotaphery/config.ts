/**
 * КЕНОТАФАРИЙ - МАТЕМАТИЧЕСКАЯ МОДЕЛЬ
 *
 * Все размеры в метрах (1 unit Three.js = 1 метр)
 *
 * ВСЕ ПАРАМЕТРЫ ВЫЧИСЛЯЮТСЯ ИЗ БАЗОВЫХ КОНСТАНТ:
 * - Размеры ниши (ширина, высота, глубина)
 * - Толщины (пол, потолок, перегородка, задняя стенка)
 * - Количество ниш на стену
 * - Количество уровней
 *
 * ИТОГО НИШ: 5 × 31 × 8 - 15 = 1240 - 15 = 1225 = 35²
 */

// ============================================
// БАЗОВЫЕ КОНСТАНТЫ (первичные параметры)
// ============================================

// --- Размеры ниши ---
/** Ширина ниши (метры) */
export const NICHE_WIDTH = 2.0;

/** Высота ниши (метры) */
export const NICHE_HEIGHT = 2.5;

/** Глубина ниши (метры) */
export const NICHE_DEPTH = 3.0;

// --- Толщины ---
/** Толщина пола ниши (метры) - расстояние от низа уровня до низа ниши */
export const FLOOR_THICKNESS = 0.25;

/** Толщина потолка ниши (метры) - расстояние от верха ниши до верха уровня */
export const CEILING_THICKNESS = 0.25;

/** Ширина перегородки между нишами (метры) */
export const PARTITION_WIDTH = 0.5;

/** Толщина задней стенки за нишей (метры) */
export const BACK_WALL_THICKNESS = 0.5;

// --- Количества ---
/** Количество ниш на одну стену на один уровень */
export const NICHES_PER_WALL = 10;

/** Количество уровней */
export const LEVELS = 8;

// --- Вход (опционально, пока не используется) ---
/** Ширина входа в нишах */
export const ENTRANCE_WIDTH = 2;

/** Высота входа в уровнях */
export const ENTRANCE_HEIGHT = 3;

/** Индекс стены с входом (0-4) */
export const ENTRANCE_WALL = 0;

// ============================================
// ВЫЧИСЛЯЕМЫЕ ПАРАМЕТРЫ (производные от базовых)
// ============================================

/** Высота одного уровня = пол + ниша + потолок (метры) */
export const LEVEL_HEIGHT = FLOOR_THICKNESS + NICHE_HEIGHT + CEILING_THICKNESS;
// = 0.25 + 2.5 + 0.25 = 3.0м

/** Длина одной стены = ниши + перегородки (метры) */
export const WALL_LENGTH = NICHES_PER_WALL * NICHE_WIDTH + (NICHES_PER_WALL + 1) * PARTITION_WIDTH;
// = 31 * 2.0 + 32 * 0.5 = 62 + 16 = 78м

/** Толщина стены = глубина ниши + задняя стенка (метры) */
export const WALL_THICKNESS = NICHE_DEPTH + BACK_WALL_THICKNESS;
// = 3.0 + 0.5 = 3.5м

/** Внутренний радиус пятиугольника (апофема) (метры)
 * Для правильного пятиугольника: сторона = 2 × R × sin(36°)
 * R = сторона / (2 × sin(36°))
 */
export const INNER_RADIUS = WALL_LENGTH / (2 * Math.sin(Math.PI / 5));
// = 78 / 1.17557 ≈ 66.3м

/** Внешний радиус пятиугольника (метры)
 * Внешний радиус = внутренний радиус + толщина стены / cos(36°)
 * (толщина стены измеряется перпендикулярно стене, а радиус — от центра)
 */
export const OUTER_RADIUS = INNER_RADIUS + WALL_THICKNESS / Math.cos(Math.PI / 5);

/** Общая высота кенотафария = уровни × высота уровня (метры) */
export const WALL_HEIGHT = LEVELS * LEVEL_HEIGHT;
// = 8 * 3.0 = 24м

/** Общее количество ниш (без входа) */
export const TOTAL_NICHES = 5 * NICHES_PER_WALL * LEVELS - ENTRANCE_WIDTH * ENTRANCE_HEIGHT;
// = 5 * 31 * 8 - 15 = 1240 - 15 = 1225 = 35²

// --- Вычисляемые параметры входа ---

/** Индекс первой ниши входа (0-indexed, по центру с Math.floor) */
export const ENTRANCE_START_NICHE = Math.floor((NICHES_PER_WALL - ENTRANCE_WIDTH) / 2);
// При NICHES_PER_WALL=10, ENTRANCE_WIDTH=2: (10-2)/2 = 4

/** Индекс последней ниши входа (включительно) */
export const ENTRANCE_END_NICHE = ENTRANCE_START_NICHE + ENTRANCE_WIDTH - 1;
// = 4 + 2 - 1 = 5

/** Ширина проёма входа в метрах */
export const ENTRANCE_WIDTH_METERS =
  ENTRANCE_WIDTH * NICHE_WIDTH + (ENTRANCE_WIDTH - 1) * PARTITION_WIDTH;
// = 2 * 2.0 + 1 * 0.5 = 4.5м

/** Высота проёма входа в метрах */
export const ENTRANCE_HEIGHT_METERS = ENTRANCE_HEIGHT * LEVEL_HEIGHT;
// = 3 * 3.0 = 9.0м

// ============================================
// ОБЪЕКТ КОНФИГУРАЦИИ (для совместимости)
// ============================================

export const CENOTAPHERY_CONFIG = {
  // Базовые - размеры ниши
  nicheWidth: NICHE_WIDTH,
  nicheHeight: NICHE_HEIGHT,
  nicheDepth: NICHE_DEPTH,

  // Базовые - толщины
  floorThickness: FLOOR_THICKNESS,
  ceilingThickness: CEILING_THICKNESS,
  partitionWidth: PARTITION_WIDTH,
  backWallThickness: BACK_WALL_THICKNESS,

  // Базовые - количества
  nichesPerWall: NICHES_PER_WALL,
  levels: LEVELS,

  // Базовые - вход
  entranceWidth: ENTRANCE_WIDTH,
  entranceHeight: ENTRANCE_HEIGHT,
  entranceWall: ENTRANCE_WALL,

  // Вычисляемые
  levelHeight: LEVEL_HEIGHT,
  entranceStartNiche: ENTRANCE_START_NICHE,
  entranceEndNiche: ENTRANCE_END_NICHE,
  entranceWidthMeters: ENTRANCE_WIDTH_METERS,
  entranceHeightMeters: ENTRANCE_HEIGHT_METERS,
  wallLength: WALL_LENGTH,
  wallThickness: WALL_THICKNESS,
  innerRadius: INNER_RADIUS,
  outerRadius: OUTER_RADIUS,
  wallHeight: WALL_HEIGHT,
  totalNiches: TOTAL_NICHES,
};
