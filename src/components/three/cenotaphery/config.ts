/**
 * КЕНОТАФАРИЙ - МАТЕМАТИЧЕСКАЯ МОДЕЛЬ
 *
 * Все размеры в метрах (1 unit Three.js = 1 метр)
 *
 * ФИКСИРОВАННЫЕ ПАРАМЕТРЫ (из документации):
 * - Ниша: 2.0м × 2.5м × 3.0м (ширина × высота × глубина)
 * - Перегородка между нишами: 0.5м
 * - Высота уровня: 3.0м
 * - Уровней: 8
 * - Ниш на стену: 31
 * - Вход: 5 ниш × 3 уровня = 15 ниш
 *
 * ВЫЧИСЛЯЕМЫЕ ПАРАМЕТРЫ:
 * - Длина стены = 31 × 2.0 + 32 × 0.5 = 62 + 16 = 78м
 * - Радиус пятиугольника = 78 / (2 × sin(36°)) = 78 / 1.176 ≈ 66.3м
 * - Общая высота = 8 × 3.0 = 24м
 * - Толщина стены = глубина ниши (3.0м) + задняя стенка (0.5м) = 3.5м
 *
 * ИТОГО НИШ: 5 × 31 × 8 - 15 = 1240 - 15 = 1225 = 35²
 */

// ============================================
// ФИКСИРОВАННЫЕ ПАРАМЕТРЫ (не менять без причины)
// ============================================

/** Ширина ниши (метры) */
export const NICHE_WIDTH = 2.0

/** Высота ниши (метры) */
export const NICHE_HEIGHT = 2.5

/** Глубина ниши (метры) */
export const NICHE_DEPTH = 3.0

/** Толщина задней стенки за нишей (метры) */
export const BACK_WALL_THICKNESS = 0.5

/** Ширина перегородки между нишами (метры) */
export const PARTITION_WIDTH = 0.5

/** Количество ниш на одну стену на один уровень */
export const NICHES_PER_WALL = 31

/** Количество уровней */
export const LEVELS = 8

/** Высота одного уровня (метры) */
export const LEVEL_HEIGHT = 3.0

/** Ширина входа в нишах */
export const ENTRANCE_WIDTH = 5

/** Высота входа в уровнях */
export const ENTRANCE_HEIGHT = 3

/** Индекс стены с входом (0-4) */
export const ENTRANCE_WALL = 0

// ============================================
// ВЫЧИСЛЯЕМЫЕ ПАРАМЕТРЫ
// ============================================

/** Длина одной стены (метры) */
export const WALL_LENGTH = NICHES_PER_WALL * NICHE_WIDTH + (NICHES_PER_WALL + 1) * PARTITION_WIDTH
// = 31 * 2.0 + 32 * 0.5 = 62 + 16 = 78м

/** Внутренний радиус пятиугольника (метры) */
// Для правильного пятиугольника: сторона = 2 × R × sin(36°)
// R = сторона / (2 × sin(36°)) = сторона / 1.17557
export const INNER_RADIUS = WALL_LENGTH / (2 * Math.sin(Math.PI / 5))
// = 78 / 1.17557 ≈ 66.3м

/** Толщина стены = глубина ниши + задняя стенка (метры) */
export const WALL_THICKNESS = NICHE_DEPTH + BACK_WALL_THICKNESS
// = 3.0 + 0.5 = 3.5м

/** Общая высота кенотафария (метры) */
export const WALL_HEIGHT = LEVELS * LEVEL_HEIGHT
// = 8 * 3.0 = 24м

/** Общее количество ниш (без входа) */
export const TOTAL_NICHES = 5 * NICHES_PER_WALL * LEVELS - ENTRANCE_WIDTH * ENTRANCE_HEIGHT
// = 5 * 31 * 8 - 15 = 1240 - 15 = 1225 = 35²

// ============================================
// ОБЪЕКТ КОНФИГУРАЦИИ (для совместимости)
// ============================================

export const CENOTAPHERY_CONFIG = {
  // Фиксированные
  nicheWidth: NICHE_WIDTH,
  nicheHeight: NICHE_HEIGHT,
  nicheDepth: NICHE_DEPTH,
  partitionWidth: PARTITION_WIDTH,
  nichesPerWall: NICHES_PER_WALL,
  levels: LEVELS,
  levelHeight: LEVEL_HEIGHT,
  entranceWidth: ENTRANCE_WIDTH,
  entranceHeight: ENTRANCE_HEIGHT,
  entranceWall: ENTRANCE_WALL,

  // Вычисляемые
  wallLength: WALL_LENGTH,
  innerRadius: INNER_RADIUS,
  wallThickness: WALL_THICKNESS,
  wallHeight: WALL_HEIGHT,
  totalNiches: TOTAL_NICHES,
}
