"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import {
  WALL_THICKNESS,
  LEVEL_HEIGHT,
  NICHE_WIDTH,
  NICHE_DEPTH,
  NICHE_HEIGHT,
  PARTITION_WIDTH,
  FLOOR_THICKNESS,
  INNER_RADIUS,
  NICHES_PER_WALL,
  LEVELS,
  ENTRANCE_WALL,
  ENTRANCE_HEIGHT,
  ENTRANCE_START_NICHE,
  ENTRANCE_END_NICHE,
  ENTRANCE_WIDTH_METERS,
  ENTRANCE_HEIGHT_METERS,
} from "./config";

/**
 * КЕНОТАФАРИЙ - ОДИН УРОВЕНЬ (3D) - CSG ПОДХОД
 *
 * Логика:
 * 1. Создаём СПЛОШНОЙ пятиугольный кольцевой цилиндр (от innerRadius до outerRadius)
 * 2. Вычитаем из него боксы ниш
 * 3. Результат = стены с нишами, у которых есть пол и потолок
 *
 * РАЗМЕРЫ НИШИ:
 * - Ширина: NICHE_WIDTH = 2.0м
 * - Высота: NICHE_HEIGHT = 2.5м
 * - Глубина: NICHE_DEPTH = 3.0м
 * - Пол: (LEVEL_HEIGHT - NICHE_HEIGHT) / 2 = 0.25м
 * - Потолок: 0.25м (одновременно пол следующего уровня)
 */

// ============================================
// ГЕОМЕТРИЧЕСКИЕ ВЫЧИСЛЕНИЯ
// ============================================

/**
 * Вершины правильного пятиугольника
 */
function getPentagonVertices(radius: number): THREE.Vector2[] {
  const vertices: THREE.Vector2[] = [];
  for (let i = 0; i < 5; i++) {
    // Начинаем с вершины направленной вверх (на -Y в 2D = "север")
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    vertices.push(new THREE.Vector2(radius * Math.cos(angle), radius * Math.sin(angle)));
  }
  return vertices;
}

/**
 * Направление НАРУЖУ от стены - перпендикуляр к стене, направленный от центра
 * Это направление, в котором углубляются ниши
 */
function getWallOutwardNormal(vertices: THREE.Vector2[], wallIndex: number): THREE.Vector2 {
  const v1 = vertices[wallIndex];
  const v2 = vertices[(wallIndex + 1) % 5];
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;

  // Два возможных перпендикуляра к стене
  const perp1 = new THREE.Vector2(-dy, dx).normalize();
  const perp2 = new THREE.Vector2(dy, -dx).normalize();

  // Середина стены - используем для определения направления "наружу"
  const wallMid = new THREE.Vector2((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);

  // Выбираем перпендикуляр, который направлен ОТ центра (dot > 0 с wallMid)
  if (perp1.dot(wallMid) > 0) {
    return perp1;
  } else {
    return perp2;
  }
}

/**
 * Проверяет, является ли ниша частью входа
 * @param wallIndex индекс стены (0-4)
 * @param nicheIndex индекс ниши на стене (0-indexed)
 * @param level номер уровня (1-indexed)
 */
function isEntranceNiche(wallIndex: number, nicheIndex: number, level: number): boolean {
  return (
    wallIndex === ENTRANCE_WALL &&
    level <= ENTRANCE_HEIGHT &&
    nicheIndex >= ENTRANCE_START_NICHE &&
    nicheIndex <= ENTRANCE_END_NICHE
  );
}

/**
 * Создаёт Shape для сплошного пятиугольного кольца (вид сверху)
 * Без ниш - просто внешний пятиугольник с внутренним отверстием
 */
function createSolidPentagonRingShape(innerRadius: number): THREE.Shape {
  // Для пятиугольника: апофема = R * cos(36°)
  // outerRadius * cos(36°) = innerRadius * cos(36°) + WALL_THICKNESS
  // outerRadius = innerRadius + WALL_THICKNESS / cos(36°)
  const cos36 = Math.cos(Math.PI / 5);
  const outerRadius = innerRadius + WALL_THICKNESS / cos36;

  // Внешний контур - простой пятиугольник
  const outerVerts = getPentagonVertices(outerRadius);
  const shape = new THREE.Shape();
  shape.moveTo(outerVerts[0].x, outerVerts[0].y);
  for (let i = 1; i < 5; i++) {
    shape.lineTo(outerVerts[i].x, outerVerts[i].y);
  }
  shape.closePath();

  // Внутренний контур (отверстие) - тоже простой пятиугольник
  const innerVerts = getPentagonVertices(innerRadius);
  const hole = new THREE.Path();
  hole.moveTo(innerVerts[0].x, innerVerts[0].y);
  for (let i = 1; i < 5; i++) {
    hole.lineTo(innerVerts[i].x, innerVerts[i].y);
  }
  hole.closePath();
  shape.holes.push(hole);

  return shape;
}

/**
 * Создаёт геометрию для сплошной пятиугольной стены (один уровень)
 *
 * Shape в плоскости XY, ExtrudeGeometry выдавливает по +Z
 * После rotateX(-PI/2): Y->-Z, Z->Y
 * Значит Shape XY становится X(-Z), выдавливание идёт по +Y
 *
 * Координаты боксов тоже нужно трансформировать:
 * - 2D (x, y) в Shape -> 3D (x, -z) после поворота
 * - Но мы хотим (x, y_height, z) где z = 2D_y
 *
 * Решение: НЕ поворачиваем стену, работаем в XY плоскости
 * Боксы тоже в XY плоскости, выдавливание по Z = высота
 */
function createSolidWallGeometry(innerRadius: number): THREE.BufferGeometry {
  const shape = createSolidPentagonRingShape(innerRadius);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: LEVEL_HEIGHT,
    bevelEnabled: false,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // НЕ поворачиваем - работаем в плоскости XY, высота по Z

  return geo;
}

/**
 * Генерирует параметры всех ниш для одного уровня
 *
 * Работаем в плоскости XY (как Shape), высота по Z
 * BoxGeometry: X = ширина, Y = глубина (наружу), Z = высота
 */
interface NicheParams {
  position: THREE.Vector3; // центр бокса в 3D (x, y, z) где z = высота
  rotationZ: number; // угол поворота вокруг Z (вертикальной оси)
}

function generateNicheParams(
  innerRadius: number,
  nichesPerWall: number,
  level: number
): NicheParams[] {
  const niches: NicheParams[] = [];
  const innerVerts = getPentagonVertices(innerRadius);

  for (let wallIndex = 0; wallIndex < 5; wallIndex++) {
    const wallStart = innerVerts[wallIndex];
    const wallEnd = innerVerts[(wallIndex + 1) % 5];

    // Направление вдоль стены (в 2D: x, y)
    const wallDir = new THREE.Vector2(wallEnd.x - wallStart.x, wallEnd.y - wallStart.y).normalize();

    // Направление наружу (в сторону внешнего контура)
    const outwardNormal = getWallOutwardNormal(innerVerts, wallIndex);

    // Угол поворота вокруг Z (вертикальной оси в нашей системе координат):
    // BoxGeometry: X = ширина, Y = глубина
    // По умолчанию Y бокса направлен по +Y (0, 1)
    // Нам нужно повернуть так, чтобы Y бокса смотрел в направлении outwardNormal
    // Угол вектора outwardNormal = atan2(y, x) (стандартная формула)
    // Угол оси +Y = atan2(1, 0) = PI/2
    // Нужный поворот = угол_outward - PI/2
    const outwardAngle = Math.atan2(outwardNormal.y, outwardNormal.x);
    const rotationZ = outwardAngle - Math.PI / 2;

    let currentPos = PARTITION_WIDTH; // начинаем после первой перегородки

    for (let nicheIndex = 0; nicheIndex < nichesPerWall; nicheIndex++) {
      // Пропускаем ниши в зоне входа
      if (isEntranceNiche(wallIndex, nicheIndex, level)) {
        currentPos += NICHE_WIDTH + PARTITION_WIDTH;
        continue;
      }

      // Центр ниши вдоль стены
      const nicheCenterAlongWall = currentPos + NICHE_WIDTH / 2;

      // Позиция на внутреннем контуре (в 2D)
      const posOnInner = new THREE.Vector2(
        wallStart.x + wallDir.x * nicheCenterAlongWall,
        wallStart.y + wallDir.y * nicheCenterAlongWall
      );

      // Центр бокса ниши сдвинут наружу на половину глубины
      const nicheCenter2D = new THREE.Vector2(
        posOnInner.x + outwardNormal.x * (NICHE_DEPTH / 2),
        posOnInner.y + outwardNormal.y * (NICHE_DEPTH / 2)
      );

      // Z позиция - центр ниши по высоте (с учётом пола)
      const zPos = FLOOR_THICKNESS + NICHE_HEIGHT / 2;

      // 3D координаты: X, Y из 2D, Z = высота
      niches.push({
        position: new THREE.Vector3(nicheCenter2D.x, nicheCenter2D.y, zPos),
        rotationZ,
      });

      currentPos += NICHE_WIDTH + PARTITION_WIDTH;
    }
  }

  return niches;
}

/**
 * Создаёт трансформированную геометрию бокса для ниши
 * Применяем поворот и позицию напрямую к вершинам геометрии
 *
 * В нашей системе координат (XY плоскость, Z вверх):
 * - BoxGeometry(width, depth, height) = (X, Y, Z)
 * - X = ширина ниши (вдоль стены)
 * - Y = глубина ниши (наружу)
 * - Z = высота ниши (вверх)
 */
function createTransformedNicheGeometry(
  position: THREE.Vector3,
  rotationZ: number
): THREE.BufferGeometry {
  // X = ширина, Y = глубина, Z = высота
  // Добавляем небольшой запас для надёжного пересечения с CSG
  const EPSILON = 0.01;
  const geo = new THREE.BoxGeometry(
    NICHE_WIDTH + EPSILON,
    NICHE_DEPTH + EPSILON,
    NICHE_HEIGHT + EPSILON
  );

  // Создаём матрицы отдельно и перемножаем в правильном порядке
  // Сначала поворот вокруг Z, потом перенос
  const rotationMatrix = new THREE.Matrix4().makeRotationZ(rotationZ);
  const translationMatrix = new THREE.Matrix4().makeTranslation(position.x, position.y, position.z);

  // Порядок: сначала поворот, потом перенос
  // M = T * R означает: сначала R применяется к вершинам, потом T
  const matrix = new THREE.Matrix4().multiplyMatrices(translationMatrix, rotationMatrix);

  // Применяем трансформацию к геометрии
  geo.applyMatrix4(matrix);

  return geo;
}

/**
 * Создаёт геометрию проёма входа
 * Бокс на всю высоту входа, который вычитается из стены
 */
function createEntranceHoleGeometry(innerRadius: number): THREE.BufferGeometry {
  const innerVerts = getPentagonVertices(innerRadius);
  const wallStart = innerVerts[ENTRANCE_WALL];
  const wallEnd = innerVerts[(ENTRANCE_WALL + 1) % 5];

  const wallDir = new THREE.Vector2(wallEnd.x - wallStart.x, wallEnd.y - wallStart.y).normalize();
  const outwardNormal = getWallOutwardNormal(innerVerts, ENTRANCE_WALL);

  // Позиция центра входа вдоль стены
  // Начинаем с первой перегородки, затем ENTRANCE_START_NICHE полных ячеек (ниша + перегородка)
  // Затем половина ширины входа
  const entranceCenterAlongWall =
    PARTITION_WIDTH +
    ENTRANCE_START_NICHE * (NICHE_WIDTH + PARTITION_WIDTH) +
    ENTRANCE_WIDTH_METERS / 2;

  // Центр входа в 2D (в середине толщины стены)
  const entranceCenter2D = new THREE.Vector2(
    wallStart.x + wallDir.x * entranceCenterAlongWall + outwardNormal.x * (WALL_THICKNESS / 2),
    wallStart.y + wallDir.y * entranceCenterAlongWall + outwardNormal.y * (WALL_THICKNESS / 2)
  );

  // Z позиция - центр по высоте входа
  const zPos = ENTRANCE_HEIGHT_METERS / 2;

  // Угол поворота
  const outwardAngle = Math.atan2(outwardNormal.y, outwardNormal.x);
  const rotationZ = outwardAngle - Math.PI / 2;

  // Создаём бокс с небольшим запасом для CSG
  const EPSILON = 0.01;
  const geo = new THREE.BoxGeometry(
    ENTRANCE_WIDTH_METERS + EPSILON,
    WALL_THICKNESS + EPSILON,
    ENTRANCE_HEIGHT_METERS + EPSILON
  );

  // Трансформируем
  const rotationMatrix = new THREE.Matrix4().makeRotationZ(rotationZ);
  const translationMatrix = new THREE.Matrix4().makeTranslation(
    entranceCenter2D.x,
    entranceCenter2D.y,
    zPos
  );
  const matrix = new THREE.Matrix4().multiplyMatrices(translationMatrix, rotationMatrix);
  geo.applyMatrix4(matrix);

  return geo;
}

/**
 * Создаёт финальную геометрию уровня: сплошная стена минус ниши (и вход на нижних уровнях)
 */
function createLevelWithNichesGeometry(
  innerRadius: number,
  nichesPerWall: number,
  level: number
): THREE.BufferGeometry {
  const evaluator = new Evaluator();

  // 1. Создаём сплошную стену
  const solidWallGeo = createSolidWallGeometry(innerRadius);
  let result = new Brush(solidWallGeo);
  result.updateMatrixWorld();

  // 2. Генерируем параметры ниш (с учётом входа)
  const nicheParams = generateNicheParams(innerRadius, nichesPerWall, level);

  // 3. Вычитаем каждую нишу
  for (const params of nicheParams) {
    // Создаём геометрию с уже применённой трансформацией
    const nicheGeo = createTransformedNicheGeometry(params.position, params.rotationZ);
    const nicheBrush = new Brush(nicheGeo);
    nicheBrush.updateMatrixWorld();

    // Вычитаем
    result = evaluator.evaluate(result, nicheBrush, SUBTRACTION);

    // Освобождаем память
    nicheGeo.dispose();
  }

  // 4. Вычитаем проём входа на уровнях 1..ENTRANCE_HEIGHT
  if (level <= ENTRANCE_HEIGHT) {
    const entranceGeo = createEntranceHoleGeometry(innerRadius);
    const entranceBrush = new Brush(entranceGeo);
    entranceBrush.updateMatrixWorld();
    result = evaluator.evaluate(result, entranceBrush, SUBTRACTION);
    entranceGeo.dispose();
  }

  // Освобождаем память
  solidWallGeo.dispose();

  return result.geometry;
}

// ============================================
// КОМПОНЕНТЫ
// ============================================

interface PentagonLevelProps {
  level: number; // 1-8
  innerRadius: number;
  nichesPerWall: number;
}

function PentagonLevel({ level, innerRadius, nichesPerWall }: PentagonLevelProps) {
  const zPosition = (level - 1) * LEVEL_HEIGHT; // Z = высота в нашей системе координат

  // Загружаем металлические текстуры
  const textures = useTexture({
    map: "/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_Color.jpg",
    normalMap: "/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_NormalGL.jpg",
    roughnessMap: "/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_Roughness.jpg",
    metalnessMap: "/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_Metalness.jpg",
  });

  // Настраиваем повторение текстуры
  useMemo(() => {
    Object.values(textures).forEach((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 2);
    });
  }, [textures]);

  const geometry = useMemo(() => {
    return createLevelWithNichesGeometry(innerRadius, nichesPerWall, level);
  }, [innerRadius, nichesPerWall, level]);

  return (
    <group position={[0, 0, zPosition]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial {...textures} color="#C9943D" roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * Главный компонент с полными размерами (31 ниша на сторону)
 */
export function PentagonalStructure() {
  return (
    <group>
      <PentagonLevel level={1} innerRadius={INNER_RADIUS} nichesPerWall={NICHES_PER_WALL} />
    </group>
  );
}

/**
 * Тестовая структура - использует NICHES_PER_WALL, INNER_RADIUS и LEVELS из config.ts
 * Изменяй константы в config.ts для настройки размера
 */
export function TestPentagonalStructure() {
  // Создаём массив уровней [1, 2, 3, ..., LEVELS]
  const levels = useMemo(() => Array.from({ length: LEVELS }, (_, i) => i + 1), []);

  return (
    <group>
      {levels.map((level) => (
        <PentagonLevel
          key={level}
          level={level}
          innerRadius={INNER_RADIUS}
          nichesPerWall={NICHES_PER_WALL}
        />
      ))}
    </group>
  );
}

/**
 * Отладочная визуализация - показывает боксы ниш отдельно от стены
 * В системе координат XY (Z вверх)
 */
export function DebugNicheBoxes() {
  // Показываем ниши первого уровня (без входа)
  const nicheParams = useMemo(() => generateNicheParams(INNER_RADIUS, NICHES_PER_WALL, 1), []);

  return (
    <group>
      {nicheParams.map((params, i) => (
        <mesh key={i} position={params.position} rotation={[0, 0, params.rotationZ]}>
          {/* X = ширина, Y = глубина, Z = высота */}
          <boxGeometry args={[NICHE_WIDTH, NICHE_DEPTH, NICHE_HEIGHT]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      ))}
      <axesHelper args={[20]} />
    </group>
  );
}
